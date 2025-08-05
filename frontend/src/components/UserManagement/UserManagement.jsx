import React, { useState, useEffect } from "react";
import { User, Mail, Lock } from "lucide-react";
import PageWrapper from "../../layouts/PageWrapper";
import axiosInstance from "../../utils/axiosInstance";
import TableWrapper from "../../layouts/TableWrapper";

const UserManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchStaff = async () => {
    try {
      const res = await axiosInstance.get("/api/user/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffList(res.data.staff);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setCredentials(null);

    try {
      const res = await axiosInstance.post(
        "/api/user/staff/create",
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage({ type: "success", text: res.data.message });
      setCredentials(res.data.credentials);
      setFormData({ name: "", email: "", password: "" });
      fetchStaff(); // refresh table
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to create staff user",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const columns = [
    { label: "#", render: (_, i) => i + 1 },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
  ];

  return (
    <PageWrapper title="User Management" subtitle="Manage and create staff users">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Staff Form */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">Create Staff User</h2>
          <p className="text-sm text-gray-500 mb-4">
            Fill in the details to create a new staff account.
          </p>

          {message && (
            <div
              className={`mb-4 p-3 rounded text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {credentials && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 p-4 rounded text-sm">
              <p className="mb-2 font-medium text-yellow-800">New Staff Credentials:</p>
              <div className="flex items-center justify-between mb-1">
                <span>Email: {credentials.email}</span>
                <button
                  onClick={() => copyToClipboard(credentials.email)}
                  className="text-blue-600 text-xs hover:underline"
                >
                  Copy
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Password: {credentials.password}</span>
                <button
                  onClick={() => copyToClipboard(credentials.password)}
                  className="text-blue-600 text-xs hover:underline"
                >
                  Copy
                </button>
              </div>
              <p className="mt-2 text-xs text-red-600">
                ⚠️ Save these credentials now. They won’t be shown again.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
            >
              {loading ? "Creating..." : "Create Staff"}
            </button>
          </form>
        </div>

        {/* Staff Table */}
        <TableWrapper
          title="Staff Members"
          description="List of registered staff users"
          columns={columns}
          data={staffList}
        />
      </div>
    </PageWrapper>
  );
};

export default UserManagement;
