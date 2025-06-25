const mongoose=require('mongoose');
const appointmentSchema=new mongoose.Schema({
doctor:{type:mongoose.Schema.Types.ObjectId,ref:'Doctor'},
patient:{type:mongoose.Schema.Types.ObjectId,ref:'Patient'},
date:{type:Date,default:Date.now}
});

module.exports=mongoose.model('Appointment',appointmentSchema);