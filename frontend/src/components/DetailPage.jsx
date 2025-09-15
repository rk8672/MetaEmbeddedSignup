import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import { toast ,ToastContainer} from "react-toastify";

const WhatsAppDetail = ({ wabaId, token, onBack,account }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);


  // new: state for actions
  const [actionLoading, setActionLoading] = useState(false);
  const [displayNameLoading, setDisplayNameLoading] = useState(false);

  const [displayNameResponse, setDisplayNameResponse] = useState(null);
const [otpCode, setOtpCode] = useState("");
const [showOtpForm, setShowOtpForm] = useState(false);
  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await api.post("/api/details", {
        whatsappId: wabaId,
        accessToken: token,
      });
      setDetails(res.data);
    } catch {
      toast.error("Failed to fetch WhatsApp details");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Action: Call Display Name API
  const fetchDisplayName = async (phoneNumberId) => {
    try {
      setDisplayNameLoading(true);
      const res = await api.post("/api/displayName", {
        phoneNumberId: phoneNumberId,
        accessToken: token,
      });
         setDisplayNameResponse(res.data.data[0]);
      toast.success("Fetched Display Name successfully");
    } catch {
      toast.error("Failed to fetch Display Name");
    } finally {
      setDisplayNameLoading(false);
    }
  };

  // Request OTP
const requestOtp = async (phoneNumberId) => {
  try {
    setActionLoading(true);
    const res = await api.post("/api/verification/request-otp", {
      phoneNumberId,
      accessToken: token,
    });
    toast.success("OTP sent successfully via SMS");
    setShowOtpForm(true); // ✅ only show form after success
    console.log("Request OTP Success:", res.data);
  } catch (err) {
    const errorMsg =
      err.response?.data?.error?.error_user_msg ||
      err.response?.data?.error?.message ||
      "Failed to send OTP";
    toast.error(errorMsg);
  } finally {
    setActionLoading(false);
  }
};

// Verify OTP
const verifyOtp = async (phoneNumberId, code) => {
  try {
    setActionLoading(true);
    const res = await api.post("/api/verification/verify-otp", {
      phoneNumberId,
      accessToken: token,
      code,
    });
    toast.success("Mobile verified successfully");
    console.log("Verify OTP Success:", res.data);
  }catch (err) {
  const errorData = err.response?.data?.error;
  console.error("OTP Error:", errorData);

  // Show Meta error message in toast
  if (errorData?.error_user_msg) {
    toast.error(errorData.error_user_msg);
  } else {
    toast.error(errorData?.message || "Something went wrong");
  }

  // Optional: show raw response in console (debugging)
  console.log("Full Error:", errorData);
} finally {
    setActionLoading(false);
  }
};
const subscribeWebhook = async (wabaId) => {
  try {
    setActionLoading(true);
    const res = await api.post("/api/webhookSubscribe/subscribe", {
      wabaId,
      accessToken: token,
    });
    toast.success("Webhook subscribed successfully");
    console.log("Webhook Subscribed:", res.data);
  } catch (err) {
    const errorMsg =
      err.response?.data?.error?.message || "Failed to subscribe webhook";
    toast.error(errorMsg);
  } finally {
    setActionLoading(false);
  }
};
  if (loading) return <p className="p-6">Loading details...</p>;

  return (
    <div className="p-6">
        <ToastContainer position="top-right" autoClose={3000} />
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-sm"
      >
        ← Back
      </button>

      {!details ? (
        <p className="text-red-500">No details found.</p>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            WhatsApp Account Details
          </h1>

          {details.data?.map((item, index) => (
            <div
              key={index}
              className="mb-6 p-6 border rounded-2xl shadow-md bg-white hover:shadow-lg transition"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Verified Name */}
                <div>
                  <p className="text-sm text-gray-500">Verified Name</p>
                  <p className="text-base font-medium text-gray-900">
                    {item.verified_name || "—"}
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-base font-medium text-gray-900">
                    {item.display_phone_number}
                  </p>
                </div>

               

                {/* Quality Rating */}
                <div>
                  <p className="text-sm text-gray-500">Quality Rating</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-lg ${
                      item.quality_rating === "GREEN"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.quality_rating}
                  </span>
                </div>

                {/* Platform Type */}
                <div>
                  <p className="text-sm text-gray-500">Platform Type</p>
                  <p className="text-base font-medium text-gray-900">
                    {item.platform_type}
                  </p>
                </div>

                {/* Throughput */}
                <div>
                  <p className="text-sm text-gray-500">Throughput Level</p>
                  <p className="text-base font-medium text-gray-900">
                    {item.throughput?.level}
                  </p>
                </div>

                {/* Webhook */}
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Webhook URL</p>
                  <a
                    href={item.webhook_configuration?.application}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {item.webhook_configuration?.application}
                  </a>
                </div>

                {/* ID */}
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Account ID</p>
                  <p className="text-base font-medium text-gray-900">
                    {item.id}
                  </p>
                </div>
              </div>
                 {/* 🔹 Actions Section */}
       <div className=" bg-white mt-8">
  <h1 className="text-lg font-semibold text-gray-800 mb-4">
    Actions
  </h1>

 <h3 className="text-md font-semibold text-gray-700 mb-3">
    Display Name
  </h3>
  <button
    onClick={() => fetchDisplayName(item.id)}
    disabled={displayNameLoading}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-400"
  >
    {displayNameLoading ? "Fetching..." : "Get Display Name"}
  </button>

  {displayNameResponse && displayNameResponse.id === item.id && (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <p className="text-sm text-gray-500 mb-2">Display Name Details</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
        <div>
          <p className="font-medium text-gray-900">Verified Name</p>
          <p>{displayNameResponse.verified_name}</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">Name Status</p>
          <p>{displayNameResponse.name_status}</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">Phone Number</p>
          <p>{displayNameResponse.display_phone_number}</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">ID</p>
          <p>{displayNameResponse.id}</p>
        </div>
      </div>
    </div>
    
  )}

  {/* Mobile Verification */}
<div className="mt-8">
  <h3 className="text-md font-semibold text-gray-700 mb-3">
    Mobile Verification
  </h3>

  {/* Request OTP */}
  <button
    onClick={() => requestOtp(item.id)}
    disabled={actionLoading}
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 disabled:bg-gray-400"
  >
    {actionLoading ? "Sending OTP..." : "Send OTP"}
  </button>

  {/* OTP Form (shown only after request success) */}
  {showOtpForm && (
    <div className="mt-4 flex items-center gap-3">
      <input
        type="text"
        placeholder="Enter OTP"
        className="flex-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
      />
      <button
        onClick={() => verifyOtp(item.id, otpCode)}
        disabled={actionLoading}
        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:bg-gray-400"
      >
        {actionLoading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  )}
</div>



<div className="mt-8">
  <h3 className="text-md font-semibold text-gray-700 mb-3">
    Webhook Subscription
  </h3>

  <button
    onClick={() => subscribeWebhook(wabaId)}
    disabled={actionLoading}
    className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 disabled:bg-gray-400"
  >
    {actionLoading ? "Subscribing..." : "Subscribe Webhook"}
  </button>
</div>

</div>
            </div>
            
          ))}

       
        </div>
      )}
    </div>
  );
};

export default WhatsAppDetail;
