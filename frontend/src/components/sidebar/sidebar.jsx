import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import { 
  Home, Users, Building, BedDouble, DollarSign, FileBarChart, Settings, LogOut, Store 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import BrandLogo from "../../assets/BrandLogo/Logo_only.gif";
const RupeeIcon = () => <span className="text-lg font-bold">₹</span>;
import "./sidebar.css";







const allMenuItems = [
  { name: "Dashboard", icon: Home, path: "/dashboard", roles: ["admin", "staff"] },

];
const Sidebar = ({ closeSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside className="h-screen w-16 bg-white/70 backdrop-blur-md border-r border-gray-200 shadow-xl flex flex-col items-center py-4 relative">

      {/* Branding (icon only) */}
   <div className="mb-6 invisible lg:visible">
  <img src={BrandLogo} alt="Brand Logo" className="w-11 h-11" />
</div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col items-center space-y-6">
        {menuItems.map(({ name, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={name}
              to={path}
              onClick={closeSidebar}
              className={`relative group flex items-center justify-center w-12 h-12 rounded-lg transition-all
                ${isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              <Icon className="w-5 h-5" />
              {/* Label shown only on hover of this icon */}
              <span className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white text-gray-800 text-sm px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mb-4">
        <button
          onClick={() => dispatch(logout())}
          className="relative group flex items-center justify-center w-12 h-12 text-red-500 hover:bg-red-100 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white text-gray-800 text-sm px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
