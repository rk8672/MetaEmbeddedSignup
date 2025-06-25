import { useState } from "react";
import {useNavigate} from "react-router-dom"
const Navbar = () => {
  const navigate=useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="w-full py-4 px-4 md:px-12 shadow-sm bg-white rounded transition-all duration-500 ease-in-out">
      <div className="flex items-center justify-between animate-fade-in">
        {/* Logo */}
        <div className="w-30 flex flex-col justify-center items-center font-poppins text-[#1d2786]">
          <h1 className="text-3xl font-bold text-center leading-tight">
            medli<span className="text-red-600">tech</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-800">
          {["Home", "Services", "Clients", "About Us"].map((item) => (
            <div
              key={item}
              className="cursor-pointer hover:text-[#1d2786] hover:underline underline-offset-4 transition-all duration-300"
            >
              {item}
            </div>
          ))}
        </nav>

        {/* Login Button */}
        <div className="hidden md:block">
          <button className="animated-btn bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg shadow" onClick={()=>{navigate("/Login")}}>
            Login
          </button>
          
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            <svg
              className="w-6 h-6 text-blue-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 space-y-2 text-sm text-gray-800 font-semibold animate-fade-in">
          {["Home", "Services", "Clients", "About Us"].map((item) => (
            <div key={item} className="hover:text-[#1d2786] cursor-pointer">
              {item}
            </div>
          ))}
          <button className="mt-2 bg-blue-700 text-white py-2 px-4 rounded-lg shadow transition" onClick={()=>{navigate("/Login")}}>
            Login
          </button>
        </div>
      )}
    </section>
  );
};

export default Navbar;
