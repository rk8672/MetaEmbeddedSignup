import React, { useState } from "react";

const ExpandableRow = ({ lead, onUpdateStatus, onUpdatePriority, onAssignStaff }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Summary row */}
      <tr
        className="cursor-pointer hover:bg-gray-100"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
        <td>{lead.fullName}</td>
        <td>{lead.email}</td>
        <td>{lead.mobile}</td>
        <td>{lead.status}</td>
        <td>{lead.priorityStatus || "Not Set"}</td>
      </tr>

      {/* Expanded details */}
      {isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan={6}>
            <div className="p-4 border-t space-y-3">
              <h4 className="font-semibold">Payments</h4>
              {lead.payments?.length > 0 ? (
                lead.payments.map((p) => (
                  <div key={p._id}>₹ {p.amount}</div>
                ))
              ) : (
                <div>Not Paid</div>
              )}

              <h4 className="font-semibold mt-2">Actions</h4>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded">Send Link</button>
                <button className="px-3 py-1 bg-green-600 text-white rounded">Add Payment</button>
                <button className="px-3 py-1 bg-purple-600 text-white rounded">Add Follow-up</button>
              </div>

              <h4 className="font-semibold mt-2">Assign Staff</h4>
              <select
                value={lead.assignedTo || ""}
                onChange={(e) => onAssignStaff(lead._id, e.target.value)}
                className="px-2 py-1 border rounded"
              >
                <option value="">-- Select Staff --</option>
                {/* Map your staff list here */}
              </select>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ExpandableRow;