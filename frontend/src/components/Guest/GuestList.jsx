import React, { useState } from "react";
import GuestHistory from "./GuestHistory";
const GuestList = ({ guests, onAssignRoom }) => {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="bg-white shadow rounded-xl p-4">
      {guests.length === 0 ? (
        <p className="text-gray-500">No guests found</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-left bg-gray-50">
              <th className="p-2">Name</th>
              <th className="p-2">Mobile</th>
              <th className="p-2">Building</th>
              <th className="p-2">Room</th>
              <th className="p-2">Rent</th>
              <th className="p-2">Latest Status</th>
              <th className="p-2">Due</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <React.Fragment key={g._id}>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">{g.name}</td>
                  <td className="p-2">{g.mobileNumber}</td>
                  <td className="p-2">{g.buildingName || "Not Assigned"}</td>
                  <td className="p-2">{g.roomNumber || "-"}</td>
                  <td className="p-2">₹{g.expectedRent}</td>
                  <td className="p-2">
                    {g.latestStatus ? (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          g.latestStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : g.latestStatus === "partial"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {g.latestStatus.toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No Payments</span>
                    )}
                  </td>
                  <td className="p-2">
                    <span
                      className={`font-semibold ${
                        g.dueAmount > 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ₹{g.dueAmount}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => onAssignRoom(g)}
                      className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg"
                    >
                      Assign Room
                    </button>
                    <button
                      onClick={() => toggleExpand(g._id)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg"
                    >
                      {expanded === g._id ? "Hide" : "History"}
                    </button>
                  </td>
                </tr>

                {/* Expandable Full Payment History */}
                {expanded === g._id && (
  <tr>
    <td colSpan={8} className="bg-gray-50 p-3">
      <GuestHistory guestId={g._id} />
    </td>
  </tr>
)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GuestList;
