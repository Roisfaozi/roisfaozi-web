import Contacts from '../components/contacts'
import Header from '../components/header'
import Navbar from '../components/navbar'
import Projects from '../components/projects'
import Story from '../components/story'

export default function Home() {
  return (
    <div className='w-full bg-white'>
      <Navbar />
      <Header />
      <Story />
      <Projects />
      <Contacts />
    </div>
  )
}
