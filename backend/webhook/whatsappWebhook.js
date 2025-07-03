const express = require('express');
const WhatsAppAccount = require('../models/WhatsAppAccount');
const MessageLog = require('../models/MessageLog');
const router = express.Router();

// ✅ Webhook verification route (GET)
router.get('/', (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified');
    return res.status(200).send(challenge);
  }

  console.warn('❌ Webhook verification failed');
  res.status(403).send('Verification failed');
});

// ✅ Webhook callback handler (POST)
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const message = value?.messages?.[0];
      const phoneNumberId = value?.metadata?.phone_number_id;

      if (!phoneNumberId || !message) {
        console.warn('⚠️ Missing phoneNumberId or message');
        return res.sendStatus(400);
      }

      const account = await WhatsAppAccount.findOne({ phoneNumberId });
      if (!account) {
        console.warn(`❌ WhatsApp account not found for ID: ${phoneNumberId}`);
        return res.status(404).send('Account not found');
      }

      // ✅ Save the message to MongoDB
      await MessageLog.create({
        whatsappAccountId: account._id,
        direction: 'inbound',
        message: message,
        timeStamp: new Date(Number(message.timestamp) * 1000) || new Date()
      });

      console.log(`📥 Message logged from ${message.from}: ${message.text?.body}`);
      return res.sendStatus(200);
    }

    res.sendStatus(400);
  } catch (err) {
    console.error('❌ Webhook error:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
