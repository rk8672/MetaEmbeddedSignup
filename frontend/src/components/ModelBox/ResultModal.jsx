import React from "react";

const ResultModal = ({ isOpen, onClose, type, message, link }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <h2
          className={`text-xl font-bold mb-4 ${
            type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {type === "success" ? "Success" : "Error"}
        </h2>

        <p className="mb-4">{message}</p>

        {type === "success" && link && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">Payment Link:</p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {link}
            </a>
          </div>
        )}

        <div className="text-right">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
