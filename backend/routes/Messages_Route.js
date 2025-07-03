const express=require('express');
const router=express.Router();
const {getMessageLogs}=require('../controllers/messageLogController');
const requireOrgContext=(req,res,next)=>{
    if(!req.user?.organizationId){
        return res.status(403).json({error:'Organization context missing'});
    }
    next();
};
router.get('/messageLog',requireOrgContext,getMessageLogs);
module.exports=router;