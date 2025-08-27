import React, { useEffect, useState } from "react"; 
import PageWrapper from "../../layouts/PageWrapper";
import axiosInstance from "../../utils/axiosInstance";
import {
  Users,
  ClipboardList,
  Loader2,
  UserPlus,
  PhoneCall,
  Clock,
  Link,
  CheckCircle2,
  ThumbsDown,
} from "lucide-react";

// Map backend statuses to professional colors and icons
const statusMeta = {
  "new": {
    color: "bg-gray-100 text-gray-800",
    icon: <UserPlus className="w-8 h-8 text-gray-800" />,
  },
  "mentor-assigned": {
    color: "bg-purple-100 text-purple-800",
    icon: <ClipboardList className="w-8 h-8 text-purple-800" />,
  },
  "mentor-in-contact": {
    color: "bg-yellow-100 text-yellow-800",
    icon: <PhoneCall className="w-8 h-8 text-yellow-800" />,
  },
  "payment-link-sent": {
    color: "bg-indigo-100 text-indigo-800",
    icon: <Link className="w-8 h-8 text-indigo-800" />,
  },
  "payment-done": {
    color: "bg-blue-100 text-blue-800",
    icon: <CheckCircle2 className="w-8 h-8 text-blue-800" />,
  },
  "enrolled": {
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle2 className="w-8 h-8 text-green-800" />,
  },
  "not-interested": {
    color: "bg-red-100 text-red-800",
    icon: <ThumbsDown className="w-8 h-8 text-red-800" />,
  },
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await axiosInstance.get("/api/leads/dashboard");
      setData(res.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchDashboard();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center p-10 text-gray-600">
          <Loader2 className="animate-spin mr-2" /> Loading dashboard...
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Admin Dashboard">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <DashboardCard
          icon={<ClipboardList className="w-10 h-10 text-blue-600" />}
          label="Total Leads"
          value={data.totalLeads}
          textColor="text-blue-600"
        />
        <DashboardCard
          icon={<Users className="w-10 h-10 text-green-600" />}
          label="Total Staff"
          value={data.totalStaff}
          textColor="text-green-600"
        />
      </div>

      {/* Lead Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data.statusBreakdown).map(([status, count]) => {
          const meta = statusMeta[status] || {
            color: "bg-white text-gray-700",
            icon: <UserPlus className="w-8 h-8 text-gray-700" />,
          };
          const [bgColor, textColor] = meta.color.split(" ");
          return (
            <DashboardCard
              key={status}
              icon={meta.icon}
              label={status.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              value={count}
              bgColor={bgColor}
              textColor={textColor}
            />
          );
        })}
      </div>
    </PageWrapper>
  );
};

const DashboardCard = ({ icon, label, value, bgColor = "bg-white", textColor = "text-gray-700" }) => (
  <div className={`rounded-lg shadow-sm border p-4 flex items-center gap-4 ${bgColor}`}>
    {icon}
    <div>
      <h2 className="text-sm font-semibold text-gray-600">{label}</h2>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  </div>
);

export default Dashboard;
