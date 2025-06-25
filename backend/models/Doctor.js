const mongoose=require('mongoose');

const doctorSchema=new mongoose.Schema({

    name:{type:String},
    email:{type:String},
    role:{type:String}

});

module.exports=mongoose.model("Doctor",doctorSchema);