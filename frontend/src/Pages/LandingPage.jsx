import React from "react";
import LeadForm from "../components/LeadFrom/LeadForm";
import BrandLogo from "../assets/BrandLogo/Logo_only.gif";
import BrandLogoFull from "../assets/BrandLogo/gif_cyberlogo.gif";

const LandingPage = () => {
  return (
    <div
      className="flex flex-col min-h-screen text-gray-800 "
      // style={{
      //   background: "linear-gradient(to bottom right, #E6F7F7, #ffffff, #CCF2F2)",
      // }}
    >
      {/* Header */}
     <header className="text-brand-blue shadow-md " >
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-center gap-6">
    <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
 <div
  className="bg-white shadow flex items-center justify-center overflow-hidden shrink-0"
  style={{
    width: '200px',
    // height: '80px',
    borderRadius: '10px',
    minWidth: '150px',
    // minHeight: '80px',
  }}
>
  <img
    src={BrandLogoFull}
    alt="Cybervie Logo"
    className="w-full h-full object-fit"
  />
</div>
      <div className="text-center md:text-left">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug">
           CCSA – SOC Analyst Program
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#CCF2F2]">
          Learn from Experts.
        </p>
      </div>
    </div>
  </div>
</header>

      {/* Main Content */}
     <main className="flex-grow flex items-center justify-center px-4 sm:px-6 md:px-12 py-12 bg-gray-200">
  <div className="w-full max-w-2xl sm:max-w-3xl">
    <LeadForm />
  </div>
</main>

      {/* Footer */}
      <footer className="w-full text-gray-900 text-center text-sm py-2 shadow-md" >
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-black">Cybervie</span>. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
