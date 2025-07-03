const MessageLog=require('../models/MessageLog');

// GET /api/message
exports.getMessageLogs=async(req,res)=>{
    try{
        const{
            direction,
            fromDate,
            toDate,
            page=1,
            limit=20
        }=req.query;

        const organizationId=req.user?.organizationId;
        if(!organizationId){
            return res.status(403).json({success:false,error:'Unauthorized : No organization context'});
        }

        const filter={organizationId};
        if(direction) filter.direction=direction;
        if(fromDate||toDate){
            filter.timeStemp={};
            if(fromDate) filter.timeStamp.$gte=new Date(fromDate);
            if(toDate) filter.timeStemp.$lte=new Date(toDate);
        }

        const message=await MessageLog.find(filter)
        .sort({timeStemp:-1})
        .skip((page-1)*limit)
        .limit(Number(limit))
        .populate('whatsappAccountId','phoneNumberId');

        const total=await MessageLog.countDocuments(filter);

        res.json({
            success:true,
            page:Number(page),
            limit:Number(limit),
            total,
            message
        });



    }catch(err){
        res.status(500).json({success:false,error:'Internal Server Error'});
    }
}