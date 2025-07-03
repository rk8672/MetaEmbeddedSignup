const mongoose=require('mongoose');

const messageLogSchema=new mongoose.Schema({
organizationId:{type:mongoose.Schema.Types.ObjectId,ref:'Organization',required:true},
whatsappAccountId:{type:mongoose.Schema.Types.ObjectId,ref:'whatsAppAccount'},
direction:{type:String,enum:['inbound','outbound']},
message:mongoose.Schema.Types.Mixed,
timeStamp:{type:Date,default:Date.now}
});

module.exports=mongoose.model('MessageLog',messageLogSchema);