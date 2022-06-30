import Header from '../components/header'
import Navbar from '../components/navbar'
import Story from '../components/story'

export default function Home() {
  return (
    <div className='w-full bg-white'>
      <Navbar />
      <Header />
      <Story />
    </div>
  )
}
