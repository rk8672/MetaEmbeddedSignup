const express = require('express');
const WhatsAppAccount = require('../models/WhatsAppAccount');
const router = express.Router();

router.get('/',(req,res)=>{
    const VERIFY_TOKEN=process.env.WHATSAPP_VERIFY_TOKEN;
const {'hub.mode':mode,'hub.verify_token':token,'hub.challenge':challenge}=req.query;

if(mode==='subscribe' && token===VERIFY_TOKEN){
    console.log('Webhook verified');
    return res.status(200).send(challenge);
}
res.status(403).send('Verification failed');
});


router.post('/',async(req,res)=>{
    try{
        const body=req.body;

        if(body.object==='whatsapp_business_account'){
            const entry=body.entry?.[0];
            const change=entry?.changes?.[0];
            const value=change?.value;
            const message=value?.messages?.[0];
            const phoneNumberId=value?.metadata?.phone_number_id;
            if(!phoneNumberId || !message)return res.sendStatus(400);

            const account=await WhatsAppAccount.findOne({phoneNumberId});
            if(!account) return res.status(404).send('Account not found');

         res.sendStatus(200);
        }
    }catch(err){
            console.error('webhook error',err);
            res.sendStatus(500);
        }
});

module.exports=router;