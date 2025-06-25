import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaMobileAlt, FaLock, FaInfoCircle } from "react-icons/fa";
import {useDispatch} from"react-redux";
import { loginSuccess } from "../../slices/authSlice";
import {useSelector} from "react-redux";
const Login = () => {

const dispatch=useDispatch();

const baseUrl=useSelector(state=>state.config.baseUrl)
  const naviagte = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validate the mobile number and password
  const validateForm = () => {
    if (!mobileNumber || !password) {
      setError("Both fields are required.");
      return false;
    }
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    if (validateForm()) {
      setIsLoading(true);

      try {
        const requestBody = {
          emailOrPhone: mobileNumber,
          password: password,
        };

         const response=await axios.post(`${baseUrl}/api/Login`,requestBody);
         
       if (response.data?.token) {
    const token = response.data.token;
    const decoded = jwtDecode(token);

    // Store token in cookie (valid for 7 days)
    Cookies.set("token", token, { expires: 7, secure: true });

    // Save to Redux
    dispatch(
      loginSuccess({
        token,
        user: {
          id: decoded.id,
          role: decoded.role,
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
        },
      })
    );
    naviagte("/Dashboard");

  }

      } catch {
         setError("Login failed. Please check credentials.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 flex justify-center items-center">
      <div className="bg-white p-12 rounded-lg shadow-2xl w-96 max-w-md border-t-8 border-indigo-600">
        {/* Logo and Brand Name */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-center leading-tight text-gray-800">
            medli<span className="text-red-600">tech</span>
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Innovative Healthcare Solutions for a Better Tomorrow
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Mobile Number Input */}
          <div className="mb-6">
            <label
              htmlFor="mobile"
              className="block text-sm font-semibold text-gray-700 flex items-center"
            >
              <FaMobileAlt className="text-indigo-600 mr-3" />
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Enter your 10-digit mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 flex items-center"
            >
              <FaLock className="text-indigo-600 mr-3" />
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-4 hover:bg-indigo-700 transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Login"}
          </button>
          <button
            onClick={() => {
              naviagte("/");
            }}
            className="w-full bg-gray-200 text-black py-3 rounded-lg mt-4 hover:bg-gray-300 transition-all"
          >
            Back
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <a href="/register" className="text-indigo-600 hover:underline">
              {" "}
              Register
            </a>
          </p>
        </div>

        {/* Info Section */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>
            <FaInfoCircle className="inline mr-1" /> Secure login with Medlitech
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
