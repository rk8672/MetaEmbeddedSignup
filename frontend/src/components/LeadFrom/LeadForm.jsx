// Imports...
import React, { useState, useEffect, useRef } from "react";
import { Target, PhoneCall, GraduationCap, Briefcase, User, Mail, Smartphone } from "lucide-react";

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

  useEffect(() => {
    if (window.innerWidth < 768 && mobileRef.current) {
      mobileRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:10000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      const data = await res.json();
      if (res.ok) setSubmittedData(data.data);
      else throw new Error(data.message || "Submission failed");
    } catch {
      setError("Something went wrong. Please try again later.");
    }
  };

  const handleAlreadyRegistered = async () => {
    if (!emailToCheck) return alert("Please enter an email");
    setChecking(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:10000/api/leads/check?email=${emailToCheck}`);
      const data = await res.json();
      if (res.ok) {
        setSubmittedData(data.data);
        setAlreadyRegistered(false);
      } else {
        setError(data.message || "Student not found");
      }
    } catch {
      setError("Failed to fetch student. Try again later.");
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
      Program Benefits
    </h2>
    <ul className="space-y-5 text-base">
      <li className="flex items-start gap-3">
        <Target size={45} className="mt-1 text-white" />
        <div>
          <p className="font-semibold text-white">Career Roadmap</p>
          <p className="text-sm text-white/70">
            Structured path to become a skilled Security Operations Center Analyst.
          </p>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <PhoneCall size={30} className="mt-1 text-white" />
        <div>
          <p className="font-semibold text-white">1:1 Counselling</p>
          <p className="text-sm text-white/70">
            Personalized guidance to help you align learning with your goals.
          </p>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <GraduationCap size={45} className="mt-1 text-white" />
        <div>
          <p className="font-semibold text-white">Cyber Events Access</p>
          <p className="text-sm text-white/70">
            Participate in exclusive industry events and capture-the-flag competitions.
          </p>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <Briefcase size={30} className="mt-1 text-white" />
        <div>
          <p className="font-semibold text-white">Placement Support</p>
          <p className="text-sm text-white/70">
            Get help with resumes, interviews, and job opportunities.
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
                "assigned",
                "in-progress",
                "payment-link-sent",
                "payment-done",
                "enrolled"
              ]
        ).map((step, index, stepsArray) => {
          const currentIndex = stepsArray.indexOf(submittedData.status);
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          // Custom label and description
          const stepDetails = {
            new: {
              title: "Registration Completed",
              desc: "You’ve successfully registered. Thank you!"
            },
            assigned: {
              title: "Executive Assigned",
              desc: "An executive has been assigned to your case."
            },
            "in-progress": {
              title: "Executive In Contact",
              desc: "Our executive is in contact with you. Cooperate with them to complete enrollment."
            },
            "payment-link-sent": {
              title: "Payment Link Sent",
              desc: "We’ve sent you a Razorpay payment link to your email. Please complete the payment."
            },
            "payment-done": {
              title: "Payment Received",
              desc: "We have received your payment successfully."
            },
            enrolled: {
              title: "Enrollment Completed",
              desc: "Your enrollment is now complete. Welcome!"
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

                style={{minWidth:"30px",minHeight:"30px"}}
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
  >
    Submit
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
