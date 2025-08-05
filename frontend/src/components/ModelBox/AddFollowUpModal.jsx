import React, { useState } from "react";

const AddFollowUpModal = ({ isOpen, onClose, onSubmit, lead }) => {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("in-progress");

  if (!isOpen || !lead) return null;

  const handleSubmit = () => {
    if (!note || !status) return alert("Note and status are required.");
    onSubmit({ note, status });
    setNote("");
    setStatus("in-progress");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Add Follow-Up for {lead.fullName}</h2>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write follow-up note..."
          rows={4}
          className="w-full border p-2 rounded mb-4"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full mb-4 border p-2 rounded"
        >
          <option value="in-progress">In Progress</option>
          <option value="payment-link-sent">Payment Link Sent</option>
          <option value="payment-done">Payment Done</option>
          <option value="enrolled">Enrolled</option>
          <option value="not-interested">Not Interested</option>
        </select>
        <div className="flex justify-end gap-2 mb-6">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>

      
      </div>
    </div>
  );
};

export default AddFollowUpModal;
