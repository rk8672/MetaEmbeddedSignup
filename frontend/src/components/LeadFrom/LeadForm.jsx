// Imports...
import React, { useState, useEffect, useRef } from "react";
import { MonitorPlay , Briefcase, User, Mail, Smartphone, ActivitySquare, Repeat } from "lucide-react";
import axiosInstance from"../../utils/axiosInstance";
const LeadForm = () => {
  const [lead, setLead] = useState({
    fullName: "",
    email: "",
    mobile: "",
    courseInterested: "CCSA - SOC Real-Time Training Program",
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [emailToCheck, setEmailToCheck] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const mobileRef = useRef(null);


  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768 && mobileRef.current) {
      mobileRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

const handleChange = (e) => {
  const { name, value } = e.target;

  // Only digits for phone number
  if (name === "mobile") {
    if (/^\d*$/.test(value)) {
      setLead((prev) => ({ ...prev, [name]: value }));
    }
  } else {
    setLead((prev) => ({ ...prev, [name]: value }));
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const fullName = lead.fullName.trim();
  const email = lead.email.trim();
  const mobile = lead.mobile.trim();

  if (!fullName || fullName.length < 2) {
    return setError("Please enter a valid full name.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return setError("Please enter a valid email address.");
  }

  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile)) {
    return setError("Phone number must be exactly 10 digits.");
  }
  setShowLoader(true);
  try {
    const res = await axiosInstance.post("/api/leads", { ...lead, fullName, email, mobile });
    setSubmittedData(res.data.data);
  } catch (error) {
    setError(error.response?.data?.message || "Something went wrong. Please try again later.");
  }finally{
      setShowLoader(false);
  }
};

const handleAlreadyRegistered = async () => {
  if (!emailToCheck) return alert("Please enter an email");
  setChecking(true);
  setError("");

  try {
    const res = await axiosInstance.get(`/api/leads/check?email=${emailToCheck}`);
    setSubmittedData(res.data.data);
    setAlreadyRegistered(false);
  } catch (error) {
    setError(error.response?.data?.message || "Student not found");
  } finally {
    setChecking(false);
  
  }
};
  return (
    <div className="max-w-6xl mx-auto my-10 flex flex-col md:flex-row bg-white shadow-xl rounded-2xl overflow-hidden">
    
     <div className="md:w-1/2 flex flex-col text-white ">
  {/* Header */}
  <div className="px-10 py-10 bg-opacity-95 bg-brand-blue">
    <div className="text-center">
      <h1 className="text-5xl font-extrabold tracking-wide">CCSA</h1>
      <p className=" text-xl mt-2 font-semibold p-0 m-0">
        Cybervie Certified SOC Analyst
      </p>
     
    </div>
  </div>

  {/* Divider */}
  <div className="h-px bg-white my-3 mx-10" />

  {/* Program Benefits */}
<div className="px-10 py-5 space-y-6 bg-brand-blue">
  <h2 className="text-2xl font-semibold text-white border-b border-white/20 pb-2">
    What You’ll Get in Our Live Training
  </h2>
  <ul className="space-y-5 text-base">
    <li className="flex items-start gap-3">
      <MonitorPlay size={50} className="mt-1 text-white" />
      <div>
        <p className="font-semibold text-white">Live Interactive Training</p>
        <p className="text-sm text-white/70">
          Real-time sessions with expert instructors covering hands-on cybersecurity scenarios.
        </p>
      </div>
    </li>
    <li className="flex items-start gap-3">
      <Briefcase size={50} className="mt-1 text-white" />
      <div>
        <p className="font-semibold text-white">Assured Placement Support</p>
        <p className="text-sm text-white/70">
          Dedicated job assistance with resume building, interview coaching & direct company referrals.
        </p>
      </div>
    </li>
    <li className="flex items-start gap-3">
      <ActivitySquare size={50} className="mt-1 text-white" />
      <div>
        <p className="font-semibold text-white">Real-Time Scenario Practice</p>
        <p className="text-sm text-white/70">
          Work on live cyber incidents, threat simulations, and actual industry case studies.
        </p>
      </div>
    </li>
    <li className="flex items-start gap-3">
      <Repeat size={50} className="mt-1 text-white" />
      <div>
        <p className="font-semibold text-white">Any Domain to Cybersecurity</p>
        <p className="text-sm text-white/70">
          Transition from any background – IT, non-IT, or fresh graduate – into cybersecurity careers.
        </p>
      </div>
    </li>
  </ul>
</div>


</div>

      {/* Form Area */}
      <div ref={mobileRef} className="md:w-1/2 p-6 md:p-8">
      
        {/* Already Registered Section */}
        {alreadyRegistered ? (
          <div className="space-y-3">
       <form
  onSubmit={(e) => {
    e.preventDefault();
    handleAlreadyRegistered();
  }}
  className="space-y-4"
>
  {/* Email Input with Label and Icon */}
  <div>
    <label
      htmlFor="check-email"
      className="block text-sm font-semibold text-gray-700 mb-1 flex items-center"
    >
      <Mail className="mr-2 h-4 w-4 text-brand-teal" />
      Enter Registered Email
    </label>
    <input
      type="email"
      id="check-email"
      placeholder="Enter your email"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all"
      value={emailToCheck}
      onChange={(e) => setEmailToCheck(e.target.value)}
      required
    />
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full bg-brand-blue hover:bg-brand-teal text-white py-2 rounded-md font-semibold transition-all"
  >
    {checking ? "Checking..." : "Check My Status"}
  </button>

  {/* Go Back Button */}
  <button
    type="button"
    onClick={() => setAlreadyRegistered(false)}
    className="w-full text-brand-blue hover:text-brand-teal text-sm underline mt-2"
  >
    Go back to register
  </button>

  {/* Error Message */}
  {error && <p className="text-red-500 text-sm">{error}</p>}
</form>
          </div>
        ) : submittedData ? (
<>
  <div className="  max-w-xl mx-auto bg-white rounded-2xl  ">
    <h6 className="text-brand-teal text-1xl font-bold mb-4 text-center">
      Thank you, {submittedData.fullName}!
    </h6>
  
    <div className="relative">
    <div className="space-y-4 ">
  {(
    submittedData.status === "not-interested"
      ? ["not-interested"]
      : [
          "new",
          "mentor-assigned",
          "mentor-in-contact",
          "payment-link-sent",
          "payment-done",
          "enrolled"
        ]
  ).map((step, index, stepsArray) => {
    const currentIndex = stepsArray.indexOf(submittedData.status);
    const isCompleted = index < currentIndex;
    const isCurrent = index === currentIndex;

    // Client-facing step details mapped from backend status
    const stepDetails = {
      new: {
        title: "Registration Complete",
        desc: "Successfully registered. Welcome aboard!"
      },
      "mentor-assigned": {
        title: "Mentor Assigned",
        desc: "Your dedicated mentor is ready to guide you."
      },
      "mentor-in-contact": {
        title: "Mentor Contact",
        desc: "Your mentor will reach out soon. Stay responsive!"
      },
      "payment-link-sent": {
        title: "Confirmation Link Sent",
        desc: "Razorpay link sent to your email. Complete enrollment to secure your spot."
      },
      "payment-done": {
        title: "Enrollment Confirmed",
        desc: "Your seat is confirmed. We're excited to have you!"
      },
      enrolled: {
        title: "Ready to Start",
        desc: "You're officially enrolled. Let's begin your journey!"
      },
      "not-interested": {
        title: "Not Interested",
        desc: "You’ve marked yourself as not interested. We’re here if you change your mind."
      }
    };

    const { title, desc } = stepDetails[step];

    return (
      <div key={step} className="relative z-10 flex items-start gap-2">
        <div
          className={`w-6 h-6 flex items-center justify-center rounded-full border-2 font-bold text-xs ${
            isCompleted
              ? "bg-green-500 border-green-500 text-white"
              : isCurrent
              ? "bg-yellow-400 border-yellow-400 text-white"
              : "bg-gray-200 border-gray-300 text-gray-600"
          }`}
          style={{ minWidth: "30px", minHeight: "30px" }}
        >
          {isCompleted ? "✔" : index + 1}
        </div>

        <div>
          <h5
            className={`text-base font-semibold ${
              isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {title}
          </h5>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
      </div>
    );
  })}
</div>

    </div>

    <div className="text-center mt-5 text-sm text-gray-600">
      {/* <p className="font-medium">
        <span className="text-gray-800">Status:</span>{" "}
        {submittedData.status.replace(/-/g, " ").toUpperCase()}
      </p> */}
      <p>
        <span className="text-gray-800">Registration Date :</span>{" "}
        {new Date(submittedData.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
</>



        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

  <h3 className="text-xl font-semibold mb-2 text-[#006699]">Join the Cybersecurity Journey</h3>
        <p className="text-sm text-gray-600 mb-4">Fill the form to get a brochure, demo, or a call from our team.</p>
  {/* Full Name */}
  <div>
    <label
      htmlFor="fullName"
      className="block text-sm font-semibold text-gray-700 flex items-center"
    >
      <User className="text-brand-teal mr-2" />
      Full Name
    </label>
    <input
      type="text"
      id="fullName"
      name="fullName"
      placeholder="Enter your full name"
      value={lead.fullName}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all"
    />
  </div>

  {/* Email */}
  <div>
    <label
      htmlFor="email"
      className="block text-sm font-semibold text-gray-700 flex items-center"
    >
      <Mail className="text-brand-teal mr-2" />
      Email Address
    </label>
    <input
      type="email"
      id="email"
      name="email"
      placeholder="Enter your email"
      value={lead.email}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all"
    />
  </div>

  {/* Mobile */}
  <div>
    <label
      htmlFor="mobile"
      className="block text-sm font-semibold text-gray-700 flex items-center"
    >
      <Smartphone className="text-brand-teal mr-2" />
      Phone Number
    </label>
  <input
  type="tel"
  id="mobile"
  name="mobile"
  placeholder="Enter your phone number"
  value={lead.mobile}
  onChange={handleChange}
  maxLength={10}
  required
  className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all"
/>
  </div>

  {/* Error Message */}
  {error && <p className="text-red-500 text-sm">{error}</p>}

  {/* Submit */}
  <button
    type="submit"
    className="w-full bg-brand-blue hover:bg-brand-teal text-white py-2 rounded-md font-semibold"
     disabled={showLoader}
  >
      {showLoader ? (
    <>
    
      Please wait...
    </>
  ) : (
    "Submit"
  )}
  </button>

  {/* Already Registered */}
  <button
    type="button"
    onClick={() => setAlreadyRegistered(true)}
    className="w-full text-brand-blue hover:text-brand-teal text-sm underline mt-2"
  >
    Already Registered?
  </button>
</form>

        )}
      </div>
    </div>
  );
};

export default LeadForm;
