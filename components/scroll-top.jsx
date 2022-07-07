import { useEffect, useRef, useState } from 'react'

export default function ScrollTop() {
  const [isVisible, setIsVisible] = useState(false)
  const scrollRef = useRef(null)
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
    const animateScroll = () => {
      if (
        document.body.scrollTop > 2300 ||
        document.documentElement.scrollTop > 2300
      ) {
        scrollRef.current.classList.add('animate-pulse')
      } else {
        scrollRef.current.classList.remove('animate-pulse')
      }
    }
    window.addEventListener('scroll', animateScroll)
    return () => {
      window.removeEventListener('scroll', animateScroll)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])
  return (
    <div id='scroll-top' className={`${isVisible ? 'block' : 'hidden'}`}>
      <button
        ref={scrollRef}
        type='button'
        onClick={scrollToTop}
        className='text-link-top'>
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
