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
        <div id='scroll'>
          <a
            href='#story'
            className='text-link w-full'
            style={{ writingMode: 'vertical-rl' }}>
            Scroll Down
            <span>
              <svg
                width='18'
                height='58'
                viewBox='0 0 18 58'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M8.99999 -3.49692e-07L8.99998 57M8.99998 57L1 48M8.99998 57L17 48'
                  stroke='#5E5E5E'
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </header>
  )
}
