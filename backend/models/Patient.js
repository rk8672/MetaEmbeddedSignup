const mongoose=require('mongoose');

const patientSchema = new mongoose.Schema({
name:{type:String},
age:{type:Number},
createdAt:{type:Date,default:Date.now}
});

module.exports=mongoose.model("Patient",patientSchema);
