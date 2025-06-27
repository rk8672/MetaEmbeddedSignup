import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#f1f5f9] text-slate-800 pt-16 pb-10 px-6 md:px-20 relative z-10 border-t border-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate-fade-in">
        {/* Logo & Tagline */}
        <div>
          <h1 className="text-2xl font-bold text-[#1d2786] mb-3">
            medli<span className="text-red-700">tech</span>
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Smart Hospital Management Solution <br />
            {/* <span className="text-blue-700 font-semibold">अस्पताल प्रबंधन अब आसान</span> */}
          </p>
          <div className="flex space-x-4 mt-4">
            <Facebook className="w-5 h-5 text-blue-700 hover:text-blue-900 cursor-pointer" />
            <Instagram className="w-5 h-5 text-pink-500 hover:text-pink-600 cursor-pointer" />
            <Linkedin className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-blue-800">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="hover:text-blue-700 cursor-pointer">Home</li>
            <li className="hover:text-blue-700 cursor-pointer">Features</li>
            <li className="hover:text-blue-700 cursor-pointer">Pricing</li>
            <li className="hover:text-blue-700 cursor-pointer">How It Works</li>
            <li className="hover:text-blue-700 cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-blue-800">Hospital Services</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Appointment Booking</li>
            <li>OPD/IPD Management</li>
            <li>Doctor Availability</li>
            <li>Billing & Invoicing</li>
            <li>WhatsApp & SMS Notifications</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-blue-800">Contact Us</h3>
          <div className="flex items-center space-x-3 text-sm text-gray-700 mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Varanasi, Uttar Pradesh, India</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-700 mb-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>support@calc360.online</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-700">
            <Phone className="w-4 h-4 text-blue-600" />
            <span>+91-7524807719</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 text-center text-sm text-gray-500 border-t border-slate-300 pt-6 space-y-2">
        <p>
          © {new Date().getFullYear()} Medlitech. All rights reserved. | Powered by{' '}
          <span className="text-blue-800 font-semibold">Radha Krishna Singh</span>
        </p>
        <p className="space-x-4">
          <Link
            to="/privacy-policy"
            className="text-blue-700 hover:underline"
          >
            Privacy Policy
          </Link>
          <span>|</span>
          <Link
            to="/terms"
            className="text-blue-700 hover:underline"
          >
            Terms & Conditions
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
