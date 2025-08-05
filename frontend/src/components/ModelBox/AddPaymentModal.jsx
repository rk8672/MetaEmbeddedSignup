import React, { useState, useEffect } from "react";

const AddPaymentModal = ({ isOpen, onClose, onSubmit, lead }) => {
  const [formData, setFormData] = useState({
    transactionId: "",
    amount: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        transactionId: "",
        amount: "",
        date: new Date().toISOString().split("T")[0], // default to today
        notes: "",
      });
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.transactionId || !formData.amount || !formData.date) {
      alert("Please fill all required fields.");
      return;
    }

    onSubmit({
      ...formData,
      leadId: lead._id,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded shadow-lg p-6 relative">
        <h2 className="text-lg font-semibold mb-4">Add Payment for {lead.fullName}</h2>

        <div className="mb-3">
          <label className="block font-medium mb-1">Transaction ID *</label>
          <input
            type="text"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">Amount (INR) *</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Notes (optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;
