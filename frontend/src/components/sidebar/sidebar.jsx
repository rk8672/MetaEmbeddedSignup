import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import {
  Home,
  UserPlus,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import BrandLogo from "../../assets/BrandLogo/Logo_only.gif";
import "./sidebar.css";

const allMenuItems = [
  { name: "Dashboard", icon: Home, path: "/Dashboard" },
   { name: "EmbeddedSignup", icon: UserPlus, path: "/EmbeddedSignup" },

];

const Sidebar = ({ closeSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  return (
    <aside className="h-screen w-60 bg-white border-r border-gray-200 shadow-md flex flex-col">
      <div className="flex items-center px-5 py-4 border-b border-gray-100">
        <span className="ml-3 text-xl font-semibold text-gray-800">
         ab media
        </span>
      </div>

      <nav className="flex-1 flex flex-col py-4">
        {allMenuItems.map(({ name, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={name}
              to={path}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-5 py-2.5 relative rounded-md mx-3 mb-1 transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-500"
                }`}
            >
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-md" />
              )}
              <Icon className="w-5 h-5" />
              <span>{name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-md transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
