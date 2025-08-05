import React, { useState } from "react";

const SendPaymentModal = ({ lead, isOpen, onClose, onConfirm }) => {
  const [amount, setAmount] = useState(499);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    setIsSending(true);
    await onConfirm({ ...lead, amount });
    setIsSending(false);
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[400px] relative">
        <h2 className="text-lg font-bold mb-4">Send Payment Link</h2>

        <div className="mb-2"><strong>Name:</strong> {lead.fullName}</div>
        <div className="mb-2"><strong>Email:</strong> {lead.email}</div>
        <div className="mb-2"><strong>Mobile:</strong> {lead.mobile}</div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Amount (₹):</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-full"
            value={amount}
            disabled={isSending}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-3 py-1 bg-gray-300 rounded"
            onClick={onClose}
            disabled={isSending}
          >
            Cancel
          </button>
          <button
            className={`px-3 py-1 text-white rounded ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Link"}
          </button>
        </div>

        {isSending && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendPaymentModal;
