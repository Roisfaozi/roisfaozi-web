import Link from 'next/link'

export default function Contacts() {
  return (
    <section className='section-contact'>
      <div className='section contact'>
        <h1 className='header-title'>Let's work together.</h1>
        <p className='contact-desc'>
          Although I’m not currently looking for any new opportunities, my inbox
          is <br />
          always open. Whether you have a question or just want to say hi,{' '}
          <br />
          I’ll try my best to get back to you!
        </p>
        <div className='email-link'>
          <Link href='mailto:roisfaozi5@gmail.com'>
            <a>Say Hello</a>
          </Link>
        </div>
      </div>
    </section>
  )
}
