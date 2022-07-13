import Link from 'next/link'
import becare from '../assets/becare.avifs'
import nonton from '../assets/nonton.avifs'
import staycation from '../assets/staycation.avifs'
export default function Projects() {
  return (
    <section className='section-container py-[70px]' id='projects'>
      <h2 className='section-title 2md:px-[200px] sm:px-[100px] px-0'>
        My Creative Works
      </h2>
      <p className='section-description 2md:px-[200px] sm:px-[100px] px02 2md:pb-[85px] md:pb-12 pb-6'>
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
            <div className='sources'>
              <Link href='https://github.com/Roisfaozi/nonton'>
                <a aria-label='External Link' target='_blank'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    className='fill-current'
                    xmlns='http://www.w3.org/2000/svg'>
                    <title>GitHub</title>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z'
                    />
                  </svg>
                </a>
              </Link>
              <Link href='https://nonton.vercel.app'>
                <a aria-label='External Link' target='_blank'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    className='fill-current'
                    xmlns='http://www.w3.org/2000/svg'>
                    <title>External Link</title>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M9.546 20.25C9.546 20.4489 9.62502 20.6397 9.76567 20.7803C9.90632 20.921 10.0971 21 10.296 21H20.25C20.8467 21 21.419 20.7629 21.841 20.341C22.2629 19.919 22.5 19.3467 22.5 18.75V3.75C22.5 3.15326 22.2629 2.58097 21.841 2.15901C21.419 1.73705 20.8467 1.5 20.25 1.5H5.25C4.65326 1.5 4.08097 1.73705 3.65901 2.15901C3.23705 2.58097 3 3.15326 3 3.75V13.704C3 13.9029 3.07902 14.0937 3.21967 14.2343C3.36032 14.375 3.55109 14.454 3.75 14.454C3.94891 14.454 4.13968 14.375 4.28033 14.2343C4.42098 14.0937 4.5 13.9029 4.5 13.704V3.75C4.5 3.55109 4.57902 3.36032 4.71967 3.21967C4.86032 3.07902 5.05109 3 5.25 3H20.25C20.4489 3 20.6397 3.07902 20.7803 3.21967C20.921 3.36032 21 3.55109 21 3.75V18.75C21 18.9489 20.921 19.1397 20.7803 19.2803C20.6397 19.421 20.4489 19.5 20.25 19.5H10.296C10.0971 19.5 9.90632 19.579 9.76567 19.7197C9.62502 19.8603 9.546 20.0511 9.546 20.25Z'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M16.5 8.25C16.5 8.05109 16.421 7.86032 16.2803 7.71967C16.1396 7.57902 15.9489 7.5 15.75 7.5H8.24997C8.05106 7.5 7.86029 7.57902 7.71964 7.71967C7.57899 7.86032 7.49997 8.05109 7.49997 8.25C7.49997 8.44891 7.57899 8.63968 7.71964 8.78033C7.86029 8.92098 8.05106 9 8.24997 9H13.9395L1.71897 21.219C1.57814 21.3598 1.49902 21.5508 1.49902 21.75C1.49902 21.9492 1.57814 22.1402 1.71897 22.281C1.8598 22.4218 2.05081 22.5009 2.24997 22.5009C2.44913 22.5009 2.64014 22.4218 2.78097 22.281L15 10.0605V15.75C15 15.9489 15.079 16.1397 15.2196 16.2803C15.3603 16.421 15.5511 16.5 15.75 16.5C15.9489 16.5 16.1396 16.421 16.2803 16.2803C16.421 16.1397 16.5 15.9489 16.5 15.75V8.25Z'
                    />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
          <div className='image-container'>
            <img
              src={nonton}
              alt={'nonton'}
              layout='responsive'
              width={508}
              height={287}
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
            <div className='sources'>
              <Link href='https://github.com/Roisfaozi/becare'>
                <a aria-label='External Link' target='_blank'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    className='fill-current'
                    xmlns='http://www.w3.org/2000/svg'>
                    <title>GitHub</title>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z'
                    />
                  </svg>
                </a>
              </Link>
              <Link href='https://becare.netlify.app/'>
                <a aria-label='External Link' target='_blank'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    className='fill-current'
                    xmlns='http://www.w3.org/2000/svg'>
                    <title>External Link</title>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M9.546 20.25C9.546 20.4489 9.62502 20.6397 9.76567 20.7803C9.90632 20.921 10.0971 21 10.296 21H20.25C20.8467 21 21.419 20.7629 21.841 20.341C22.2629 19.919 22.5 19.3467 22.5 18.75V3.75C22.5 3.15326 22.2629 2.58097 21.841 2.15901C21.419 1.73705 20.8467 1.5 20.25 1.5H5.25C4.65326 1.5 4.08097 1.73705 3.65901 2.15901C3.23705 2.58097 3 3.15326 3 3.75V13.704C3 13.9029 3.07902 14.0937 3.21967 14.2343C3.36032 14.375 3.55109 14.454 3.75 14.454C3.94891 14.454 4.13968 14.375 4.28033 14.2343C4.42098 14.0937 4.5 13.9029 4.5 13.704V3.75C4.5 3.55109 4.57902 3.36032 4.71967 3.21967C4.86032 3.07902 5.05109 3 5.25 3H20.25C20.4489 3 20.6397 3.07902 20.7803 3.21967C20.921 3.36032 21 3.55109 21 3.75V18.75C21 18.9489 20.921 19.1397 20.7803 19.2803C20.6397 19.421 20.4489 19.5 20.25 19.5H10.296C10.0971 19.5 9.90632 19.579 9.76567 19.7197C9.62502 19.8603 9.546 20.0511 9.546 20.25Z'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M16.5 8.25C16.5 8.05109 16.421 7.86032 16.2803 7.71967C16.1396 7.57902 15.9489 7.5 15.75 7.5H8.24997C8.05106 7.5 7.86029 7.57902 7.71964 7.71967C7.57899 7.86032 7.49997 8.05109 7.49997 8.25C7.49997 8.44891 7.57899 8.63968 7.71964 8.78033C7.86029 8.92098 8.05106 9 8.24997 9H13.9395L1.71897 21.219C1.57814 21.3598 1.49902 21.5508 1.49902 21.75C1.49902 21.9492 1.57814 22.1402 1.71897 22.281C1.8598 22.4218 2.05081 22.5009 2.24997 22.5009C2.44913 22.5009 2.64014 22.4218 2.78097 22.281L15 10.0605V15.75C15 15.9489 15.079 16.1397 15.2196 16.2803C15.3603 16.421 15.5511 16.5 15.75 16.5C15.9489 16.5 16.1396 16.421 16.2803 16.2803C16.421 16.1397 16.5 15.9489 16.5 15.75V8.25Z'
                    />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
          <div className='image-container'>
            <img
              src={becare}
              alt={'becare'}
              layout='responsive'
              width={508}
              height={287}
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
            <div className='sources'>
              <Link href='https://github.com/Roisfaozi/staycation-MERN'>
                <a aria-label='External Link' target='_blank'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    className='fill-current'
                    xmlns='http://www.w3.org/2000/svg'>
                    <title>GitHub</title>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z'
                    />
                  </svg>
                </a>
              </Link>
              <Link href='https://liburan.netlify.app/'>
                <a aria-label='External Link' target='_blank'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    className='fill-current'
                    xmlns='http://www.w3.org/2000/svg'>
                    <title>External Link</title>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M9.546 20.25C9.546 20.4489 9.62502 20.6397 9.76567 20.7803C9.90632 20.921 10.0971 21 10.296 21H20.25C20.8467 21 21.419 20.7629 21.841 20.341C22.2629 19.919 22.5 19.3467 22.5 18.75V3.75C22.5 3.15326 22.2629 2.58097 21.841 2.15901C21.419 1.73705 20.8467 1.5 20.25 1.5H5.25C4.65326 1.5 4.08097 1.73705 3.65901 2.15901C3.23705 2.58097 3 3.15326 3 3.75V13.704C3 13.9029 3.07902 14.0937 3.21967 14.2343C3.36032 14.375 3.55109 14.454 3.75 14.454C3.94891 14.454 4.13968 14.375 4.28033 14.2343C4.42098 14.0937 4.5 13.9029 4.5 13.704V3.75C4.5 3.55109 4.57902 3.36032 4.71967 3.21967C4.86032 3.07902 5.05109 3 5.25 3H20.25C20.4489 3 20.6397 3.07902 20.7803 3.21967C20.921 3.36032 21 3.55109 21 3.75V18.75C21 18.9489 20.921 19.1397 20.7803 19.2803C20.6397 19.421 20.4489 19.5 20.25 19.5H10.296C10.0971 19.5 9.90632 19.579 9.76567 19.7197C9.62502 19.8603 9.546 20.0511 9.546 20.25Z'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M16.5 8.25C16.5 8.05109 16.421 7.86032 16.2803 7.71967C16.1396 7.57902 15.9489 7.5 15.75 7.5H8.24997C8.05106 7.5 7.86029 7.57902 7.71964 7.71967C7.57899 7.86032 7.49997 8.05109 7.49997 8.25C7.49997 8.44891 7.57899 8.63968 7.71964 8.78033C7.86029 8.92098 8.05106 9 8.24997 9H13.9395L1.71897 21.219C1.57814 21.3598 1.49902 21.5508 1.49902 21.75C1.49902 21.9492 1.57814 22.1402 1.71897 22.281C1.8598 22.4218 2.05081 22.5009 2.24997 22.5009C2.44913 22.5009 2.64014 22.4218 2.78097 22.281L15 10.0605V15.75C15 15.9489 15.079 16.1397 15.2196 16.2803C15.3603 16.421 15.5511 16.5 15.75 16.5C15.9489 16.5 16.1396 16.421 16.2803 16.2803C16.421 16.1397 16.5 15.9489 16.5 15.75V8.25Z'
                    />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
          <div className='image-container'>
            <img
              src={staycation}
              alt={'staycation'}
              layout='responsive'
              width={508}
              height={287}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
