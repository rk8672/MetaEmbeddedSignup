import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance"
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaInfoCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../slices/authSlice";
import BrandLogo from "../../assets/BrandLogo/gif_cyberlogo.gif";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setError("Both fields are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
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
    const requestBody = { email, password };

    const response = await axiosInstance.post(`/api/user/login`, requestBody);

    if (response.data?.token) {
      const token = response.data.token;
      const decoded = jwtDecode(token);

      Cookies.set("token", token, { expires: 7, secure: true });
      const { name, email,} = response.data.user;
      dispatch(
        loginSuccess({
          token,
           user: {
      id: decoded.id,
      role: decoded.role,
      name: name,
      email: email,
    },
        })
      );
      // Redirect based on role
      if (decoded.role === "admin") {
        navigate("/Dashboard");
      } else {
        navigate("/leads");
      }
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
        <div className="text-center mb-8">
          <div>
            <img src={BrandLogo} alt="" />
          </div>
       
          <p className="text-lg text-gray-600 mt-2">
            Simplifying Student Onboarding & Lead Management
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 flex items-center"
            >
              <FaEnvelope className="text-brand-teal mr-3" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {/* Back Button */}
          {/* <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-200 text-black py-3 rounded-lg mt-4 hover:bg-gray-300 transition-all"
          >
            Back
          </button> */}
        </form>

        

        {/* Info Footer */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>
            <FaInfoCircle className="inline mr-1" /> Secure login powered by{" "}
            <strong className="text-brand-blue">Cybervie</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
