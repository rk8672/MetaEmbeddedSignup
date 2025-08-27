import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./slices/authSlice";

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

import Login from "./Pages/Login/Login";
import LeadsTable from "./components/LeadTable/LeadsTable";
import UserManagement from "./components/UserManagement/UserManagement";
import Dashboard from "./components/dashboard/dashboard";

import Building from "./components/Building/Building";
import Guest from "./components/Guest/Guest";
import Payment from "./components/Payment/Payment";


function App() {
  const dispatch = useDispatch();

  // Load status to wait for token hydration
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Optional: You can add expiration check here
        dispatch(
          loginSuccess({
            token,
            user: {
              id: decoded.id,
              role: decoded.role,
              name: decoded.name,
              email: decoded.email,
            },
          })
        );
      } catch (err) {
        console.error("Invalid token", err);
        Cookies.remove("token");
      }
    }
    setIsAuthChecked(true);
  }, [dispatch]);

  // Wait until auth is checked before rendering routes
  if (!isAuthChecked) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Guest" element={<Guest />} />
          <Route path="/Building" element={<Building />} />
          <Route path="/Payments" element={<Payment />} />


          <Route path="/settings" element={<UserManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
