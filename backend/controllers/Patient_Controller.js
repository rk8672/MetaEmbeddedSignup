const Patient = require('../models/Patient');

const createPatient = async (req, res) => {
  try {
    const newPatient = await Patient.create(req.body);
    res.status(201).json(newPatient);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Duplicate entry (maybe email exists)' });
    }
    res.status(400).json({ error: err.message });
  }
};


const getAllPatient=async (req,res)=>{
  try{
    const allPatients=await Patient.find();
    res.status(200).json(allPatients);

  }
  catch(err){
    res.status(400).json({error:err.message});

  }
};

const getPatient=async (req,res)=>{
  try{
    
const singlePatient=await Patient.findById(req.params.id);
res.status(200).json(singlePatient);
  }
  catch(err){
    res.status(400).json({error:err.message});
  }
}



module.exports = { createPatient ,getAllPatient,getPatient};
