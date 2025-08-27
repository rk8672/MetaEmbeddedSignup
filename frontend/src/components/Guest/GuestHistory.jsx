import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const GuestHistory = ({ guestId }) => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get(`/api/guests/${guestId}/history`);
        setPayments(res.data?.data?.payments || []);
      } catch (err) {
        console.error("Error fetching guest history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [guestId]);

  if (loading) return <p className="text-gray-500 text-sm">Loading history...</p>;

  if (!payments.length)
    return <p className="text-gray-500 text-sm">No payment records found</p>;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {payments.map((p) => (
        <div
          key={p._id}
          className="border rounded-lg bg-white shadow-sm p-3 flex flex-col gap-1"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-sm">
              {p.month}/{p.year}
            </h4>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                p.status === "paid"
                  ? "bg-green-100 text-green-700"
                  : p.status === "partial"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {p.status.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-gray-600">
            Rent: <span className="font-medium">₹{p.rentAmount}</span>
          </p>
          <p className="text-xs text-gray-600">
            Paid: <span className="font-medium">₹{p.paidAmount}</span>
          </p>
          <p className="text-xs text-gray-600">
            Date:{" "}
            {p.paymentDate
              ? new Date(p.paymentDate).toLocaleDateString()
              : "-"}
          </p>
          <p className="text-xs text-gray-600">
            Mode: <span className="font-medium">{p.paymentMode}</span>
          </p>
          {p.notes && (
            <p className="text-xs text-gray-500 italic">"{p.notes}"</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default GuestHistory;
