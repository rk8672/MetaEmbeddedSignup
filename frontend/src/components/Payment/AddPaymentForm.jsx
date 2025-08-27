import { useState } from "react";

export default function AddPaymentForm({
  buildings,
  rooms,
  guests,
  selectedBuilding,
  setSelectedBuilding,
  selectedRoom,
  setSelectedRoom,
  selectedGuest,
  setSelectedGuest,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    amount: "",
    month: "",
    method: "cash",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBuilding || !selectedRoom || !selectedGuest) {
      alert("Please select building, room/shop, and guest first!");
      return;
    }

    onSubmit(formData);

    setFormData({
      amount: "",
      month: "",
      method: "cash",
      notes: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm p-6"
    >
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Add Payment</h2>
        <p className="text-sm text-gray-500">Record a payment for tenant/guest</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Building */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Building
          </label>
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 text-sm p-2.5"
          >
            <option value="">Select Building</option>
            {buildings.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Room */}
        {rooms.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room/Shop
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 text-sm p-2.5"
            >
              <option value="">Select Room</option>
              {rooms.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.roomNumber} (Cap: {r.capacity}, Avail: {r.available})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Guest */}
        {guests.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guest/Tenant
            </label>
            <select
              value={selectedGuest}
              onChange={(e) => setSelectedGuest(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 text-sm p-2.5"
            >
              <option value="">Select Guest</option>
              {guests.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Rent Amount"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 text-sm p-2.5"
            required
          />
        </div>

        {/* Month */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Month
          </label>
          <input
            type="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 text-sm p-2.5"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Method
          </label>
          <select
            name="method"
            value={formData.method}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 text-sm p-2.5"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        {/* Notes - full width */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            placeholder="Optional notes..."
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 text-sm p-2.5"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          Save Payment
        </button>
      </div>
    </form>
  );
}
