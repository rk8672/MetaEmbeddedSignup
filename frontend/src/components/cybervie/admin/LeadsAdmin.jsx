import React, { useEffect, useState } from "react";
import axios from "axios";
import PageWrapper from "../../../layouts/PageWrapper";
import TableWrapper from "../../../layouts/TableWrapper";

const statusColors = {
  new: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  "followed-up": "bg-blue-100 text-blue-800",
  enrolled: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const LeadsAdmin = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await axios.get("http://localhost:10000/api/leads");
      setLeads(res.data.data); // important: use res.data.data as per your response
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:10000/api/leads/${id}`, {
        status: newStatus,
      });
      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === id ? { ...lead, status: newStatus } : lead
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const columns = [
    {
      label: "#",
      render: (_, index) => index + 1,
    },
    {
      label: "Full Name",
      key: "fullName",
    },
    {
      label: "Mobile",
      key: "mobile",
    },
    {
      label: "Email",
      key: "email",
    },
  
    {
      label: "Status",
      render: (lead) => (
        <span
          className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
            statusColors[lead.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {lead.status}
        </span>
      ),
    },
    {
      label: "Update Status",
      render: (lead) => (
        <select
          value={lead.status}
          onChange={(e) => updateStatus(lead._id, e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none"
        >
          <option value="new">New</option>
          <option value="pending">Pending</option>
          <option value="followed-up">Followed-Up</option>
          <option value="enrolled">Enrolled</option>
          <option value="rejected">Rejected</option>
        </select>
      ),
    },
  ];

  return (
    <PageWrapper
      title="Leads Management"
      subtitle="Manage and update student leads here"
    >
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading leads...</div>
      ) : (
        <TableWrapper
          title="Leads Overview"
          description="All leads collected from the website"
          columns={columns}
          data={leads}
        />
      )}
    </PageWrapper>
  );
};

export default LeadsAdmin;
