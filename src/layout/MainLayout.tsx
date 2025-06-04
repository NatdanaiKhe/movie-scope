import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className="w-full h-full flex flex-auto flex-col justify-between bg-gray-900">
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default MainLayout