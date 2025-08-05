import React from "react";

const SeeFollowUpModal = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          Follow-Up History for {lead.fullName}
        </h2>

        {lead.followUps && lead.followUps.length > 0 ? (
          <ul className="space-y-3 mb-6">
            {lead.followUps
              .slice()
              .reverse()
              .map((fu) => (
                <li
                  key={fu._id}
                  className="border border-gray-200 rounded p-3 bg-gray-50"
                >
                  <p className="text-sm text-gray-800 mb-2">{fu.note}</p>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>
                      Status:{" "}
                      <strong className="capitalize text-gray-700">
                        {fu.statusAtTime || "N/A"}
                      </strong>
                    </span>
                    <span>{new Date(fu.date).toLocaleString()}</span>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600 mb-6">
            No follow-up history available.
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeeFollowUpModal;
