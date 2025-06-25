import { FaUserCheck, FaCalendarCheck, FaStethoscope, FaBell, FaChartBar } from 'react-icons/fa';

const steps = [
  {
    title: 'Morning: Staff Attendance',
    icon: <FaUserCheck className="text-3xl text-blue-700" />,
    content: 'Staff check in using biometrics or cards. Attendance is tracked and shift schedules are updated in real time.'
  },
  {
    title: 'Mid-Morning: Patient Appointments',
    icon: <FaCalendarCheck className="text-3xl text-green-600" />,
    content: 'Patients book appointments online. Confirmation and reminders are sent via SMS/WhatsApp, and queue is managed automatically.'
  },
  {
    title: 'Afternoon: Doctor Consultations',
    icon: <FaStethoscope className="text-3xl text-purple-600" />,
    content: 'Doctors view digital records, create e-prescriptions, and schedule follow-ups, all within the HMS platform.'
  },
  {
    title: 'Late Afternoon: Notifications & Reminders',
    icon: <FaBell className="text-3xl text-yellow-500" />,
    content: 'Automated alerts are sent for upcoming appointments, medication schedules, and patient feedback collection.'
  },
  {
    title: 'Evening: Reports & Admin Actions',
    icon: <FaChartBar className="text-3xl text-red-500" />,
    content: 'Admins access reports on visits, finances, and staff attendance to make data-driven decisions and perform system updates.'
  },
];

const HowWorks = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="px-6 md:px-12 lg:px-24">
   <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-6">
  How <span className="font-bold text-black">medli</span><span className="text-red-600">tech</span> Works
</h2>
        <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          From morning staff check-ins to evening reports, our HMS ensures a smooth flow of hospital operations.
        </p>

        <div className="relative">
          {/* Vertical dotted line */}
          <div className="line"></div>

          {/* Step items */}
          <div className="flex flex-col gap-16 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`step-container step-${index + 1}`}
              >
                {/* Step icon */}
                <div className="step-icon">
                  {step.icon}
                </div>

                {/* Step content */}
                <div className="step-content">
                  <h3 className="text-xl font-semibold text-blue-800">{step.title}</h3>
                  <p className="mt-2 text-gray-600">{step.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWorks;
