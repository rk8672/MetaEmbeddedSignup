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
import EmbeddedSignup from "./components/EmbeddedSignup";
import WhatsAppDashboard from "./components/WhatsAppDashboard";



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
          <Route path="/EmbeddedSignup" element={<EmbeddedSignup />} />
          <Route path="/WhatsAppDashboard" element={<WhatsAppDashboard/>} />

       
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
