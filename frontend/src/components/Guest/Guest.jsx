import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import GuestList from "./GuestList";
import GuestFormModal from "../modals/GuestFormModal";
import AssignRoomModal from "../modals/AssignRoomModal";

const Guest = () => {
  const [guests, setGuests] = useState([]);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  // Fetch guests
  const fetchGuests = async () => {
    try {
      const res = await axiosInstance.get("/api/guests");
      setGuests(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching guests:", err);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold"> Guest Management</h1>
        <button
          onClick={() => setShowGuestModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
           Add Guest
        </button>
      </div>

      <GuestList
        guests={guests}
        onAssignRoom={(guest) => {
          setSelectedGuest(guest);
          setShowAssignModal(true);
        }}
      />

      {/* Modals */}
      {showGuestModal && (
        <GuestFormModal
          open={showGuestModal}
          onClose={() => setShowGuestModal(false)}
          onSuccess={() => {
            fetchGuests();
            setShowGuestModal(false);
          }}
        />
      )}

      {showAssignModal && (
        <AssignRoomModal
          open={showAssignModal}
          guest={selectedGuest}
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => {
            fetchGuests();
            setShowAssignModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Guest;
