import EmbeddedSignupButton from "./EmbeddedSignupButton";

const EmbeddedSignup = () => {
  return (
    <div className="flex items-center justify-center w-100  ">
      <div className="bg-white shadow-lg rounded-2xl p-10 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Meta Embedded Signup
        </h1>
        <p className="text-gray-500 text-center max-w-md">
          Connect your WhatsApp Business account quickly and securely
          using Meta’s Embedded Signup.
        </p>
        
        {/* Signup Button */}
        <EmbeddedSignupButton />
      </div>
    </div>
  );
};

export default EmbeddedSignup;
