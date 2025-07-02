const mongoose=require('mongoose');

const messageLogSchema=new mongoose.Schema({
whatsappAccountId:{type:mongoose.Schema.Types.ObjectId,ref:'whatsAppAccount'},
direction:{type:String,enum:['inbound','outbound']},
message:mongoose.Schema.Types.Mixed,
timeStamp:{type:Date,default:Date.now}
});

module.exports=mongoose.model('MessageLog',messageLogSchema);