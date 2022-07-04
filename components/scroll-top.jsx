import { useEffect, useState } from 'react'

export default function ScrollTop() {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.pageYOffset > 500) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])
  return (
    <div id='scroll-top'>
      <button
        type='button'
        onClick={scrollToTop}
        className={`${isVisible ? 'opacity-100' : 'opacity-0'} text-link-top`}>
        Top
        <span>
          <svg
            width='17'
            height='58'
            viewBox='0 0 17 58'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M8.50001 58L8.50001 1M8.50001 1L16.5 10M8.50001 1L0.499998 10'
              stroke='#5E5E5E'
            />
          </svg>
        </span>
      </button>
    </div>
  )
}
