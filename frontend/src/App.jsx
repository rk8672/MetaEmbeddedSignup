import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './slices/authSlice';

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Dashboard from './components/dashboard/dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import Patients from './components/patients/patients';
import Appointment from './components/appointment/appointment_page';
import UserManagement from './components/admin/UserManagement';
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy';
import TermsAndConditions from './Pages/TermsAndConditions/TermsAndConditions';

// New Layout for Public pages
import PublicLayout from './layouts/LandingPageLayout';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        dispatch(
          loginSuccess({
            token,
            user: {
              id: decoded.id,
              role: decoded.role,
            },
          })
        );
      } catch (err) {
        console.log(err);
        Cookies.remove('token');
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
        </Route>

        {/* Login is a standalone page (no navbar/footer) */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (With Sidebar Layout) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointment />} />
          <Route path="/consultations" />
          <Route path="/reports" />
          <Route path="/settings" />
          <Route path="/user" element={<UserManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
