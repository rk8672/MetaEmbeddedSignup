const Appointment = require("../models/Appointment_Model");
const OrgUser=require('../models/OrgUser_Model');

const getDoctors=async(req, res)=>{
  try{
    const orgId=req.user.organizationId;
const doctor=await OrgUser.find({
  organizationId:orgId,
  role:'doctor'

}).select("name email phone").lean();
res.status(200).json(doctor)
  }catch(err){
res.status(500).json({error:"Failed to fetch doctors."})
  }
}


const createAppointment = async (req, res) => {
  try {
    const { doctor, patient, date } = req.body;
    const newAppointment = await Appointment.create({ doctor, patient, date });
    res.status(200).json(newAppointment);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};


const getAppointment=async(req,res)=>{
    try{

            const appointment=await Appointment.find()
            .populate('doctor','name role')
            .populate('patient','name age');

            res.status(200).json(appointment);

    }
    catch(err){

     res.status(400).json({error:err});

    }
}


module.exports = { createAppointment ,getAppointment,getDoctors};
