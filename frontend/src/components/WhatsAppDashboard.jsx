import React, { useEffect, useState } from "react";
import api from "../utils/axiosInstance"; // axios instance with baseURL
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WhatsAppDashboard = () => {
  const [credentials, setCredentials] = useState([]);
  const [displayNameInput, setDisplayNameInput] = useState({}); // track inputs per credential

  // Fetch all credentials
  const fetchCredentials = async () => {
    try {
      const res = await api.get("/api/whatsapp/credentials");
      setCredentials(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch credentials");
    }
  };

  // Trigger phone verification
  const handleVerifyPhone = async (id) => {
    try {
      await api.post(`/api/whatsapp/verify/${id}`);
      toast.success("Phone verification triggered!");
      fetchCredentials();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to trigger phone verification");
    }
  };

  // Request display name approval
  const handleDisplayNameRequest = async (id) => {
    try {
      const displayName = displayNameInput[id];
      if (!displayName) return toast.error("Enter a display name first");

      await api.post(`/api/whatsapp/display-name/${id}`, { displayName });
      toast.success("Display name request sent!");
      fetchCredentials();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to request display name");
    }
  };

  // Polling every 5 seconds
  useEffect(() => {
    fetchCredentials();
    // const interval = setInterval(fetchCredentials, 5000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">WhatsApp Embedded Dashboard</h1>

      {credentials.length === 0 && <p>No connected WhatsApp numbers found.</p>}

      {credentials.map((cred) => (
        <div key={cred._id} className="border p-4 rounded shadow-md mb-4">
          <h3 className="font-bold">Phone Number: {cred.phoneNumberId}</h3>
          <p>Display Name: {cred.displayName || "N/A"}</p>
          <p>Display Name Status: {cred.displayNameStatus}</p>
          <p>Payment Method: {cred.paymentMethodStatus}</p>

          <button
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2 mr-2"
            onClick={() => handleVerifyPhone(cred._id)}
          >
            Verify Phone
          </button>

          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter display name"
              className="border p-1 rounded"
              value={displayNameInput[cred._id] || ""}
              onChange={(e) =>
                setDisplayNameInput({
                  ...displayNameInput,
                  [cred._id]: e.target.value,
                })
              }
            />
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => handleDisplayNameRequest(cred._id)}
            >
              Request Display Name
            </button>
          </div>
        </div>
      ))}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default WhatsAppDashboard;
