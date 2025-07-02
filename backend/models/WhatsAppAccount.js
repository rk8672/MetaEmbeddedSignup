const mongoose=require('mongoose');

const whatsAppAccountSchema=new mongoose.Schema({
    organizationId:{type:mongoose.Schema.Types.ObjectId,ref:'Organization',required:true},
    name:String,
    phoneNumberId:{type:String,required:true},
    accessToken:{type:String,required:true},
    businessAccountId:{type:String},
    isActive:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now}
});

module.exports=mongoose.model('WhatsAppAccount',whatsAppAccountSchema);