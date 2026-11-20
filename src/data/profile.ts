export interface ImpactStat {
  value: string
  label: string
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface ExperienceRole {
  id: string
  company: string
  role: string
  period: string
  location: string
  category: 'enterprise' | 'contract'
  badge: 'Full-Time' | 'Open Source' | 'Contract'
  url?: string
  bullets: string[]
  technologies: string[]
}

export interface Credential {
  title: string
  issuer: string
  period: string
  kind: 'education' | 'certification'
}

export const profile = {
  name: 'Rois Faozi',
  role: 'Full-Stack Developer',
  location: 'Tangerang, Indonesia (Remote-Ready)',
  email: 'roisfaozi8@gmail.com',
  github: 'https://github.com/Roisfaozi',
  linkedin: 'https://linkedin.com/in/roisfaozi',
  availability: 'Open to remote engineering roles',
} as const

export const impactStats: ImpactStat[] = [
  { value: '90%', label: 'SQL latency reduction (9s to 900ms)' },
  { value: '40k+', label: 'Managed IoT devices in production' },
  { value: '99.9%', label: 'Hospital QMS availability' },
  { value: '0', label: 'Critical banking pen-test findings' },
]

export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages',
    items: ['Go (Golang)', 'TypeScript', 'JavaScript (ES6+)', 'SQL', 'Python', 'HTML5 / CSS3'],
  },
  {
    category: 'Backend & Architecture',
    items: [
      'Clean Architecture',
      'Hexagonal Architecture',
      'Event-Driven Architecture',
      'Modular Monolith',
      'Microservices',
      'Chi',
      'Gin',
      'Fiber',
      'Node.js',
      'Express',
      'NestJS',
      'Inngest',
      'GraphQL',
    ],
  },
  {
    category: 'Frontend & Web',
    items: [
      'React',
      'Next.js',
      'Vue 3 (Vite)',
      'Astro',
      'Tailwind CSS',
      'Zustand',
      'Redux',
      'Shadcn UI',
      'React Hook Form',
      'Zod',
    ],
  },
  {
    category: 'Databases & Caching',
    items: [
      'PostgreSQL (pgx, Raw SQL)',
      'Multi-Schema Isolation',
      'MySQL',
      'MongoDB',
      'Redis (Pub/Sub, Caching)',
      'Prisma ORM',
      'Query Indexing & Tuning',
    ],
  },
  {
    category: 'Cloud, DevOps & Protocols',
    items: [
      'AWS (S3, EC2)',
      'Docker',
      'Nginx',
      'MQTT (Eclipse Paho)',
      'WebSockets (Gorilla)',
      'SSE',
      'Casbin RBAC',
      'OAuth 2.0 / JWT',
      'Prometheus',
      'MinIO',
      'GitHub Actions',
      'GitLab CI',
      'Jest / SQLMock',
      'k6 Load Testing',
      'Vercel',
      'Linux',
    ],
  },
]

export const experienceRoles: ExperienceRole[] = [
  {
    id: 'sentuh-digital',
    company: 'PT. Sentuh Digital Teknologi',
    role: 'Full-Stack Developer',
    period: 'Jul 2025 - Present',
    location: 'BSD, Tangerang, Indonesia',
    category: 'enterprise',
    badge: 'Full-Time',
    bullets: [
      "Architected an enterprise Device Management System (DMS) in Go (Chi router, raw SQL, pgx) for one of Indonesia's largest state-owned commercial banks, managing 40k+ corporate IoT devices across on-premise air-gapped environments.",
      'Engineered hybrid real-time communication infrastructure using MQTT (Eclipse Paho) and WebSockets (Gorilla) for hardware telemetry, centralized logging, and remote command dispatch with sub-second latency, cutting incident detection time by 60%.',
      'Implemented fine-grained menu-level Role-Based Access Control (RBAC) via Casbin with OWASP security compliance, achieving zero critical vulnerabilities in banking penetration tests.',
      'Modernized the healthcare Queue Management System (QMS) backend in Go and MySQL for Medistra Hospital and BitHealth (BIH), eliminating ticket collisions via a prefix-based global sequencing algorithm and multi-tenant branch architecture.',
      'Developed patient journey tracking and real-time waiting-room display signage services, synchronizing queue states across multi-department clinic workflows with 99.9% system availability.',
      'Configured system observability with Prometheus metrics and structured logging, optimizing SQL queries and indexes under k6 load tests to slash latency by 90% (from 9s down to 900ms) and fix middleware race conditions.',
      'Standardized Go backend scaffolding, Docker and Nginx CI/CD pipelines, and modular React, Vue.js, and Next.js component libraries while mentoring junior engineers in design and code reviews, cutting setup time from 5 days to 3 hours and raising deployment efficiency by 60%.',
    ],
    technologies: [
      'Go (Chi, pgx)',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'MySQL',
      'Redis',
      'MQTT',
      'WebSockets',
      'Docker',
      'Nginx',
      'Casbin RBAC',
      'Prometheus',
      'k6',
      'React',
      'Vue.js',
      'Next.js',
    ],
  },
  {
    id: 'carbon-erp',
    company: 'Carbon Manufacturing ERP (crbnos/carbon)',
    role: 'Open Source Contributor',
    period: 'May 2026 - Present',
    location: 'Global Open Source',
    category: 'enterprise',
    badge: 'Open Source',
    url: 'https://github.com/crbnos/carbon',
    bullets: [
      'Authored and merged PR #866 into upstream core, implementing async group member fetching, server-side search, and prefetch-on-hover caching across 12 files (+367/-72 lines).',
      'Co-authored merged PR #1002 (initiated in PR #879), engineering an AI-powered PDF extraction and auto-fill pipeline for Sales RFQs and Purchase Invoices with Inngest background event triggers across 20+ form endpoints.',
      'Proposed and refactored company-specific private storage architecture (PR #682), migrating multi-tenant file handling across ERP and MES modules to isolated company buckets with authenticated signed URLs.',
      'Enforced strict TypeScript type safety, peer code reviews, automated CI/CD checks, and unit test coverage across core ERP and supply-chain modules.',
    ],
    technologies: [
      'TypeScript',
      'React',
      'Remix / Vite',
      'Inngest',
      'PostgreSQL',
      'Supabase Storage',
      'Tailwind CSS',
      'Jest',
      'Biome',
    ],
  },
  {
    id: 'mainfantasy',
    company: 'MainFantasy - Crypto Trading Platform',
    role: 'Full-Stack Developer',
    period: 'Mar 2025 - Jun 2025',
    location: 'Bharatpur, India (Remote)',
    category: 'contract',
    badge: 'Contract',
    bullets: [
      'Collaborated directly with the CTO to architect a live crypto fantasy trading platform, building a high-throughput point-based scoring engine processing real-time market data feeds.',
      'Engineered real-time leaderboard, dashboard, and trading history synchronization using GraphQL subscriptions, delivering zero-latency updates without page refreshes for 5K+ users.',
      'Automated competition onboarding workflows so new users dynamically rank on the leaderboard immediately upon executing their first trade.',
      'Constructed 30+ accessible, responsive UI components and trading modals with Next.js and Tailwind CSS, achieving 95+ Lighthouse performance scores on mobile viewports.',
      'Configured Meta (Facebook) conversion tracking events through Next.js API routes to measure marketing campaign performance.',
    ],
    technologies: ['Next.js', 'TypeScript', 'GraphQL Subscriptions', 'Tailwind CSS', 'REST APIs'],
  },
  {
    id: 'crypto-defi',
    company: 'Crypto Trading Token (DeFi Platform)',
    role: 'Front-End Developer',
    period: 'Mar 2025 - May 2025',
    location: 'London, UK (Remote)',
    category: 'contract',
    badge: 'Contract',
    bullets: [
      'Built high-performance DeFi trading dashboards in Next.js and TypeScript featuring interactive candlestick charting and resizable viewports across 50+ token trading pairs.',
      'Engineered global application state with Zustand, managing live crypto wallet synchronization, MEV protection toggles, and streaming order book transactions.',
      'Built reusable component libraries (wallet trackers, strategy forms, transaction cards) integrated with React Hook Form and Zod for strict client-side copy-trading validation.',
      'Optimized client rendering speeds with window virtualization, memoization, and debouncing, maintaining steady 60fps interaction and eliminating frame drops during high-volume transaction spikes.',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Next.js',
      'Zustand',
      'React Hook Form',
      'Zod',
      'Tailwind CSS',
      'Framer Motion',
    ],
  },
  {
    id: 'bioking',
    company: 'Bioking - Microsite & Analytics Platform',
    role: 'Full-Stack Developer',
    period: 'Dec 2024 - Feb 2025',
    location: 'Oslo, Norway (Remote)',
    category: 'contract',
    badge: 'Contract',
    bullets: [
      'Engineered a full-stack microsite and link management SaaS platform with JWT-based authentication, custom branded bio-pages, and automated shortlink redirection.',
      'Built a real-time click analytics and geolocation aggregation engine using Prisma ORM and PostgreSQL, rendering visitor demographics, locations, and CTR trends across 10K+ monthly links.',
      'Designed optimized PostgreSQL schemas, indexing strategies, and Node.js, NestJS, and Express RESTful APIs to deliver sub-100ms response times on high-traffic public redirect routes and analytics dashboards.',
    ],
    technologies: ['Node.js', 'NestJS', 'Express', 'PostgreSQL', 'Prisma ORM', 'React', 'Tailwind CSS'],
  },
  {
    id: 'guillaumemercyvenal',
    company: 'Guillaumemercyvenal - Decentralized Management Platform',
    role: 'Full-Stack Developer',
    period: 'Nov 2023 - Feb 2024',
    location: 'Morocco (Remote)',
    category: 'contract',
    badge: 'Contract',
    bullets: [
      'Developed a decentralized web application featuring real-time split-pane collaborative interfaces using Svelte and GUN.js for peer-to-peer data synchronization.',
      'Implemented persistent authentication and local-first profile management systems ensuring reliable user sessions and profile asset persistence across page reloads.',
      'Designed and enforced Role-Based Access Control (RBAC), empowering group administrators to manage granular member permissions across decentralized workspaces.',
      'Enhanced the expense tracking module with descriptive metadata fields and chronological logging, deployed through streamlined Vite and Vercel pipelines.',
    ],
    technologies: ['Svelte', 'GUN.js', 'JavaScript', 'Vite', 'Vercel', 'RBAC'],
  },
  {
    id: 'wazzapp-ai',
    company: 'Wazzapp AI (Wazzapp.me) - Chatbot Platform',
    role: 'Full-Stack Developer',
    period: 'Feb 2023 - Mar 2023',
    location: 'Rennes, France (Remote)',
    category: 'contract',
    badge: 'Contract',
    bullets: [
      'Architected a multi-tenant AI chatbot SaaS in Next.js integrating OpenAI GPT APIs with Twilio Programmable Messaging, handling 15K+ monthly automated WhatsApp conversations.',
      'Integrated Stripe subscription billing (tiers, renewals, invoicing, and webhook reconciliation) alongside Google OAuth 2.0 authentication for 500+ registered active users.',
      'Engineered an administrative dashboard for real-time user management, chatbot configuration tuning, subscription monitoring, and system performance tracking.',
    ],
    technologies: ['Next.js', 'Node.js', 'OpenAI API', 'Twilio API', 'Stripe Billing', 'OAuth 2.0', 'Tailwind CSS'],
  },
  {
    id: 'vegetable-recipe',
    company: 'Vegetable Recipe App',
    role: 'Front-End Developer',
    period: 'Feb 2023 - Mar 2023',
    location: 'Bangalore, India (Remote)',
    category: 'contract',
    badge: 'Contract',
    bullets: [
      'Developed a dynamic recipe discovery platform integrating external REST APIs to display nutritional profiles, ingredients, and step-by-step cooking instructions.',
      'Built real-time filtering, multi-category search, and client-side routing for responsive browsing across desktop and mobile viewports.',
      'Integrated Firebase Authentication and Firestore for secure onboarding, persistent saved favorites across sessions, and resilient API error handling.',
    ],
    technologies: ['React', 'JavaScript', 'Firebase Auth', 'Firestore', 'REST APIs', 'Tailwind CSS'],
  },
]

export const credentials: Credential[] = [
  {
    title: 'Bachelor of Computer Science (S.Kom)',
    issuer: 'Cyber University of Muhammadiyah, Indonesia',
    period: 'Expected 2028',
    kind: 'education',
  },
  {
    title: 'AWS Cloud Developing (ACD2) Certification',
    issuer: 'Digitalent PROA x AWS Academy (120 Hours)',
    period: '2024',
    kind: 'certification',
  },
  {
    title: 'Full-Stack Web Golang Intensive Program',
    issuer: 'Fazztrack, Indonesia',
    period: '2024',
    kind: 'certification',
  },
]
