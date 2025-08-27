import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function AddRoomModal({ open, onClose, buildingId, onSuccess }) {
  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: "",
    capacity: 1, // 👈 added
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/rooms", {
        building: buildingId,
        roomNumber: formData.roomNumber,
        floor: formData.floor,
        capacity: formData.capacity, // 👈 send capacity to backend
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error creating room", err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Room</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium">Room Number</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          {/* Floor */}
          <div>
            <label className="block text-sm font-medium">Floor</label>
            <input
              type="number"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              min="1"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
