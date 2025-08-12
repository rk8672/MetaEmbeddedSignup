import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './slices/authSlice';

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

import LandingPage from './Pages/LandingPage';
import Login from './Pages/Login/Login';
import LeadsTable from './components/LeadTable/LeadsTable';
import UserManagement from './components/UserManagement/UserManagement';
import Dashboard from './components/dashboard/dashboard';
import CertificateGenerator from './components/certificate/CertificateGenerator';
import RazorpayPayment from './components/comingsoon/RazorpayPayment';
import Reminder from './components/comingsoon/Reminder';
import Certificate from './components/comingsoon/Certificate';

function App() {
  const dispatch = useDispatch();

  // Load status to wait for token hydration
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
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
              email: decoded.email 
            },
          })
        );
      } catch (err) {
        console.error('Invalid token', err);
        Cookies.remove('token');
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<LeadsTable />} />
            {/* <Route path="/certificate" element={<CertificateGenerator />} /> */}
            <Route path="/certificate" element={<Certificate />} />

              <Route path="/razorpay-payment" element={<RazorpayPayment />} />
  <Route path="/reminder" element={<Reminder />} />
          <Route path="/settings" element={<UserManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
