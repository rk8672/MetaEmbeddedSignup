import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const GuestFormModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    mobileNumber: "",
    aadharNumber: "",
    profession: "",
    permanentAddress: "",
    officeAddress: "",

    rentAmount: "",
    depositAmount: "",
    rentDueDay: "",
    joinDate: new Date().toISOString().split("T")[0], // default today
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/guests", form);
      onSuccess();
    } catch (err) {
      console.error("Error creating guest:", err);
    }
  };

  if (!open) return null;

  return (
   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Onboard New Guest</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Basic Info */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={handleChange}
            className="p-2 border rounded-lg col-span-1"
          />
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            required
            value={form.mobileNumber}
            onChange={handleChange}
            className="p-2 border rounded-lg col-span-1"
          />
          <input
            type="text"
            name="aadharNumber"
            placeholder="Aadhar Number"
            value={form.aadharNumber}
            onChange={handleChange}
            className="p-2 border rounded-lg col-span-1"
          />
          <input
            type="text"
            name="profession"
            placeholder="Profession"
            value={form.profession}
            onChange={handleChange}
            className="p-2 border rounded-lg col-span-1"
          />

          {/* Address */}
          <input
            type="text"
            name="permanentAddress"
            placeholder="Permanent Address"
            value={form.permanentAddress}
            onChange={handleChange}
            className="p-2 border rounded-lg col-span-2"
          />
          <input
            type="text"
            name="officeAddress"
            placeholder="Office Address"
            value={form.officeAddress}
            onChange={handleChange}
            className="p-2 border rounded-lg col-span-2"
          />

          {/* Rental Contract */}
          <input
            type="number"
            name="rentAmount"
            placeholder="Monthly Rent (₹)"
            required
            value={form.rentAmount}
            onChange={handleChange}
            className="p-2 border rounded-lg col-span-1"
          />
          <input
            type="number"
            name="depositAmount"
            placeholder="Deposit Amount (₹)"
            value={form.depositAmount}
            onChange={handleChange}
            className="p-2 border rounded-lg col-span-1"
          />
          <input
            type="number"
            name="rentDueDay"
            placeholder="Rent Due Day (1-31)"
            required
            value={form.rentDueDay}
            onChange={handleChange}
            className="p-2 border rounded-lg col-span-1"
          />
          <input
            type="date"
            name="joinDate"
            value={form.joinDate}
            onChange={handleChange}
            className="p-2 border rounded-lg col-span-1"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 col-span-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestFormModal;
