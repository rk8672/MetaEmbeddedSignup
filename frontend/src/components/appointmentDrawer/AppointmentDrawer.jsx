import { useState, useEffect } from "react";
import api from "../../utils/axiosInstance"
import {
  X,
  CalendarPlus,
  User,
  Phone,
  MapPin,
  Calendar,
  Hash
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const AppointmentDrawer = ({ isOpen, onClose }) => {
  
  const[doctorsList,setDoctorsList]=useState([])

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    age: "",
    address: "",
    appointmentDate: "",
    doctor: ""
  });

  const fetchDoctors=async()=>{

try{
const res=await api.get("/api/doctors");
setDoctorsList(res.data);
}catch(err){
 console.error("Error fetching doctors:", err);
}
  }

  useEffect(()=>{
fetchDoctors();
  },[])
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const formatted = now.toISOString().slice(0, 16);
      setFormData((prev) => ({ ...prev, appointmentDate: formatted }));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Appointment:", formData);
    // Perform POST API request here
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm"
        >
          <Motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-xl h-full bg-white shadow-xl flex flex-col"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                <CalendarPlus className="w-6 h-6" /> Book Appointment
              </h2>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 px-4 py-6 flex flex-col gap-6 overflow-y-auto text-sm text-gray-800 bg-gray-50"
            >
              <Card title="Patient Details">
                <FloatingInput
                  id="fullName"
                  name="fullName"
                  placeholder="Ramesh Kumar"
                  icon={<User className="w-4 h-4 text-blue-500" />}
                  label="Full Name"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                />


                
                <FloatingInput
                  id="mobile"
                  name="mobile"
                  placeholder="9654XXX877"
                  icon={<Phone className="w-4 h-4 text-green-600" />}
                  label="Mobile Number"
                  type="tel"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={formData.mobile}
                  onChange={handleChange}
                />
                <FloatingInput
                  id="age"
                  name="age"
                  placeholder="33"
                  icon={<Hash className="w-4 h-4 text-orange-500" />}
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                />
                <FloatingInput
                  id="address"
                  name="address"
                  placeholder="e.g. Ashok Nagar"
                  icon={<MapPin className="w-4 h-4 text-purple-500" />}
                  label="Local Area"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                />
                <FloatingInput
                  id="appointmentDate"
                  name="appointmentDate"
                  icon={<Calendar className="w-4 h-4 text-blue-600" />}
                  label="Appointment Date"
                  type="date"
                  value={formData.appointmentDate.split("T")[0]}
                  onChange={handleChange}
                />
              </Card>

              <Card title="Select Doctor">
                <div className="flex flex-col gap-2 pl-1">
                  {doctorsList.map(
                    (doc) => (
                      <label
                        key={doc._id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="doctor"
                          value={doc._id}
                          checked={formData.doctor === doc._id}
                          onChange={handleChange}
                          className="form-radio text-blue-600"
                          required
                        />
                        <span>{doc.name}</span>
                      </label>
                    )
                  )}
                </div>
              </Card>

              <div className="px-1 pt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition shadow"
                >
                  Confirm Appointment
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-gray-200 text-black py-2 rounded-lg font-semibold transition shadow"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-sm border p-4">
    {title && <h3 className="text-md font-semibold text-blue-700 mb-3">{title}</h3>}
    <div className="space-y-4">{children}</div>
  </div>
);

const FloatingInput = ({
  id,
  name,
  icon,
  label,
  type,
  placeholder,
  maxLength,
  pattern,
  value,
  onChange
}) => (
  <div className="relative">
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      maxLength={maxLength}
      pattern={pattern}
      value={value}
      onChange={onChange}
      className="peer w-full pl-10 shadow border p-3 border-gray-500 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
      required
    />
    <label
      htmlFor={id}
      className="absolute left-12 -top-2 bg-white px-1 text-xs text-black peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 transition-all"
    >
      {label}
    </label>
    <span className="absolute left-3 py-4">{icon}</span>
  </div>
);

export default AppointmentDrawer;
