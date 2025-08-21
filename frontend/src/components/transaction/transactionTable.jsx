import React, { useEffect, useState } from "react";
import PageWrapper from "../../layouts/PageWrapper";
import TableWrapper from "../../layouts/TableWrapper";
import axiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";

const statusColors = {
  created: "bg-gray-100 text-gray-800", // Just created
  authorized: "bg-yellow-100 text-yellow-800", // Razorpay authorized
  captured: "bg-green-100 text-green-800", // Payment captured
  paid: "bg-blue-100 text-blue-800", // Payment link fully paid
  failed: "bg-red-100 text-red-800", // Payment failed
};

const TransactionTable = () => {
  const user = useSelector((state) => state.auth.user);
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch transactions API
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/transactions", {
        params: { page, limit, ...(statusFilter && { status: statusFilter }) },
      });

      setTransactions(res.data.data);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, statusFilter]);

  // Define table columns
  const columns = [
    {
      label: "#",
      render: (_, index) => (page - 1) * limit + index + 1,
    },
    {
      label: "Date",
      render: (txn) => (
        <div className="text-xs text-gray-600 whitespace-nowrap">
          {new Date(txn.createdAt).toLocaleString()}
        </div>
      ),
    },
    {
      label: "Student",
      render: (txn) => (
        <div className="text-sm leading-tight space-y-0.5">
          <div className="font-semibold text-gray-800">{txn.customer.name}</div>
          <div className="text-gray-600 text-xs">{txn.customer.email}</div>
          <div className="text-gray-600 text-xs">{txn.customer.contact}</div>
        </div>
      ),
    },
    {
      label: "Payment",
      render: (txn) => (
        <div className="text-sm font-semibold text-green-700">
          ₹ {(txn.amount).toFixed(2)} {txn.currency}
        </div>
      ),
    },
    {
      label: "Method",
      render: (txn) => (
        <span className="text-xs font-medium text-gray-700 uppercase">
          {txn.method || "—"}
        </span>
      ),
    },
    {
      label: "Status",
      render: (txn) => (
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${
            statusColors[txn.status] || "bg-gray-200 text-gray-700"
          }`}
        >
          {txn.status}
        </span>
      ),
    },
  ];

  // Pagination
  const renderPagination = () => (
    <div className="mt-4 flex justify-center gap-2">
      {[...Array(totalPages).keys()].map((i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-4 py-2 rounded-md text-sm border ${
            page === i + 1
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );



  return (
    <PageWrapper title="Transactions" subtitle="Manage all Razorpay transactions" >
      <div className="p-0">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading transactions...</div>
        ) : (
          <>
            <TableWrapper
              description={`Showing page ${page} of ${totalPages}`}
              title=""
              columns={columns}
              data={transactions}
            />
            {renderPagination()}
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default TransactionTable;
