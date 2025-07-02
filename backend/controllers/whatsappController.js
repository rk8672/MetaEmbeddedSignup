const WhatsAppAccount=require('../models/WhatsAppAccount');

exports.registerWhatsApp=async (req,res)=>{
    try{
        const {orgId}=req.params;
        const {name,phoneNumberId,accessToken,businessAccountId}=req.body;
        const account = await WhatsAppAccount.create({
            organizationId:orgId,
            name,
            phoneNumberId,
            accessToken,
            businessAccountId
        });
        res.status(201).json({success:true,account});
    }catch(err){
        res.status(500).json({success:false,message:err.message});
    }
};