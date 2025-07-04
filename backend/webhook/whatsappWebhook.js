const express = require('express');
const router = express.Router();

const WhatsAppAccount = require('../models/WhatsAppAccount');
const MessageLog = require('../models/MessageLog');

// Parse incoming JSON (in case not set globally)
router.use(express.json());

// ✅ GET route for webhook verification (Meta setup only)
router.get('/', (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified by Meta');
    return res.status(200).send(challenge);
  }

  console.warn('❌ Webhook verification failed');
  return res.sendStatus(403);
});

// ✅ POST route for incoming messages from Meta
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    console.log('📡 Incoming webhook payload:', JSON.stringify(body, null, 2));

    // ✅ Real WhatsApp webhook from Meta
    if (body.object === 'whatsapp_business_account') {
      const entries = body.entry || [];

      for (const entry of entries) {
        for (const change of entry.changes || []) {
          const value = change.value;
          const message = value?.messages?.[0];
          const phoneNumberId = value?.metadata?.phone_number_id;

          if (!message || !phoneNumberId) {
            console.warn('⚠️ Missing message or phoneNumberId');
            continue;
          }

          // ✅ Lookup WABA in your DB
          const account = await WhatsAppAccount.findOne({ phoneNumberId });
          if (!account) {
            console.warn(`❌ No WhatsAppAccount found for ${phoneNumberId}`);
            continue;
          }

          // ✅ Store in MessageLog
          await MessageLog.create({
            organizationId: account.organizationId,
            whatsappAccountId: account._id,
            direction: 'inbound',
            message: message,
            timeStamp: new Date(Number(message.timestamp) * 1000) || new Date()
          });

          console.log(`📥 Message received from ${message.from}: ${message.text?.body}`);
        }
      }

      return res.sendStatus(200);
    }

    // ✅ Support Postman/dev panel test messages (simple flat structure)
    if (req.body?.field === 'messages') {
      console.log('🧪 Test message from Postman or dev panel:', JSON.stringify(req.body, null, 2));
      return res.sendStatus(200);
    }

    console.warn('⚠️ Unknown POST payload structure');
    return res.sendStatus(400);
  } catch (err) {
    console.error('❌ Webhook error:', err);
    return res.sendStatus(500);
  }
});

module.exports = router;
