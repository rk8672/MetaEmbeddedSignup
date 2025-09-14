import { useState, useEffect } from "react";
import API from "../utils/axiosInstance";
import { toast } from "react-toastify";
import WhatsAppDetail from "./DetailPage";
import EmbeddedSignupButton from "./EmbeddedSignupButton";

const WhatsAppDashboard = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // selected account

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const res = await API.get("/api/whatsapp/credentials");
      setCredentials(res.data);
    } catch {
      toast.error("Failed to fetch credentials");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading accounts...</p>;

  // 🔹 Conditional rendering: show detail if selected
  if (selected) {
    const account = credentials.find((c) => c._id === selected);
    return (
      <WhatsAppDetail
        wabaId={account.wabaId}
        token={account.accessToken}
        onBack={() => setSelected(null)}
      />
    );
  }

  // 🔹 Default: show account cards
  return (
    <div className="container mx-auto p-6">
      <EmbeddedSignupButton/>
      <h1 className="text-2xl font-bold mb-6">WhatsApp Business Accounts</h1>

      {credentials.length === 0 ? (
        <p className="text-gray-600">No WhatsApp accounts connected.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((cred) => (
            <div
              key={cred._id}
              className="bg-white shadow-lg rounded-2xl p-6 border hover:shadow-xl cursor-pointer transition"
              onClick={() => setSelected(cred._id)} // <-- select account
            >
              <h3 className="text-lg font-bold">
                {cred.displayName || "Unnamed Business"}
              </h3>
              <p className="text-sm text-gray-600">
                wabaId: {cred.wabaId}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhatsAppDashboard;
