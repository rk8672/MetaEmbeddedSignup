const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");



//Public 
const loginOrgUser = require("./loginRoutes.js");
router.use("/", loginOrgUser);

const organizationRoutes = require("./organization_Routes.js");
router.use("/", organizationRoutes);



//Privet

const patientRoute=require("../routes/patient_Routes.js")
router.use("/",authMiddleware,patientRoute)

const doctorRoute=require("../routes/Doctor_Route.js");
router.use("/",authMiddleware,doctorRoute);


const appointmentRoute=require("../routes/Appointemnt_Route.js")
router.use("/",authMiddleware,appointmentRoute);

const organizationUser=require("./orgUser_Routes.js");
router.use('/',authMiddleware,organizationUser);

const whatsappRoutes=require('../routes/whatsappRoutes.js');
router.use("/",authMiddleware,whatsappRoutes);

module.exports = router;