// File: components/Sidebar.jsx
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {logout} from "../../slices/authSlice";
import {
  Home,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';

import "./sidebar.css";
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from "../../assets/BrandLogo/gif_cyberlogo.gif";

 // Define all menu items
  const allMenuItems = [
    { name: 'Dashboard', icon: Home, path: '/Dashboard', roles: ['admin'] },
    { name: 'Leads', icon: Users, path: '/leads', roles: ['admin', 'staff'] },
    { name: 'Settings', icon: Settings, path: '/settings', roles: ['admin'] },
  ];

const Sidebar = ({ closeSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

 

  // Filter items based on role
  const menuItems = allMenuItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="h-screen w-64 bg-white/40 backdrop-blur-md border-r border-gray-200 shadow-xl flex flex-col">

      {/* Branding */}
      <div className="px-4 py-5 flex items-center justify-between border-b gap-2 border-gray-100">
        <div className="flex flex-col text-[#1d2786] font-bold leading-tight">
          <img src={BrandLogo} alt="Brand Logo" />
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-white via-blue-50 to-white">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
          AD
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-400">ROLE : {user?.role?.toUpperCase()}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold px-4 mb-3 text-gray-400">MAIN MENU</p>
        {menuItems.map(({ name, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <div key={name} className="relative group">
              <Link
                to={path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-inner'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-blue-600' : ''} transition`} />
                <span>{name}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 flex items-center justify-between py-4 border-t border-gray-200 bg-white/60 backdrop-blur">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 text-sm font-semibold text-red-500 hover:text-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
        <div className="text-xs text-gray-400 text-center">
          Cybervie v1.0.0
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;