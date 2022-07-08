import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const btnRef = useRef()
  useEffect(() => {
    const closeNemu = (e) => {
      if (e.path[1] !== btnRef.current) {
        setOpen(false)
      }
    }

    document.body.addEventListener('click', closeNemu)
    return () => {
      document.body.removeEventListener('click', closeNemu)
    }
  }, [])

  return (
    <header className='navigation-main'>
      <div className='container mx-auto'>
        <div className='relative flex items-center justify-between'>
          <div className='px-4'>
            <Link href='/'>
              <a className='block py-6 text-lg font-bold text-primary'>
                <svg
                  width='73'
                  height='32'
                  viewBox='0 0 73 32'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M10.72 28.7L0.16 18.14L10.72 7.58L14.02 10.858L6.496 18.14L14.02 25.422L10.72 28.7ZM62.4135 28.7L59.1355 25.422L66.6375 18.14L59.1355 10.858L62.4135 7.58L72.9955 18.14L62.4135 28.7Z'
                    fill='#8B8B93'
                  />
                  <path
                    d='M25.1386 32V0.319999H38.2286C38.5366 0.319999 38.9326 0.334665 39.4166 0.363998C39.9006 0.378666 40.3479 0.422666 40.7586 0.495999C42.5919 0.774665 44.1026 1.38333 45.2906 2.322C46.4933 3.26066 47.3806 4.44867 47.9526 5.886C48.5393 7.30867 48.8326 8.89267 48.8326 10.638C48.8326 13.2193 48.1799 15.4413 46.8746 17.304C45.5693 19.152 43.5673 20.296 40.8686 20.736L38.6026 20.934H30.4406V32H25.1386ZM43.3326 32L37.0846 19.108L42.4746 17.92L49.3386 32H43.3326ZM30.4406 15.984H38.0086C38.3019 15.984 38.6319 15.9693 38.9986 15.94C39.3653 15.9107 39.7026 15.852 40.0106 15.764C40.8906 15.544 41.5799 15.1553 42.0786 14.598C42.5919 14.0407 42.9513 13.41 43.1566 12.706C43.3766 12.002 43.4866 11.3127 43.4866 10.638C43.4866 9.96333 43.3766 9.274 43.1566 8.57C42.9513 7.85133 42.5919 7.21333 42.0786 6.656C41.5799 6.09867 40.8906 5.71 40.0106 5.49C39.7026 5.402 39.3653 5.35067 38.9986 5.336C38.6319 5.30667 38.3019 5.292 38.0086 5.292H30.4406V15.984Z'
                    fill='#191919'
                  />
                </svg>
              </a>
            </Link>
          </div>
          <div className='hamburger-wrapper'>
            <button
              ref={btnRef}
              id='hamburger'
              name='hamburger'
              type='button'
              onClick={() => setOpen(!open)}
              className={`${
                open ? 'hamburger-active' : ''
              } absolute right-4 block 2md:hidden`}>
              <span className='hamburger-line origin-top-left transition duration-300 ease-in-out'></span>
              <span className='hamburger-line transition duration-300 ease-in-out'></span>
              <span className='hamburger-line origin-bottom-left transition duration-300 ease-in-out'></span>
            </button>

            <nav
              id='nav-menu'
              className={`${
                open ? '' : 'hidden transition duration-200 ease-in-out'
              } nav-menu `}>
              <ul className='block 2md:flex'>
                <li
                  className={`${
                    open
                      ? ' transition duration-500 translate-x-6 ease-in-out'
                      : ''
                  } group bg-white`}>
                  <a href='#home' className='nav-menu-link'>
                    Home
                  </a>
                </li>
                <li
                  className={`${
                    open
                      ? ' transition duration-600 translate-x-6 ease-in-out'
                      : ''
                  } group bg-white`}>
                  <a href='#story' className='nav-menu-link'>
                    About
                  </a>
                </li>
                <li
                  className={`${
                    open
                      ? ' transition duration-700 translate-x-6 ease-in-out'
                      : ''
                  } group bg-white`}>
                  <a href='#projecta' className='nav-menu-link'>
                    Project
                  </a>
                </li>

                <li
                  className={`${
                    open
                      ? ' transition duration-[800ms] translate-x-6 ease-in-out'
                      : ''
                  } group bg-white`}>
                  <a href='#contact' className='nav-menu-link'>
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
