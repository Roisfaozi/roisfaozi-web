import { useEffect, useState } from 'react'

export default function Footer() {
  const [pageURL, setPageURL] = useState(0)
  const year = new Date().getFullYear()
  useEffect(() => {
    setPageURL(window.location.origin)
  })
  return (
    <footer className='footer'>
      <p>
        © {year} Designer and Developed by <a href={pageURL}> Rois Faozi.</a>
      </p>
    </footer>
  )
}
