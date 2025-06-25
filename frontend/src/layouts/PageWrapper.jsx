import {useState} from "react";
import { motion as Motion } from 'framer-motion';
import { CalendarPlus } from 'lucide-react';
import AppointmentDrawer from "../components/appointmentDrawer/AppointmentDrawer";
export default function PageWrapper({ title, subtitle, actions, children }) {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
  return (
    <Motion.div
      className="relative min-h-full   "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#1d2786] tracking-tight leading-snug">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>

      {/* Content Area */}
      <Motion.div
        className=" rounded-3xl  border border-gray-100 transition-all duration-300"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
      >
        {children}
      </Motion.div>

<Motion.div
  className="fixed bottom-6 right-6 z-[9999] group flex items-center gap-1"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.6, duration: 0.3 }}
>

  <Motion.button
    onClick={() => setDrawerOpen(true)}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center transition-all hover:shadow-xl"
  >
    <CalendarPlus className="w-6 h-6" />
  </Motion.button>
  <AppointmentDrawer
    isOpen={isDrawerOpen}
    onClose={() => setDrawerOpen(false)}
  />
</Motion.div>

    </Motion.div>
  );
}
