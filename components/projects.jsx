import Image from 'next/image'
import becare from '../assets/becare.png'
import nonton from '../assets/nonton.png'
import staycation from '../assets/staycation.png'
export default function Projects() {
  return (
    <section className='section-container py-[70px]'>
      <h2 className='section-title pl-[200px]'>My Creative Works</h2>
      <p className='section-description pl-[200px] pb-[85px]'>
        These are a selection of my recent works.
      </p>
      <div className='project-section'>
        <div className='project-item'>
          <div className='project-intro'>
            <h3 className='project-name'>Nonton</h3>
            <p className='project-desc'>
              Nonton is an React JS SEO friendly web application that lets you
              browse for movies and tv-shows. You can watch trailers, browse
              collection and discover upcoming or trending movies.
            </p>
            <div className='technology'>
              <p>React JS</p>
              <p>Next JS</p>
              <p>Tailwind CSS</p>
              <p>PWA</p>
              <p>Sitemap</p>
              <p>Vercel</p>
            </div>
          </div>
          <div className='block'>
            <Image
              src={`${nonton.src}`}
              alt={'staycation'}
              width={508}
              height={287}
              priority={true}
            />
          </div>
        </div>
        <div className='project-item reverse'>
          <div className='project-intro'>
            <h3 className='project-name'>BeCare</h3>
            <p className='project-desc'>
              BeCare is a web-based application to identify health conditions.
              This application can help you to find out your health conditions
              such as Diabetes, Obesity and blood sugar levels. Developed by
              Rois Faozi.
            </p>
            <div className='technology'>
              <p>React JS</p>
              <p>Next JS</p>
              <p>Tailwind CSS</p>
              <p>PWA</p>
              <p>Netlify</p>
            </div>
          </div>
          <div className='block'>
            <Image
              src={`${becare.src}`}
              alt={'staycation'}
              width={508}
              height={287}
              priority={true}
            />
          </div>
        </div>
        <div className='project-item'>
          <div className='project-intro'>
            <h3 className='project-name'>Staycation</h3>
            <p className='project-desc'>
              Porject Staycation is MERN Stack website which provides hotel and
              tour booking services for vacations without thinking about finding
              a place to stay close to tourist attractions.
            </p>
            <div className='technology'>
              <p>React JS</p>
              <p>Node JS</p>
              <p>Express JS</p>
              <p>MongoDB</p>
              <p>Bootstrap</p>
              <p>Heroku</p>
              <p>Netlify</p>
            </div>
          </div>
          <div className='block'>
            <Image
              src={`${staycation.src}`}
              alt={'staycation'}
              width={508}
              height={287}
              priority={true}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
