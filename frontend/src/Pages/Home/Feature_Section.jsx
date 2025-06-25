import { useState } from "react";
import {
  CalendarCheck,
  Users,
  ListOrdered,
  Wallet,
  BarChart3,
  Stethoscope,
  MessageSquare,
  Boxes,
  FileText,
} from "lucide-react";

const features = [
  {
    title: "Patient Appointment",
    icon: <CalendarCheck className="w-12 h-12 text-black-500" />,
    description: "Patients can book appointments anytime with instant SMS/WhatsApp updates.",
    gradient: "from-[#4f81e5] to-[#3b6ad8]",
  },
  {
    title: "Staff Attendance",
    icon: <Users className="w-12 h-12 text-black-500" />,
    description: "Automated attendance, leave management, and salary reports in one place.",
    gradient: "from-[#34c759] to-[#2d9e52]",
  },
  {
    title: "OPD Patient Numbering",
    icon: <ListOrdered className="w-12 h-12 text-black-500" />,
    description: "Smooth patient flow with dynamic OPD numbering system.",
    gradient: "from-[#8e44ad] to-[#6f3376]",
  },
  {
    title: "Doctor Billing",
    icon: <Wallet className="w-12 h-12 text-black-500" />,
    description: "Set consultation charges & auto-generate doctor-wise invoices.",
    gradient: "from-[#f39c12] to-[#e67e22]",
  },
  {
    title: "Reports & Summary",
    icon: <BarChart3 className="w-12 h-12 text-black-500" />,
    description: "Real-time analytics of revenue, patient stats & doctor performance.",
    gradient: "from-[#e74c3c] to-[#c0392b]",
  },
  {
    title: "Doctor Availability",
    icon: <Stethoscope className="w-12 h-12 text-black-500" />,
    description: "Manage doctor slots & display real-time availability to patients.",
    gradient: "from-[#f1c40f] to-[#f39c12]",
  },
  {
    title: "WhatsApp + SMS",
    icon: <MessageSquare className="w-12 h-12 text-black-500" />,
    description: "Send automated updates, reminders, and alerts via SMS/WhatsApp.",
    gradient: "from-[#1abc9c] to-[#16a085]",
  },
  {
    title: "Inventory Management",
    icon: <Boxes className="w-12 h-12 text-black-500" />,
    description: "Track medicines, surgical items, alerts for expiry or low stock.",
    gradient: "from-[#2ecc71] to-[#27ae60]",
  },
  {
    title: "Patient Records",
    icon: <FileText className="w-12 h-12 text-black-500" />,
    description: "Digitally store patient history, lab results, and prescription notes.",
    gradient: "from-[#9b59b6] to-[#8e44ad]",
  },
];

const FeatureSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-20 bg-gradient-to-b from-[#e5e5e5] to-white text-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[rgba(0, 0, 0, 0.2)] blur-xl"></div> {/* Background blur */}
      <div className="relative px-6 md:px-12 lg:px-24 z-10">
        {/* Heading */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
             Hospital Features Tailored for Growth
          </h2>
          <p className="text-lg text-gray-600">
            We’ve covered everything — from appointment booking to billing to staff management and real-time notifications.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`rounded-xl p-8 shadow-lg bg-gradient-to-tr ${feature.gradient} transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl relative overflow-hidden text-black-500`}
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p
                className={`text-sm opacity-80 transition-opacity duration-500 ${
                  hoveredIndex === index ? "opacity-100" : "opacity-80"
                }`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-20">
          <button className="bg-[#1e3a8a] hover:bg-[#1d2c6a] text-blue-500 text-lg font-semibold py-4 px-10 rounded-full shadow-lg transform transition hover:scale-105">
             Request a Free Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
