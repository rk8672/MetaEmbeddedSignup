import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import TableWrapper from "../../layouts/TableWrapper"; // adjust path if needed

export default function PaymentList({ refresh }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [refresh]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/payments");
      setPayments(res.data || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading payments...</p>;

  const columns = [
    {
      key: "month",
      label: "Month",
      render: (row) => `${row.month}/${row.year}`,
    },
    {
      key: "payer",
      label: "Guest/Tenant",
      render: (row) => row.payer?.name || "Unknown",
    },
    {
      key: "rentAmount",
      label: "Rent",
      render: (row) => `₹${row.rentAmount}`,
    },
    {
      key: "paidAmount",
      label: "Paid",
      render: (row) => `₹${row.paidAmount}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.status === "paid"
              ? "bg-green-100 text-green-700"
              : row.status === "partial"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status?.toUpperCase() || "N/A"}
        </span>
      ),
    },
    {
      key: "paymentDate",
      label: "Date",
      render: (row) =>
        row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : "-",
    },
    {
      key: "paymentMode",
      label: "Mode",
      render: (row) => row.paymentMode || "-",
    },
  ];

  return (
    <div className="mt-8">
      <TableWrapper
        title="Payments"
        description="List of all rent payments"
        columns={columns}
        data={payments}
        expandable={true}
        expandColumnTitle="Details"
        renderExpanded={(row) => (
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Notes:</span>{" "}
              {row.notes || "No notes"}
            </p>
            <p>
              <span className="font-medium">Payer ID:</span> {row.payer?._id}
            </p>
            <p>
              <span className="font-medium">Payment ID:</span> {row._id}
            </p>
          </div>
        )}
      />
    </div>
  );
}
