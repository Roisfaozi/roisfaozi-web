import Contacts from '../components/contacts'
import Footer from '../components/footer'
import Header from '../components/header'
import Navbar from '../components/navbar'
import Projects from '../components/projects'
import ScrollTop from '../components/scroll-top'
import Story from '../components/story'

export default function Home() {
  return (
    <div className='w-full bg-white'>
      <Navbar />
      <Header />
      <Story />
      <Projects />
      <Contacts />
      <ScrollTop />
      <Footer />
    </div>
  )
}
