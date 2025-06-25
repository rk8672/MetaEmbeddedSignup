const express=require('express');
const router=express.Router();
const {createPatient,getAllPatient,getPatient}=require("../controllers/Patient_Controller");

router.post('/createPatient',createPatient);
router.get('/AllPatients',getAllPatient);
router.get('/Patient/:id',getPatient);
module.exports=router;