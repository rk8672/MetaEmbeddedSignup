import {useEffect} from 'react';
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./slices/authSlice";
import "./App.css";
import Home from "./Pages/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Dashboard from "./components/dashboard/dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Patients from "./components/patients/patients";
import Appointment from "./components/appointment/appointment_page";
import UserManagement from "./components/admin/UserManagement";
function App() {
const dispatch=useDispatch();

useEffect(()=>{
const token=Cookies.get("token");
if(token){
  try{
const decoded=jwtDecode(token);
dispatch(
  loginSuccess({
    token,
    user:{
      id:decoded.id,
      role:decoded.role,
    }
  })

);
  }
  catch(err){
    console.log(err);
    Cookies.remove("token");
  }
}
},[dispatch])

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        {/* Protected Layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Patients" element={<Patients />} />

          <Route path="/Appointments" element={<Appointment />} />
          <Route path="/Consultations" />
          <Route path="/Reports" />
          <Route path="/Settings" />
          <Route path="/User" element={<UserManagement />} />
        </Route>

        {/* Redirect unknown routes */}
      </Routes>
    </Router>
  );
}

export default App;
