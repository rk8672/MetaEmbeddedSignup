const Doctor = require("../models/Doctor");
const sendEmail = require('../emailService');
const createDoctor = async (req, res) => {
  try {
    const {name,email,role}=req.body
    // const newDoctor = await Doctor.create(req.body);
     await sendEmail(email, 'Welcome to MyApp', `Hello ${name}, welcome!`);
    res.status(200).json("Email Send");
  } catch (err) {
    res.status(400).json({ error: err });
  }
};






module.exports = { createDoctor };
