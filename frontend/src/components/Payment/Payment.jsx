import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import AddPaymentForm from "./AddPaymentForm";
import PaymentList from "./PaymentList";
import PageWrapper from "../../layouts/PageWrapper"; // adjust path if needed

export default function Payment() {
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);

  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedGuest, setSelectedGuest] = useState("");

  const [refreshPayments, setRefreshPayments] = useState(false);

  // ✅ Fetch buildings (lite names)
  useEffect(() => {
    axiosInstance.get("/api/buildings/lite/names").then((res) => {
      setBuildings(res.data.data || []);
    });
  }, []);

  // ✅ Fetch rooms when building changes (lite rooms API)
  useEffect(() => {
    if (selectedBuilding) {
      axiosInstance
        .get(`/api/buildings/lite/${selectedBuilding}/rooms`)
        .then((res) => {
          setRooms(res.data.data || []);
          setGuests([]);
          setSelectedRoom("");
          setSelectedGuest("");
        });
    }
  }, [selectedBuilding]);

// ✅ Fetch guests when room changes
useEffect(() => {
  if (selectedRoom) {
    axiosInstance.get(`/api/guests/room/${selectedRoom}`).then((res) => {
      setGuests(res.data.data || []);
      setSelectedGuest("");
    });
  }
}, [selectedRoom]);

  // ✅ Handle form submit
  const handleSubmit = async (formData) => {
    try {
      const [year, month] = formData.month.split("-").map(Number);

      await axiosInstance.post("/api/payments", {
        payer: selectedGuest,
        payerType: "Guest",
        month,
        year,
        rentAmount: Number(formData.amount),
        paidAmount: Number(formData.amount),
        paymentMode: formData.method,
        notes: formData.notes,
        dueDate: new Date(year, month - 1, 5),
      });

      alert("Payment recorded successfully!");
      setRefreshPayments((prev) => !prev); // 🔄 refresh payment list
    } catch (err) {
      alert(
        "Error saving payment: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <PageWrapper
      title="Payments"
      subtitle="Manage rent collection and track payment history"
    >
      <div className="p-6 space-y-8">
        {/* Add Payment Form */}
        <AddPaymentForm
          buildings={buildings}
          rooms={rooms}
          guests={guests}
          selectedBuilding={selectedBuilding}
          setSelectedBuilding={setSelectedBuilding}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          selectedGuest={selectedGuest}
          setSelectedGuest={setSelectedGuest}
          onSubmit={handleSubmit}
        />

        {/* Payment List */}
        <PaymentList refresh={refreshPayments} />
      </div>
    </PageWrapper>
  );
}
