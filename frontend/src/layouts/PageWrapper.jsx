import { motion as Motion } from 'framer-motion';

export default function PageWrapper({ title, subtitle, actions, children }) {
  return (
    <Motion.div
      className="relative min-h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Title + Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1d2786] tracking-tight leading-snug">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
     
      </div>
   {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      {/* Content Area */}
      <Motion.div
        className="rounded-3xl border border-gray-100 transition-all duration-300"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
      >
        {children}
      </Motion.div>
    </Motion.div>
  );
}
