import Navbar from "./NavBar";
import heroSectionImg from "../../assets/doctor_image.png"; // Ensure this is the correct female doctor image
import "./Home.css";

const HeroSection = () => {
  return (
    <section className="animated-gradient min-h-screen text-slate-800">
      <div className="px-6 md:px-12 lg:px-20 pt-10">
        <Navbar />

        <div className="grid lg:grid-cols-2 items-center min-h-[100vh] py-20 gap-16">
          {/* Text Content */}
          <div className="space-y-8 animate-slide-in-left">
     <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900  fade-in">
  Empowering Hospitals <br />
  <span className="text-blue-700">Through Smart Management</span>
</h1>

            {/* <p className="text-gray-700 text-lg leading-relaxed fade-in-delay mt-4">
              <strong>हमारा प्लेटफ़ॉर्म आपके अस्पताल की कार्यक्षमता को बेहतर बनाएगा।</strong><br />
              <span className="text-blue-700">सभी विभागों का एकीकृत प्रबंधन, सही समय पर डेटा, और मरीजों का सहज अनुभव।</span>
            </p> */}

            <ul className="text-gray-600 space-y-3 text-base fade-in-delay-slow mt-6">
              <li> <strong>Secure & Compliant:</strong> HIPAA-ready with full data protection</li>
              <li> <strong>Fast Onboarding:</strong> Get started in less than 72 hours</li>
              <li> <strong>Real-Time Analytics:</strong> Track performance across departments</li>
              <li> <strong>24/7 Support:</strong> Dedicated healthcare tech specialists</li>
            </ul>

            <div className="flex flex-wrap gap-4 pt-6">
              <button className="animated-btn bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-md">
                Request Demo
              </button>
              <button className="animated-btn border border-blue-700 text-blue-700 hover:bg-blue-100 font-semibold py-3 px-6 rounded-xl">
                Learn More
              </button>
            </div>

            <div className="pt-6 text-sm text-gray-500">
              Trusted by <span className="font-semibold text-blue-800">20+ Hospitals</span> & <span className="font-semibold text-blue-800">500+ Medical Experts</span> across India.
            </div>
          </div>

          {/* Rotating Image with female doctor */}
          <div className="flex justify-center lg:justify-end animate-slide-in-right">
            <img
              src={heroSectionImg}
              alt="Hospital Management"
              className="w-full max-w-[600px] h-auto object-cover rounded-full "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
