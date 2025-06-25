import { useState } from 'react';
import Sidebar from '../components/sidebar/sidebar';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react'; // optional: icon from lucide-react
export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md transition-transform duration-300 z-40 
        fixed inset-y-0 left-0 w-64 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:block`}
      >
        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-auto bg-gray-100">
        {/* Top nav for mobile */}
        <header className="flex items-center justify-between lg:hidden bg-white px-4 py-3 shadow-md">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
         <div className="flex flex-col text-[#1d2786] font-bold leading-tight">
            <span className="text-xl">
              medli<span className="text-red-500">tech</span>
            </span>
            {/* <span className="text-xs font-medium text-gray-500 tracking-wide border-top">
             
              Sunshine Heart & Neuro Care Hospital
            </span> */}
          </div>
        </header>

        {/* Main content */}
        <main className="  p-10 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
