import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const AssignRoomModal = ({ open, guest, onClose, onSuccess }) => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");

  // fetch building list
  const fetchBuildings = async () => {
    try {
      const res = await axiosInstance.get("/api/buildings/lite/names");
      setBuildings(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching buildings:", err);
    }
  };

  // fetch rooms of selected building
  const fetchRooms = async (buildingId) => {
    try {
      const res = await axiosInstance.get(`/api/buildings/lite/${buildingId}/rooms`);
      setRooms(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchBuildings();
      setSelectedBuilding("");
      setSelectedRoom("");
      setRooms([]);
    }
  }, [open]);

  const handleAssign = async () => {
    try {
      await axiosInstance.put(`/api/guests/${guest._id}`, {
        allottedRoom: selectedRoom,
      });
      onSuccess();
    } catch (err) {
      console.error("Error assigning room:", err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">
          Assign Room to {guest.name}
        </h2>

        {/* Select Building */}
        <select
          value={selectedBuilding}
          onChange={(e) => {
            const bId = e.target.value;
            setSelectedBuilding(bId);
            if (bId) fetchRooms(bId);
          }}
          className="w-full p-2 border rounded-lg mb-3"
        >
          <option value="">-- Select Building --</option>
          {buildings.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Select Room */}
        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          className="w-full p-2 border rounded-lg"
          disabled={!selectedBuilding}
        >
          <option value="">-- Select Room --</option>
          {rooms.map((r) => (
            <option key={r._id} value={r._id}>
              Room {r.roomNumber} (Available: {r.available})
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedRoom}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRoomModal;
