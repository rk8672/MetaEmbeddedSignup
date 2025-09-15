import { useState, useEffect } from "react"; 
import API from "../utils/axiosInstance";
import { toast } from "react-toastify";
import WhatsAppDetail from "./DetailPage";
import { Phone, Key, Database, PlusCircle } from "lucide-react"; 

const WhatsAppDashboard = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); 

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">Loading accounts...</p>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            WhatsApp Business Accounts
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your connected WhatsApp accounts and view details.
          </p>
        </div>
       
      </div>

      {credentials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <Database className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-600">No WhatsApp accounts connected yet.</p>
          <p className="text-sm text-gray-500 mt-1">
            Connect WhatsApp Business account.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((cred) => (
            <div
              key={cred._id}
              className="bg-white shadow-md hover:shadow-xl rounded-xl p-6 border border-gray-100 cursor-pointer transition-all transform hover:scale-105"
              onClick={() => setSelected(cred._id)} 
            >
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-6 h-6 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  WhatsApp Account
                </h2>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">WABA ID</p>
                <p className="text-base font-medium text-blue-700 break-all">
                  {cred.wabaId}
                </p>

                <p className="text-sm text-gray-500 mt-3">Phone Number ID</p>
                <p className="text-base font-medium text-gray-800 break-all">
                  {cred.phoneNumberId}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhatsAppDashboard;
