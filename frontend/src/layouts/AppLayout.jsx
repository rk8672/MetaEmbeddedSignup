import { useState } from 'react';
import Sidebar from '../components/sidebar/sidebar';
import { Outlet } from 'react-router-dom';
import { Menu , X} from 'lucide-react'; 
import BrandLogo from "../assets/BrandLogo/Logo_only.gif";
export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
   
   <aside
  className={`bg-white shadow-md transition-transform duration-300 z-40 
  fixed inset-y-0 left-0  transform 
  ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
  lg:translate-x-0 lg:static lg:block`}
>
  <button
    onClick={() => setIsSidebarOpen(false)}
    className="lg:hidden absolute top-3 right-3 z-50"
  >
    <X className="w-10 h-10 text-red-700" />
  </button>

  <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
</aside>

      <div className="flex-1 flex flex-col overflow-auto bg-gray-100">
        <header className="flex items-center justify-between lg:hidden bg-white px-4 py-3 shadow-md">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
         <div className="flex flex-col text-[#1d2786] font-bold leading-tight">
          <img src={BrandLogo}  alt="" height={40} width={40} />
          </div>
        </header>

        <main className="  p-10 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
