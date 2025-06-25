const express=require('express');
const route=express.Router();
const {createAppointment,getAppointment,getDoctors }=require("../controllers/Appointment_Controller");
route.post("/BookAppointment",createAppointment);
route.get("/GetAppointment",getAppointment);
route.get('/doctors',getDoctors);
module.exports=route;
