import PageWrapper from "../../layouts/PageWrapper";

import {
  PlusCircle,
  Users,
  CalendarCheck2,
  FileText,
  Stethoscope,
  Thermometer,
  CalendarPlus,
} from "lucide-react";

const Dashboard = () => {



  const cards = [
    {
      title: "Total Patients",
      value: "1,245",
      icon: <Users className="w-5 h-5 text-blue-600" />,
      color: "border border-blue-200 bg-blue-50 text-blue-800",
    },
    {
      title: "Appointments Today",
      value: "34",
      icon: <CalendarCheck2 className="w-5 h-5 text-green-600" />,
      color: "border border-green-200 bg-green-50 text-green-800",
    },
    {
      title: "Pending Reports",
      value: "12",
      icon: <FileText className="w-5 h-5 text-yellow-600" />,
      color: "border border-yellow-200 bg-yellow-50 text-yellow-800",
    },
    {
      title: "Active Consultations",
      value: "8",
      icon: <Stethoscope className="w-5 h-5 text-purple-600" />,
      color: "border border-purple-200 bg-purple-50 text-purple-800",
    },
    {
      title: "Devices Online",
      value: "16",
      icon: <Thermometer className="w-5 h-5 text-red-600" />,
      color: "border border-red-200 bg-red-50 text-red-800",
    },
  ];

  return (
    <PageWrapper
      title="Dashboard"
      subtitle="Automated insights into hospital operations"
    >
      <div className="grid grid-cols-1 bg-white rounded rounded-3xl p-6 sm:grid-cols-2 xl:grid-cols-3 gap-6 ">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-5 rounded-lg ${card.color} transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{card.title}</span>
              <div className="bg-white rounded-full p-2 border">
                {card.icon}
              </div>
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
