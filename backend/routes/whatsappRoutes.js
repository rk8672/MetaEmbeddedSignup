const express = require('express');
const router = express.Router();
const whatsappController=require('../controllers/whatsappController');

const whatsappServices=require('../services/whatsappService')

router.post('/org/:orgId/whatsapp/register',whatsappController.registerWhatsApp);

router.post('/message/send',whatsappServices.sendMessage);
module.exports=router;