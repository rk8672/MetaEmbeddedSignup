import React, { useEffect, useState } from "react";
import PageWrapper from "../../layouts/PageWrapper";
import TableWrapper from "../../layouts/TableWrapper";
import axiosInstance from "../../utils/axiosInstance";
import SendPaymentModal from "../ModelBox/SendPaymentModal";
import ResultModal from "../ModelBox/ResultModal";
import AddPaymentModal from "../ModelBox/AddPaymentModal";
import AddFollowUpModal from "../ModelBox/AddFollowUpModal";
import SeeFollowUpModal from "../ModelBox/SeeFollowUpModal";
import { useSelector } from "react-redux";
const statusColors = {
  "new": "bg-gray-100 text-gray-800",               // Just registered (form submitted)
  "mentor-assigned": "bg-purple-100 text-purple-800",    // Mentor/executive assigned
  "mentor-in-contact": "bg-yellow-100 text-yellow-800",  // Mentor is in contact
  "payment-link-sent": "bg-indigo-100 text-indigo-800",  // Payment link shared
  "payment-done": "bg-blue-100 text-blue-800",           // Payment received
  "enrolled": "bg-green-100 text-green-800",             // Enrollment confirmed
  "not-interested": "bg-red-100 text-red-800",           // Rejected or unresponsive
};

const LeadsTable = () => {
  const user=useSelector((state)=>(state.auth.user))
  const [leads, setLeads] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // e.g., "new", "enrolled"
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [resultModalData, setResultModalData] = useState({
    isOpen: false,
    type: "",
    message: "",
    link: "",
  });
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
const [selectedPaymentLead, setSelectedPaymentLead] = useState(null);
const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
const [selectedFollowUpLead, setSelectedFollowUpLead] = useState(null);

const [isSeeFollowUpModalOpen, setIsSeeFollowUpModalOpen] = useState(false);
const [selectedSeeFollowUpLead, setSelectedSeeFollowUpLead] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/leads", {
        params: {
          page,
          limit,
          ...(statusFilter && { status: statusFilter }),
        },
      });
      setLeads(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axiosInstance.get("/api/user/staff");
      setStaffList(res.data.staff);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/api/leads/${id}`, { status: newStatus });
      fetchLeads(); // refresh
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const assignStaff = async (leadId, staffId) => {
    try {
      await axiosInstance.patch(`/api/leads/assign/${leadId}`, { staffId });
      fetchLeads(); // refresh
    } catch (err) {
      console.error("Failed to assign staff:", err);
    }
  };



  const handleSendLink = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };
    const handleConfirmSend = async (data) => {
    try {
      const res = await axiosInstance.post("/api/email/send-payment-link", {
        fullName: data.fullName,
        email: data.email,
        contact: data.mobile,
        amount: data.amount,
      });
       fetchLeads();
      setResultModalData({
        isOpen: true,
        type: "success",
        message: res.data.message,
        link: res.data.link,
      });
    } catch (err) {
      console.error(err);
      setResultModalData({
        isOpen: true,
        type: "error",
        message: err.response?.data?.message || "Failed to send payment link",
        link: "",
      });
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleAddPaymentClick = (lead) => {
  setSelectedPaymentLead(lead);
  setIsAddPaymentModalOpen(true);
};

const handleSubmitPayment = async (paymentData) => {
  try {
    const res = await axiosInstance.post("/api/payments/attach", paymentData);
    fetchLeads();
  } catch (err) {
    console.error("Error submitting payment:", err);
    alert(err?.response?.data?.message || "Failed to attach payment");
  } finally {
    setIsAddPaymentModalOpen(false);
  }
};

const handleSubmitFollowUp = async (followUpData) => {
  try {
    await axiosInstance.post(`/api/leads/followup/${selectedFollowUpLead._id}`, followUpData);
    setIsFollowUpModalOpen(false);
    fetchLeads();
  } catch (err) {
    console.error("Error adding follow-up:", err);
    alert(err.response?.data?.message || "Failed to add follow-up");
  }
};

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter]);

  useEffect(() => {
    fetchStaff();
  }, []);

const columns = [
  {
    label: "#",
    render: (_, index) => (page - 1) * limit + index + 1,
  },
  {
    label: "Date",
    render: (lead) => (
      <div className="text-xs text-gray-600 whitespace-nowrap">
        {new Date(lead.createdAt).toLocaleDateString()}
      </div>
    ),
  },
  {
    label: "Lead Info",
    render: (lead) => (
      <div className="text-sm leading-tight space-y-0.5">
        <div className="font-semibold text-gray-800">{lead.fullName}</div>
        <div className="text-gray-600 text-xs">{lead.email}</div>
        <div className="text-gray-600 text-xs">{lead.mobile}</div>
      </div>
    ),
  },
   {
    label: "Payment",
    render: (lead) =>
      Array.isArray(lead.payments) && lead.payments.length > 0 ? (
        <div className="text-xs space-y-1">
          {lead.payments.map((p) => (
            <div key={p._id} className=" pb-1">
              <div className="text-green-700 font-semibold">₹ {p.amount}</div>
              {/* <div className="text-gray-500 text-[11px]">
                {new Date(p.date).toLocaleDateString()}
              </div> */}
            </div>
          ))}
        </div>
      ) : (
        <span className="text-xs text-red-600 font-medium">Not Paid</span>
      ),
  },
  {
    label: "Status",
    render: (lead) => (
      <div className="flex flex-col gap-1 text-xs">
        <div
          className={`px-2 py-1 rounded font-semibold capitalize text-center w-fit ${
            statusColors[lead.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {lead.status}
        </div>
       <select
  value=""
  onChange={(e) => updateStatus(lead._id, e.target.value)}
  className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none text-xs"
>
  <option value="" disabled hidden>
    Update Status
  </option>
  {Object.keys(statusColors).map((status) => (
    <option key={status} value={status}>
      {status}
    </option>
  ))}
</select>
      </div>
    ),
  },
 
{
  label: "Follow-up",
  render: (lead) => (
    <div className="flex flex-col gap-1 text-xs">
      <button
        onClick={() => {
          setSelectedFollowUpLead(lead);
          setIsFollowUpModalOpen(true);
        }}
        className="px-3 py-1.5 rounded bg-purple-600 text-white font-medium shadow-sm hover:bg-purple-700 transition duration-200"
      >
        Add
      </button>
      <button
        onClick={() => {
          setSelectedSeeFollowUpLead(lead);
          setIsSeeFollowUpModalOpen(true);
        }}
        className="px-3 py-1.5 rounded bg-purple-100 text-purple-800 font-medium shadow-sm hover:bg-purple-200 transition duration-200"
      >
        View
      </button>
    </div>
  ),
},
  {
    label: "Payment",
    render: (lead) => (
      <div className="flex flex-col gap-1 text-xs">
        <button
          onClick={() => handleSendLink(lead)}
          className="bg-blue-800 py-1.5 text-white px-2 py-1 rounded hover:bg-blue-900 transition"
        >
          Send Link
        </button>
        <button
          onClick={() => handleAddPaymentClick(lead)}
          className="bg-blue-200 py-1.5 text-blue-800 px-2 py-1 rounded hover:bg-blue-300 transition"
        >
          Add
        </button>
      </div>
    ),
  },
  {
    label: "Assign Staff",
    render: (lead) => (
      <div className="flex flex-col gap-1 text-xs">
        <div
          className={`rounded-md px-3 py-2 border ${
            lead.assignedStaff?.name
              ? "bg-gray-100 text-gray-800 border-gray-300"
              : "bg-red-100 text-red-700 border-red-300"
          }`}
        >
          {lead.assignedStaff?.name ? (
            <>
              <span className="font-semibold">{lead.assignedStaff.name}</span>
              <br />
              <span className="text-[10px]">{lead.assignedStaff.email}</span>
            </>
          ) : (
            <span className="italic">Not Assigned</span>
          )}
        </div>
        {user.role === "admin" && (
          <select
            value={lead.assignedTo || ""}
            onChange={(e) => assignStaff(lead._id, e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-xs bg-white"
          >
            <option value="">-- Select Staff --</option>
            {staffList.map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.name}
              </option>
            ))}
          </select>
        )}
      </div>
    ),
  },
];




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

  const renderFilters = () => (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2 border rounded-md shadow-sm focus:outline-none"
      >
        <option value="">All Status</option>
        {Object.keys(statusColors).map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    </div>
  );

  return (
    // <PageWrapper title="Leads Management" subtitle="Manage and update student leads here">
    <PageWrapper title="Leads Management" subtitle="" actions={renderFilters()}>

      <div className="p-0">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading leads...</div>
        ) : (
          <>
            <TableWrapper
              // title="Leads Management"
              description={`Showing page ${page} of ${totalPages}`}
                title=""
              columns={columns}
              data={leads}
            />
            {renderPagination()}
          </>
        )}
          <SendPaymentModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSend}
      />
       <ResultModal
        isOpen={resultModalData.isOpen}
        type={resultModalData.type}
        message={resultModalData.message}
        link={resultModalData.link}
        onClose={() =>
          setResultModalData((prev) => ({ ...prev, isOpen: false }))
        }
      />
      <AddPaymentModal
  isOpen={isAddPaymentModalOpen}
  onClose={() => setIsAddPaymentModalOpen(false)}
  onSubmit={handleSubmitPayment}
  lead={selectedPaymentLead}
/>
<AddFollowUpModal
  isOpen={isFollowUpModalOpen}
  onClose={() => setIsFollowUpModalOpen(false)}
  onSubmit={handleSubmitFollowUp}
  lead={selectedFollowUpLead}
/>
<SeeFollowUpModal
  isOpen={isSeeFollowUpModalOpen}
  onClose={() => setIsSeeFollowUpModalOpen(false)}
  lead={selectedSeeFollowUpLead}
/>
      </div>
    </PageWrapper>
  );
};

export default LeadsTable;
