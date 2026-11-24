---
title: "Memangkas Latensi Query PostgreSQL hingga 90% pada Sistem Go Berskala Tinggi"
description: "Catatan teknis bagaimana kami menurunkan latensi P95 PostgreSQL dari 9 detik ke 900ms di backend Go dengan memisahkan resolusi scope dari correlated subquery, menyesuaikan urutan composite B-tree index, dan memangkas join pada query COUNT."
lang: "id"
translationKey: "postgresql-query-latency-90-percent"
publishedAt: "2026-09-07"
updatedAt: "2026-11-23"
readingTime: "8 menit baca"
readingMinutes: 8
category: "Performa PostgreSQL & Go"
tags:
  - "PostgreSQL"
  - "Go (Golang)"
  - "Optimasi Query"
  - "Database Indexing"
  - "k6 Load Testing"
  - "Arsitektur Backend"
keywords:
  - "optimasi query PostgreSQL"
  - "tuning performa SQL Go"
  - "composite B-tree index PostgreSQL"
  - "optimasi correlated subquery"
  - "SARGable SQL query"
  - "studi kasus PostgreSQL Rois Faozi"
metrics:
  - value: "9d -> 900ms"
    label: "Latensi Query P95"
  - value: "90%"
    label: "Penurunan Latensi"
  - value: "40.000+"
    label: "Baris Data Simulasi"
  - value: "6"
    label: "Perbaikan Query & Cache"
featured: true
draft: false
---

Performa *query* di lingkungan pengembangan sering berjalan mulus, lalu mendadak turun drastis saat melayani trafik produksi yang padat. Hasil uji beban pun mulai tidak konsisten.

Hambatan tersebut muncul pada sebuah layanan manajemen aset berbasis Go dan PostgreSQL ketika tabel `fleet_nodes` melampaui 40.000 baris aktif. Saat pengujian beban memakai `k6`, waktu respons P95 pada rute daftar bertabel dan ringkasan status menembus angka 9 detik, padahal penggunaan CPU dan memori server basis data masih berada di batas wajar. Meningkatkan kapasitas server atau menyembunyikan masalah di balik tembolok (*cache*) berdurasi lima menit tidak akan menyentuh akar persoalannya. Setelah tim memprofil rencana eksekusi SQL secara langsung, enam perbaikan terarah berhasil menurunkan P95 tersebut menjadi 900ms.

Seluruh cuplikan kode Go serta SQL di bawah memakai model studi sintetis (`fleet_nodes`, `accounts`, `child_groups`). Teknik optimasi ini tetap dapat diterapkan tanpa membuka skema privat mana pun.

---

## Mengukur Durasi Tiap Operasi Penyimpanan

Sebelum menyentuh sintaks SQL, setiap operasi pada lapisan penyimpanan dibungkus dengan pencatat waktu ringan. Helper ini akan mengirimkan durasi eksekusi serta status galat menuju histogram Prometheus.

```go
// Helper studi untuk mencatat durasi operasi penyimpanan
func (s *Store) observeOp(op string, started time.Time, err error) {
	status := "ok"
	if err != nil {
		status = "error"
	}
	s.metrics.OpDuration.WithLabelValues(op, status).Observe(time.Since(started).Seconds())
}
```

Sebaran data histogram tersebut langsung mengarah pada rute daftar bertabel dan endpoint ringkasan status. Saat metrik itu disandingkan dengan output `EXPLAIN (ANALYZE, BUFFERS)`, terlihat bahwa lonjakan sembilan detik tadi muncul akibat enam kebiasaan kode yang menumpuk ketika puluhan pengguna membuka dasbor secara serentak. Tidak ada satu indeks tunggal yang menjadi penyebabnya.

---

## Memisahkan Resolusi Hak Akses dari *Correlated Subquery* `EXISTS`

Pada sistem *multi-workspace*, setiap akun memiliki batas visibilitas data yang berbeda. Ada akun global yang dapat mengakses seluruh baris, ada akun tingkat grup induk (`parent_group_id`) yang membawahi beberapa subgrup, dan ada pula akun yang hanya dapat melihat satu subgrup (`child_group_id`).

Implementasi awal menyatukan seluruh aturan tersebut di dalam satu blok `EXISTS` yang disematkan pada setiap perintah SQL.

```sql
-- CONTOH STUDI (SEBELUM): Correlated EXISTS dengan banyak percabangan OR
SELECT n.id, n.label, n.state, n.registered_at
FROM fleet_nodes n
WHERE EXISTS (
    SELECT 1
    FROM accounts a
    LEFT JOIN account_scopes s ON s.account_id = a.id
    WHERE a.id = $1
      AND (
          a.is_global = TRUE
          OR (s.parent_group_id IS NOT NULL AND n.parent_group_id = s.parent_group_id)
          OR (
              s.parent_group_id IS NOT NULL
              AND EXISTS (
                  SELECT 1 FROM child_groups cg
                  WHERE cg.id = n.child_group_id
                    AND cg.parent_group_id = s.parent_group_id
              )
          )
          OR (s.child_group_id IS NOT NULL AND n.child_group_id = s.child_group_id)
      )
)
ORDER BY n.registered_at DESC
LIMIT 25 OFFSET 0;
```

Menempatkan pembacaan cakupan akun sekaligus filter baris di dalam satu *correlated subquery* `EXISTS` menyulitkan *query planner* PostgreSQL menyederhanakan rencana eksekusi sejak awal karena percabangan `OR` di dalamnya menyentuh `n.parent_group_id` serta `n.child_group_id` sekaligus. Akibatnya, perencana SQL gagal memadatkan kondisi itu menjadi pencarian indeks `B-tree` tunggal, meskipun pemanggil sebenarnya hanya terikat pada satu `child_group_id`. Beban pemindaian tetap besar.

Masalah tersebut terselesaikan setelah pengecekan cakupan akun dipisahkan dari perintah SQL utama. Pertama, aplikasi Go mengambil cakupan akun satu kali melalui klaim sesi atau pembacaan *primary key* pada tabel `accounts`, lalu sebuah fungsi *builder* menyusun klausa `WHERE` yang sesuai bagi pemanggil.

```go
// CONTOH STUDI (SESUDAH): Hanya menyusun predikat SQL yang sesuai dengan scope pemanggil
type AccessScope struct {
	IsGlobal      bool
	ParentGroupID string
	ChildGroupID  string
}

func buildScopePredicate(alias string, scope AccessScope, args *[]any) string {
	if scope.IsGlobal {
		return "1 = 1"
	}
	if scope.ChildGroupID != "" {
		*args = append(*args, scope.ChildGroupID)
		return fmt.Sprintf("%s.child_group_id = $%d", alias, len(*args))
	}
	if scope.ParentGroupID != "" {
		*args = append(*args, scope.ParentGroupID)
		ref := fmt.Sprintf("$%d", len(*args))
		return fmt.Sprintf(
			"(%s.parent_group_id = %s OR EXISTS (SELECT 1 FROM child_groups cg WHERE cg.id = %s.child_group_id AND cg.parent_group_id = %s))",
			alias, ref, alias, ref,
		)
	}
	return "1 = 0"
}
```

Ketika akun global meminta data, klausa `WHERE` berubah menjadi `1 = 1`. Saat operator subgrup tunggal mengirim permintaan, PostgreSQL menerima kondisi `WHERE n.child_group_id = $1` yang dapat langsung memakai indeks.

---

## Menyelaraskan Indeks Komposit `B-tree` dengan Filter dan Urutan Sortir

Begitu klausa `WHERE` menjadi bersih, titik lambat berikutnya berpindah ke tahap pengurutan data (`ORDER BY`).

Sebuah perintah SQL kerap menyaring baris lewat `child_group_id = $1`, lalu mengurutkannya memakai `ORDER BY registered_at DESC LIMIT 25`. Dalam skenario itu, indeks satu kolom pada `(child_group_id)` masih memaksa PostgreSQL mengambil seluruh baris milik grup tersebut. Basis data kemudian mengurutkan semua baris itu di dalam memori sebelum memotong 25 baris pertama.

Indeks komposit yang memasangkan tiap kolom grup dengan stempel waktu (*timestamp*) menurun mengatasi masalah pengurutan ini. Selain itu, satu indeks komposit tambahan disiapkan khusus untuk mempercepat agregasi status.

```sql
-- Composite index untuk paginasi per cakupan grup
CREATE INDEX IF NOT EXISTS idx_fleet_nodes_child_registered
    ON fleet_nodes (child_group_id, registered_at DESC);

CREATE INDEX IF NOT EXISTS idx_fleet_nodes_parent_registered
    ON fleet_nodes (parent_group_id, registered_at DESC);

-- Composite index untuk perhitungan ringkasan status
CREATE INDEX IF NOT EXISTS idx_fleet_nodes_state_groups
    ON fleet_nodes (state, parent_group_id, child_group_id);
```

Dengan indeks `(child_group_id, registered_at DESC)`, mesin eksekutor dapat menelusuri pohon `B-tree` langsung dari data terbaru hingga 25 baris terpenuhi. Beban pengurutan di RAM pun hilang seluruhnya pada laporan `EXPLAIN (ANALYZE, BUFFERS)`. Urutan daftar tampil seketika.

---

## Menghapus Pembungkus `LOWER(COALESCE(...))` pada Kolom Berindeks

Indeks yang sudah terpasang pada kolom `state` tetap gagal terpakai apabila perintah SQL membungkus kolom itu di dalam fungsi.

```sql
-- SEBELUM: Pembungkus fungsi menghalangi pencarian langsung ke B-tree index n.state
WHERE LOWER(COALESCE(n.state, '')) = $2
ORDER BY
    CASE WHEN LOWER(COALESCE(n.state, '')) = 'active' THEN 0 ELSE 1 END,
    n.registered_at DESC
```

Nilai `fleet_nodes.state` di basis data sebenarnya sudah selalu disimpan dalam huruf kecil baku (`'active'`, `'inactive'`), sehingga pemanggilan `LOWER(COALESCE(n.state, ''))` untuk setiap kandidat baris hanya membuang siklus CPU dan menutup peluang pemindaian indeks. Normalisasi string pun dipindahkan ke Go lewat `strings.ToLower(strings.TrimSpace(rawState))` agar perbandingan kolom langsung memakai indeks. Indeks status kembali aktif.

```sql
-- SESUDAH: Perbandingan kolom langsung
WHERE n.state = $2
ORDER BY
    CASE WHEN n.state = 'active' THEN 0 ELSE 1 END,
    n.registered_at DESC
```

---

## Menghentikan Join Berlebih di `COUNT(*)` dan Memangkas Kolom Tabel

Halaman tabel berpaginasi umumnya menjalankan dua perintah SQL secara bersamaan. Perintah pertama menghitung jumlah total baris, sementara perintah kedua menarik irisan 25 data. Keduanya ternyata menyimpan ongkos pembacaan yang tidak diperlukan.

Pada sisi penghitungan total baris, implementasi lama selalu menyertakan `LEFT JOIN` ke `node_metadata`, yaitu tabel satelit berelasi 1:1 yang menyimpan atribut *runtime* perangkat.

```sql
-- SEBELUM: Join 1:1 tanpa syarat di dalam COUNT(*)
SELECT COUNT(*)
FROM fleet_nodes n
LEFT JOIN node_metadata m ON m.node_id = n.id
WHERE n.child_group_id = $1;
```

Berhubung relasinya 1:1 terhadap `fleet_nodes`, penyertaan join itu saat kriteria versi *runtime* kosong (`filter.RuntimeVersion == ""`) memicu puluhan ribu pencarian `B-tree` ekstra tanpa mengubah angka total baris. Pembentukan string join secara kondisional di Go langsung membuang proses pembacaan yang percuma itu.

```go
// SESUDAH: Hanya lakukan join ke node_metadata jika kriteria terkait sedang dipakai
metadataJoin := ""
if filter.RuntimeVersion != "" {
	metadataJoin = "LEFT JOIN node_metadata m ON m.node_id = n.id"
}

stmt := fmt.Sprintf(`
	SELECT COUNT(*)
	FROM fleet_nodes n
	%s
	WHERE %s
`, metadataJoin, whereClause)
```

Di sisi pengambilan irisan 25 baris, pemakaian ulang proyeksi detail ikut membawa belasan kolom *snapshot* telemetri yang lebar serta *blob* `JSONB` profil perangkat keras berukuran besar. Ditambah lagi, terdapat *scalar subquery* di dalam daftar `SELECT` untuk menarik nama tag pada setiap baris. Memisahkan proyeksi daftar khusus tabel antarmuka langsung memangkas I/O disk per halaman. Pembacaan *blob* `JSONB` dikembalikan ke endpoint detail satu unit, sedangkan pengambilan nama tag diganti dengan `LEFT JOIN` biasa.

---

## Hidrasi Metrik Live secara Opt-In dan LRU Cache Pendek

Pekerjaan ekstra di luar pemindaian tabel utama juga datang dari sinkronisasi metrik *real-time*. Sebelumnya, tampilan tabel standar selalu menghubungi Redis pada setiap permintaan sekadar untuk menempelkan indikator status koneksi *heartbeat*. Memindahkan bacaan Redis itu ke balik parameter `?include=live_metrics` membuat permintaan tabel rutin dapat tuntas sepenuhnya di PostgreSQL.

Selain itu, statistik ringkasan (`active`, `inactive`, `total`) terus diminta secara berkala oleh puluhan tab peramban operator yang aktif bersamaan. Pemasangan *cache* in-memory `expirable.LRU` (`hashicorp/golang-lru/v2/expirable`) dengan waktu kedaluwarsa (*TTL*) tiga detik per cakupan akses mampu meredam lonjakan permintaan ganda tersebut.

```go
// Bounded LRU cache 3 detik untuk ringkasan status
if summary, ok := s.summaryCache.Get(cacheKey); ok {
	return summary, nil
}
summary, err := s.fetchSummaryCounts(ctx, scope)
if err == nil {
	s.summaryCache.Add(cacheKey, summary)
}
return summary, err
```

Jeda tiga detik tersebut cukup singkat sehingga perubahan status pada unit tetap muncul nyaris seketika di layar pemantauan. Di sisi lain, basis data hanya perlu mengeksekusi satu kali perhitungan agregasi untuk setiap cakupan akses yang sedang dibaca beramai-ramai. Beban *polling* turun drastis.

---

## Menjaga Bentuk SQL Tetap Sehat di CI

Hasil penyetelan performa kerap kembali menurun seiring hadirnya fitur baru dari berbagai *pull request (PR)*. Penyertaan unit tes `go-sqlmock` akan memastikan join tabel satelit benar-benar terlewati ketika filter kosong dan tidak ada fungsi pembungkus baru pada kolom berindeks. Kebiasaan menguji ulang `EXPLAIN (ANALYZE, BUFFERS)` sebelum kode digabungkan ke `main` dapat mencegah regresi eksekusi sebelum menyentuh produksi. Eksekusi tetap terkendali.
