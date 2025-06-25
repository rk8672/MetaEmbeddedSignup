import { useEffect, useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import axios from "axios";
import api from "../../utils/axiosInstance"

const ROLES = ["admin", "doctor", "receptionist"];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "doctor",
  });
  const [loading, setLoading] = useState(false);

 

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/orgusers"); 
      
      // should return only current org users
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/orgusers", formData);
      setFormData({ name: "", email: "", phone: "", password: "", role: "doctor" });
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Error creating user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/orgusers/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

   // Fetch existing staff
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
        <UserPlus /> Manage Organization Staff
      </h2>

      {/* Form to Add User */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-3 rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border p-3 rounded-md"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="border p-3 rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Temporary Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border p-3 rounded-md"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border p-3 rounded-md"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Add User"}
        </button>
      </form>

      {/* Table of Users */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-t text-sm">
          <thead className="bg-blue-50 text-blue-700">
            <tr>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Phone</th>
              <th className="py-2 px-3">Role</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-3">{user.name}</td>
                  <td className="py-2 px-3">{user.email}</td>
                  <td className="py-2 px-3">{user.phone}</td>
                  <td className="py-2 px-3 capitalize">{user.role}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
