import Link from 'next/link'

export default function Header() {
  return (
    <header className='header'>
      <div className='header-wrapper'>
        <p>Hello, My name is</p>
        <h1 className='header-title'>
          Rois Faozi.
          <br />
          Front-end Developer.
        </h1>
        <p className='description'>
          A self-taught developer with an interest in visual design and <br />{' '}
          building exceptional digital experiences.
        </p>

        <div className='relative inline-block'>
          <div className='btn-email'>
            <Link href='mailto:roisfaozi5@gmail.com'>
              <a>roisfaozi5@gmail.com</a>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
