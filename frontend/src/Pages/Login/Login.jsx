import React, { useState } from "react"; 
import axiosInstance from "../../utils/axiosInstance";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaLock, FaPhone, FaInfoCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!mobile || !password) {
      setError("Both fields are required.");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/; 
    if (!phoneRegex.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const requestBody = { mobile, password };
      const response = await axiosInstance.post(`/api/users/login`, requestBody);
      if (response.data?.token) {
        const token = response.data.token;
        const decoded = jwtDecode(token);

        Cookies.set("token", token, { expires: 7, secure: true });
        const { name, mobile } = response.data.user;

        dispatch(
          loginSuccess({
            token,
            user: {
              id: decoded.id,
              role: decoded.role,
              name: name,
              mobile: mobile,
            },
          })
        );

        // Redirect based on role
        navigate("/Dashboard");
      }
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#006699] via-[#00B3B3] to-[#33CCCC] flex justify-center items-center">
      <div className="bg-white p-12 rounded-lg shadow-2xl w-96 max-w-md border-t-8 border-[#006699]">
        {/* Logo and Brand Name */}
      <div className="text-center mb-8 space-y-2">
  {/* Company Name */}
  <p className="text-5xl font-extrabold text-gray-900 tracking-wide">
    ab media 
  </p>

  {/* Assignment Title */}
  <p className="text-sm font-semibold text-[#006699] uppercase tracking-wide">
   Assignment - Meta Embedded Signup
  </p>

  {/* Subtext */}
  <p className="text-4xl text-brand-blue">
    Login
  </p>
</div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Mobile Input */}
          <div className="mb-6">
            <label
              htmlFor="mobile"
              className="block text-sm font-semibold text-gray-700 flex items-center"
            >
              <FaPhone className="text-brand-teal mr-3" />
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 flex items-center"
            >
              <FaLock className="text-brand-teal mr-3" />
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-brand-blue text-white py-3 rounded-lg mt-4 hover:bg-brand-teal transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* Info Footer */}
        <div className="mt-6 text-center text-gray-600 text-sm">
    
 <p className="text-sm text-gray-600 mt-2">
    <span className="font-semibold text-gray-900">Testing Login Credentials:</span><br />
    Mobile Number: <span className="font-mono">7524807719</span><br />
    Password: <span className="font-mono">Rk@123</span>
  </p>

      <p className="text-sm text-gray-600 mt-4">
  <FaInfoCircle className="inline mr-1" /> Assignment Made by {" "}
  <span className="font-semibold text-gray-900">Radha Krishna Singh</span>
</p>
         
        </div>
      </div>
    </div>
  );
};

export default Login;
