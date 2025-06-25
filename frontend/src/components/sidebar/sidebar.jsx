import {
  Home,
  Users,
  CalendarDays,
  Settings,
  LogOut,
  Stethoscope,
  ClipboardList,
  PlusCircle,
  BadgeDollarSign,
  Clock,
  UserPlus,
} from 'lucide-react';
import "./sidebar.css";
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const menuItems = [
  { name: 'Dashboard', icon: Home, path: '/Dashboard' },
  { name: 'Patients', icon: Users, path: '/Patients' },
  { name: 'Appointments', icon: CalendarDays, path: '/Appointments' },
  { name: 'Consultations', icon: Stethoscope, path: '/Consultations' },
  { name: 'Reports', icon: ClipboardList, path: '/Reports' },
  { name: 'Settings', icon: Settings, path: '/Settings' },
   { name: 'User', icon: UserPlus, path: '/User' },
];

const Sidebar = ({ closeSidebar }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <aside
      className={`h-screen bg-white/40 backdrop-blur-md border-r border-gray-200 shadow-xl transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } flex flex-col`}
    >
      {/* Product Branding */}
      <div className="px-4 py-5 flex items-center justify-between border-b gap-2 border-gray-100">
        {!collapsed ? (
          <div className="flex flex-col text-[#1d2786] font-bold leading-tight">
            {/* <span className="text-3xl">
              medli<span className="text-red-500">tech</span>
            </span> */}
            <span className="text-xs font-medium text-gray-500 tracking-wide border-top">
           
              Sunshine Heart Hospital
            </span>
          </div>
        ) : (
          <span className="text-[#1d2786] text-xl font-bold whitespace-nowrap">m<span className='text-red-500 p-0 m-0'>t</span> </span>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-blue-500 transition  text-lg"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

   

      {/* Profile */}
      {!collapsed && (
        <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-white via-blue-50 to-white">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
            DR
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Dr. Rose Martin</p>
            <p className="text-xs text-gray-400">Cardiologist</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <p className={`text-xs font-semibold px-4 mb-3 text-gray-400 ${collapsed ? 'hidden' : ''}`}>
          MAIN MENU
        </p>
        {menuItems.map(({ name, icon: Icon, path }) => {
          const isActive = location.pathname === path;

          return (
            <div key={name} className="relative group">
              <Link
                to={path}
                onClick={closeSidebar}
                className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-inner'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                } ${collapsed ? 'justify-center' : 'gap-3'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-blue-600' : ''} transition`} />
                {!collapsed && <span>{name}</span>}
              </Link>
              {collapsed && (
                <span className="sidebar-tooltip group-hover:scale-100">{name}</span>
              )}
            </div>
          );
        })}

        {/* Quick Actions */}
        {!collapsed && (
          <div className=" py-5 px-3">
            <p className="text-xs font-semibold text-gray-400 mb-2">QUICK ACTIONS</p>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition">
              <PlusCircle className="w-4 h-4" />
              Add Patient
            </button>
          </div>
        )}

        {/* Coming Soon Section */}
        {!collapsed && (
          <div className=" px-3">
            <p className="text-xs font-semibold text-gray-400 mb-2">COMING SOON</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-md px-3 py-2">
                <Clock className="w-5 h-5 text-gray-400" />
              Attendance & Salary Management
                {/* <span className="ml-auto text-[10px] text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">Soon</span> */}
              </div>
              {/* <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-md px-3 py-2">
                <Clock className="w-4 h-4 text-gray-400" />
                Attendance Tracking
                <span className="ml-auto text-[10px] text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">Soon</span>
              </div> */}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-4 flex items-center justify-between py-4   border-t border-gray-200 bg-white/60 backdrop-blur ">
        <div>
        <button
          onClick={() => console.log('Logout clicked')}
          className={`flex items-center  text-sm font-semibold text-red-500 hover:text-red-600 transition ${
            collapsed ? 'justify-center' : 'gap-3'
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && 'Logout'}
        </button>
        </div>
          {!collapsed && 
         <div className="text-xs text-gray-400  text-center   items-center">
           medlitech v1.2.0
          </div>
}

      </div>
    </aside>
  );
};

export default Sidebar;
