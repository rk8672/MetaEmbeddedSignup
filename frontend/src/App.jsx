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
import WhatsAppDetail from "./components/DetailPage";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsAndConditions from "./Pages/TermsAndConditions";

function App() {
  const dispatch = useDispatch();

  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

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

  if (!isAuthChecked) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/EmbeddedSignup" element={<EmbeddedSignup />} />
          <Route path="/Dashboard" element={<WhatsAppDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
