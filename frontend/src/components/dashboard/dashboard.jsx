import React, { useEffect, useState } from "react";
import PageWrapper from "../../layouts/PageWrapper";
import axiosInstance from "../../utils/axiosInstance";
import { Users, Home, Building, Loader2, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Colors
const COLORS = ["#4CAF50", "#F44336"];

const dashboardMeta = {
  buildings: { icon: <Building className="w-10 h-10 text-purple-600" />, color: "bg-purple-100 text-purple-800" },
  rooms: { icon: <Home className="w-10 h-10 text-blue-600" />, color: "bg-blue-100 text-blue-800" },
  guests: { icon: <Users className="w-10 h-10 text-indigo-600" />, color: "bg-indigo-100 text-indigo-800" },
  payments: { icon: <DollarSign className="w-10 h-10 text-yellow-600" />, color: "bg-yellow-100 text-yellow-800" },
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/api/dashboard/overview");
        setData(res.data.response);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
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

  // Chart Data
  const paymentsData = [
    { name: "Collected", value: data.payments.paid },
    { name: "Pending", value: data.payments.totalExpected - data.payments.paid },
  ];

  const roomsData = [
    { name: "Occupied", value: data.rooms.occupied },
    { name: "Vacant", value: data.rooms.vacant },
  ];

  return (
    <PageWrapper title="Dashboard">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard label="Buildings" value={data.buildings} icon={dashboardMeta.buildings.icon} bgColor={dashboardMeta.buildings.color.split(" ")[0]} textColor={dashboardMeta.buildings.color.split(" ")[1]} />
        <DashboardCard label="Rooms" value={` ${data.rooms.vacant} vacant`} icon={dashboardMeta.rooms.icon} bgColor={dashboardMeta.rooms.color.split(" ")[0]} textColor={dashboardMeta.rooms.color.split(" ")[1]} />
        <DashboardCard label="Guests" value={`${data.guests.active} active / ${data.guests.total} total`} icon={dashboardMeta.guests.icon} bgColor={dashboardMeta.guests.color.split(" ")[0]} textColor={dashboardMeta.guests.color.split(" ")[1]} />
        <DashboardCard label="Payments" value={`₹${data.payments.paid} collected / ₹${data.payments.totalExpected} expected`} icon={dashboardMeta.payments.icon} bgColor={dashboardMeta.payments.color.split(" ")[0]} textColor={dashboardMeta.payments.color.split(" ")[1]} />
      </div>

      {/* Payment Collection Bar Chart */}
      {/* <div className="bg-white rounded-lg p-4 shadow mb-8">
        <h2 className="text-lg font-semibold mb-2">Payment Collection vs Expected</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={paymentsData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4CAF50" />
            <Bar dataKey="value" fill="#F44336" />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

      {/* <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Rooms Occupancy</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={roomsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {roomsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div> */}
    </PageWrapper>
  );
};

const DashboardCard = ({ icon, label, value, bgColor = "bg-white", textColor = "text-gray-700" }) => (
  <div className={`rounded-lg shadow-sm border p-4 flex items-center gap-4 ${bgColor}`}>
    {icon}
    <div>
      <h2 className="text-sm font-semibold text-gray-600">{label}</h2>
      <p className={`text-lg sm:text-xl font-bold ${textColor}`}>{value}</p>
    </div>
  </div>
);

export default Dashboard;
