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
import {
  Users,
  ClipboardList,
  Loader2,
  UserPlus,
  PhoneCall,
  Clock,
  Link,
  CheckCircle2,
  ThumbsDown,
} from "lucide-react";
const statusColors = {
  "new": "bg-gray-100 text-gray-800",               // Just registered (form submitted)
  "mentor-assigned": "bg-purple-100 text-purple-800",    // Mentor/executive assigned
  "mentor-in-contact": "bg-yellow-100 text-yellow-800",  // Mentor is in contact
  "payment-link-sent": "bg-indigo-100 text-indigo-800",  // Payment link shared
  "payment-done": "bg-blue-100 text-blue-800",           // Payment received
  "enrolled": "bg-green-100 text-green-800",             // Enrollment confirmed
  "not-interested": "bg-red-100 text-red-800",           // Rejected or unresponsive
};
const statusMeta = { 
  "new": {
    label: "New",
    color: "bg-gray-100 text-gray-800",
    icon: <UserPlus className="w-5 h-5 text-gray-800" />,
  },
  "mentor-assigned": {
    label: "Assigned",
    color: "bg-purple-100 text-purple-800",
    icon: <ClipboardList className="w-5 h-5 text-purple-800" />,
  },
  "mentor-in-contact": {
    label: "In Contact",
    color: "bg-yellow-100 text-yellow-800",
    icon: <PhoneCall className="w-5 h-5 text-yellow-800" />,
  },
  "payment-link-sent": {
    label: "Payment Sent",
    color: "bg-indigo-100 text-indigo-800",
    icon: <Link className="w-5 h-5 text-indigo-800" />,
  },
  "payment-done": {
    label: "Paid",
    color: "bg-blue-100 text-blue-800",
    icon: <CheckCircle2 className="w-5 h-5 text-blue-800" />,
  },
  "enrolled": {
    label: "Enrolled",
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle2 className="w-5 h-5 text-green-800" />,
  },
  "not-interested": {
    label: "Not Interested",
    color: "bg-red-100 text-red-800",
    icon: <ThumbsDown className="w-5 h-5 text-red-800" />,
  },
};
const priorityColors = {
  hot: "bg-red-100 text-red-700",
  warm: "bg-yellow-100 text-yellow-700",
  cold: "bg-blue-100 text-blue-700",
  dead: "bg-gray-200 text-gray-600",
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

const [fieldLoading, setFieldLoading] = useState({});
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
const setLoadingForField = (leadId, field, isLoading) => {
  setFieldLoading(prev => {
    const key = `${leadId}_${field}`;
    if (isLoading) {
      return { ...prev, [key]: true };
    } else {
      const { [key]: _, ...rest } = prev;
      return rest;
    }
  });
};
  const refreshLeads = async () => {
  const oldData = leads; // cache old data
  setLeads(oldData); // keep showing old data until new arrives

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
    console.error("Error refreshing leads:", err);
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
     setLoadingForField(id, "status", true);
    try {
      await axiosInstance.put(`/api/leads/${id}`, { status: newStatus });
     await  refreshLeads(); // refresh
    } catch (err) {
      console.error("Failed to update status:", err);
    }finally{
      setLoadingForField(id, "status", false);
    }
  };

  const updatePriorityStatus = async (id, newPriority) => { 
     setLoadingForField(id, "priority", true);
  try {
    await axiosInstance.patch(`/api/leads/${id}/priority-status`, { priorityStatus: newPriority });
   await  refreshLeads(); // refresh list
  } catch (err) {
    console.error("Failed to update priority status:", err);
  }finally{
     setLoadingForField(id, "priority", false);
  }
};

  const assignStaff = async (leadId, staffId) => {
      setLoadingForField(leadId, "assignedStaff", true);
    try {
      await axiosInstance.patch(`/api/leads/assign/${leadId}`, { staffId });
     await  refreshLeads(); // refresh
    } catch (err) {
      console.error("Failed to assign staff:", err);
    }finally{
       setLoadingForField(leadId, "assignedStaff", false);
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
     await   refreshLeads();
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
   await  refreshLeads();
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
   await  refreshLeads();
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
  label: "Name",
  render: (lead) => (
    <div className="text-sm font-semibold text-gray-800">
      {lead.fullName}
    </div>
  ),
},
{
  label: "Email",
  render: (lead) => (
    <div className="text-xs text-gray-600">
      {lead.email}
    </div>
  ),
},
{
  label: "Mobile",
  render: (lead) => (
    <div className="text-xs text-gray-600">
      {lead.mobile}
    </div>
  ),
},
  //  {
  //   label: "Payment",
  //   render: (lead) =>
  //     Array.isArray(lead.payments) && lead.payments.length > 0 ? (
  //       <div className="text-xs space-y-1">
  //         {lead.payments.map((p) => (
  //           <div key={p._id} className=" pb-1">
  //             <div className="text-green-700 font-semibold">₹ {p.amount}</div>
             
  //           </div>
  //         ))}
  //       </div>
  //     ) : (
  //       <span className="text-xs text-red-600 font-medium">Not Paid</span>
  //     ),
  // },
  {
    label: "Status",
    render: (lead) => (
      <div className="flex flex-col gap-1 text-xs">
        <div
          className={`px-2 py-1 rounded font-semibold capitalize text-center w-fit ${
            statusColors[lead.status] || "bg-gray-100 text-gray-600"
          }`}
        >
            {fieldLoading[`${lead._id}_status`] ? "Loading..." : lead.status} 
        </div>
       {/* <select
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
</select> */}
      </div>
    ),
  },
 {
  label: "Priority",
  render: (lead) => (
    <div className="flex flex-col gap-1 text-xs">
      {/* Show current priority */}
      <div
        className={`px-2 py-1 rounded font-semibold capitalize text-center w-fit ${
          priorityColors[lead.priorityStatus] || "bg-gray-100 text-gray-600"
        }`}
      >
    {fieldLoading[`${lead._id}_priority`] ? "Loading..." : (lead.priorityStatus || "Not Set")}
      </div>

      {/* Dropdown to update priority */}
      {/* <select
        value=""
        onChange={(e) => updatePriorityStatus(lead._id, e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none text-xs"
      >
        <option value="" disabled hidden>
          Update Priority
        </option>
        {Object.keys(priorityColors).map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select> */}
    </div>
  ),
},
// {
//   label: "Follow-up",
//   render: (lead) => (
//     <div className="flex flex-col gap-1 text-xs">
//       <button
//         onClick={() => {
//           setSelectedFollowUpLead(lead);
//           setIsFollowUpModalOpen(true);
//         }}
//         className="px-3 py-1.5 rounded bg-purple-600 text-white font-medium shadow-sm hover:bg-purple-700 transition duration-200"
//       >
//         Add
//       </button>
//       <button
//         onClick={() => {
//           setSelectedSeeFollowUpLead(lead);
//           setIsSeeFollowUpModalOpen(true);
//         }}
//         className="px-3 py-1.5 rounded bg-purple-100 text-purple-800 font-medium shadow-sm hover:bg-purple-200 transition duration-200"
//       >
//         View
//       </button>
//     </div>
//   ),
// },
  // {
  //   label: "Payment",
  //   render: (lead) => (
  //     <div className="flex flex-col gap-1 text-xs">
  //       <button
  //         onClick={() => handleSendLink(lead)}
  //         className="bg-blue-800 py-1.5 text-white px-2 py-1 rounded hover:bg-blue-900 transition"
  //       >
  //         Send Link
  //       </button>
  //       <button
  //         onClick={() => handleAddPaymentClick(lead)}
  //         className="bg-blue-200 py-1.5 text-blue-800 px-2 py-1 rounded hover:bg-blue-300 transition"
  //       >
  //         Add
  //       </button>
  //     </div>
  //   ),
  // },
  // {
  //   label: "Assign Staff",
  //   render: (lead) => (
  //     <div className="flex flex-col gap-1 text-xs">
  //       <div
  //         className={`rounded-md px-3 py-2 border ${
  //           lead.assignedStaff?.name
  //             ? "bg-gray-100 text-gray-800 border-gray-300"
  //             : "bg-red-100 text-red-700 border-red-300"
  //         }`}
  //       >
  //         {lead.assignedStaff?.name ? (
  //           <>
  //             <span className="font-semibold">{lead.assignedStaff.name}</span>
  //             <br />
  //             <span className="text-[10px]">{lead.assignedStaff.email}</span>
  //           </>
  //         ) : (
  //           <span className="italic">Not Assigned</span>
  //         )}
  //       </div>
  //       {user.role === "admin" && (
  //         <select
  //           value={lead.assignedTo || ""}
  //           onChange={(e) => assignStaff(lead._id, e.target.value)}
  //           className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-xs bg-white"
  //         >
  //           <option value="">-- Select Staff --</option>
  //           {staffList.map((staff) => (
  //             <option key={staff._id} value={staff._id}>
  //               {staff.name}
  //             </option>
  //           ))}
  //         </select>
  //       )}
  //     </div>
  //   ),
  // },
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
  <div className="flex flex-wrap items-center gap-3 mb-4">
    {/* "All Status" card */}
    <div
      onClick={() => setStatusFilter("")}
      className={`cursor-pointer rounded-lg px-3 py-2 flex items-center gap-2 font-medium transition-all duration-200
        ${
          statusFilter === ""
            ? "bg-blue-600 text-white shadow-lg scale-105 border-blue-700"
            : "bg-white text-gray-700 border border-gray-200 hover:shadow hover:scale-105"
        }`}
    >
      <Users className={`w-5 h-5 ${statusFilter === "" ? "text-white" : "text-blue-600"}`} />
      <span>All</span>
    </div>

    {/* Individual status cards */}
    {Object.keys(statusMeta).map((status) => {
      const meta = statusMeta[status];
      const isActive = statusFilter === status;

      return (
        <div
          key={status}
          onClick={() => setStatusFilter(status)}
          className={`cursor-pointer rounded-lg px-3 py-2 flex items-center gap-2 font-medium transition-all duration-200
            ${isActive
              ? "bg-indigo-600 text-white shadow-lg scale-105 border-indigo-700"
              : `${meta.color} hover:shadow hover:scale-105`
            }`}
        >
          {React.cloneElement(meta.icon, { className: `${isActive ? "text-white" : meta.icon.props.className}` })}
          <span>{meta.label}</span>
        </div>
      );
    })}
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
  title=""
  description={`Showing page ${page} of ${totalPages}`}
  columns={columns}
  data={leads}
  expandable={true}
renderExpanded={(lead) => (
  <div className="p-6 bg-gray-50 rounded-lg border space-y-8 text-sm">
{/* Lead Overview (Status + Priority + Staff compact) */}
<section className="">
  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
    Lead Overview
  </h3>

  <div className="grid grid-cols-2 gap-4 text-sm">
    {/* Left Column: Lead Info */}
    <div className="space-y-2">
      <p><span className="font-medium">Name:</span> {lead.fullName}</p>
      <p><span className="font-medium">Email:</span> {lead.email}</p>
      <p><span className="font-medium">Mobile:</span> {lead.mobile}</p>
    </div>
{/* Right Column: Status + Priority + Staff (stacked in columns) */}
<div className="grid grid-cols-3 gap-4 text-sm">
  {/* Status */}
  <div>
    <span className="font-medium block mb-1">Status</span>
    <div
      className={`px-2 py-1 rounded font-semibold capitalize text-center mb-2 ${
        statusColors[lead.status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {fieldLoading[`${lead._id}_status`] ? "Loading..." : lead.status}
    </div>
    <select
      value=""
      onChange={(e) => updateStatus(lead._id, e.target.value)}
      className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs bg-white"
    >
      <option value="" disabled hidden>Change</option>
      {Object.keys(statusColors).map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  </div>

  {/* Priority */}
  <div>
    <span className="font-medium block mb-1">Priority</span>
    <div
      className={`px-2 py-1 rounded font-semibold capitalize text-center mb-2 ${
        priorityColors[lead.priorityStatus] || "bg-gray-100 text-gray-600"
      }`}
    >
      {fieldLoading[`${lead._id}_priority`]
        ? "Loading..."
        : lead.priorityStatus || "Not Set"}
    </div>
    <select
      value=""
      onChange={(e) => updatePriorityStatus(lead._id, e.target.value)}
      className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs bg-white"
    >
      <option value="" disabled hidden>Change</option>
      {Object.keys(priorityColors).map((priority) => (
        <option key={priority} value={priority}>{priority}</option>
      ))}
    </select>
  </div>

  {/* Assigned Staff */}
  <div>
    <span className="font-medium block mb-1">Staff</span>
    <div
      className={`px-2 py-1 rounded font-semibold text-center mb-2 ${
        lead.assignedStaff?.name
          ? "bg-gray-100 text-gray-800 border border-gray-300"
          : "bg-red-100 text-red-700 border border-red-300"
      }`}
    >
      {lead.assignedStaff?.name || "Not Assigned"}
    </div>
    {user.role === "admin" && (
      <select
        value={lead.assignedTo || ""}
        onChange={(e) => assignStaff(lead._id, e.target.value)}
        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs bg-white"
      >
        <option value="">-- Select --</option>
        {staffList.map((staff) => (
          <option key={staff._id} value={staff._id}>
            {staff.name}
          </option>
        ))}
      </select>
    )}
  </div>
</div>

  </div>
</section>


    {/* Payments */}
    <section>
      <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">
        Received Payments
      </h3>
      {Array.isArray(lead.payments) && lead.payments.length > 0 ? (
        <table className="w-full text-left border border-gray-200 text-xs rounded">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-2 py-1 border">Txn ID</th>
              <th className="px-2 py-1 border">Amount</th>
              <th className="px-2 py-1 border">Date</th>
              <th className="px-2 py-1 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            {lead.payments.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-2 py-1 border">{p.transactionId}</td>
                <td className="px-2 py-1 border font-medium text-green-700">₹ {p.amount}</td>
                <td className="px-2 py-1 border">{new Date(p.date).toLocaleDateString()}</td>
                <td className="px-2 py-1 border">{p.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-red-600 italic">No payments received</p>
      )}
    </section>

    {/* Payment Links */}
    <section>
      <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">
        Payment Links
      </h3>
      {Array.isArray(lead.paymentLinks) && lead.paymentLinks.length > 0 ? (
        <table className="w-full text-left border border-gray-200 text-xs rounded">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-2 py-1 border">Link ID</th>
              <th className="px-2 py-1 border">Razorpay Link</th>
              <th className="px-2 py-1 border">Amount</th>
              <th className="px-2 py-1 border">Status</th>
              <th className="px-2 py-1 border">Created</th>
            </tr>
          </thead>
          <tbody>
            {lead.paymentLinks.map((pl) => (
              <tr key={pl._id} className="hover:bg-gray-50">
                <td className="px-2 py-1 border">{pl.linkId}</td>
                <td className="px-2 py-1 border text-blue-600">{pl.razorpayLinkId || "-"}</td>
                <td className="px-2 py-1 border">₹ {pl.amount}</td>
                <td className="px-2 py-1 border capitalize">{pl.status}</td>
                <td className="px-2 py-1 border">{new Date(pl.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 italic">No payment links created</p>
      )}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => handleSendLink(lead)}
          className="bg-blue-800 text-white px-3 py-1.5 rounded hover:bg-blue-900"
        >
          Send Link
        </button>
        <button
          onClick={() => handleAddPaymentClick(lead)}
          className="bg-blue-200 text-blue-800 px-3 py-1.5 rounded hover:bg-blue-300"
        >
          Add Payment
        </button>
      </div>
    </section>

   

 {/* Follow-ups */}
<section>
  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">
    Follow-ups
  </h3>

  {/* Buttons */}
  <div className="flex gap-2 mb-3">
    <button
      onClick={() => {
        setSelectedFollowUpLead(lead);
        setIsFollowUpModalOpen(true);
      }}
      className="px-3 py-1.5 rounded bg-purple-600 text-white shadow-sm hover:bg-purple-700"
    >
      Add Follow-up
    </button>
  </div>

  {/* Follow-up List */}
  <div className="space-y-3">
    {lead.followUps && lead.followUps.length > 0 ? (
      lead.followUps.map((fup) => (
        <div
          key={fup._id}
          className="p-3 rounded-lg border border-gray-200 shadow-sm bg-white"
        >
          <p className="text-sm text-gray-700">
            <span className="font-medium">Date:</span>{" "}
            {new Date(fup.date).toLocaleString()}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Note:</span> {fup.note}
          </p>
        </div>
      ))
    ) : (
      <p className="italic text-gray-500">No follow-up added</p>
    )}
  </div>
</section>


 
  </div>
)}


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
