const express = require('express');
const router = express.Router();

const WhatsAppAccount = require('../models/WhatsAppAccount');
const MessageLog = require('../models/MessageLog');
const sendTextMessage = require('../services/whatsappServices/sendTextMessage');
const sendButtonMessage = require('../services/whatsappServices/sendInteractiveButtons');

router.use(express.json());

// ✅ Webhook verification for Meta
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

// ✅ Handle incoming messages & status updates
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    console.log('📡 Incoming webhook payload:', JSON.stringify(body, null, 2));

    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;
          const phoneNumberId = value?.metadata?.phone_number_id;

          if (!phoneNumberId) {
            console.warn('⚠️ Missing phoneNumberId');
            continue;
          }

          // ✅ Case: Incoming message from user
          if (value?.messages?.length > 0) {
            const message = value.messages[0];

            // Find the WhatsApp account
            const account = await WhatsAppAccount.findOne({ phoneNumberId });
            if (!account) {
              console.warn(`❌ No WhatsAppAccount found for ${phoneNumberId}`);
              continue;
            }

            // Save message to DB
            await MessageLog.create({
              organizationId: account.organizationId,
              whatsappAccountId: account._id,
              direction: 'inbound',
              message: message,
              timeStamp: new Date(Number(message.timestamp) * 1000) || new Date()
            });

            // Log and respond
            const userText = message.text?.body?.toLowerCase() || '';
            console.log(`📥 Message received from ${message.from}: ${message.text?.body}`);

            // Text reply
            await sendTextMessage({
              phoneNumberId: account.phoneNumberId,
              accessToken: account.accessToken,
              to: message.from,
              text: "Hi, this is an auto-reply from Calc360 👋",
            });

            // Button message
            await sendButtonMessage({
              phoneNumberId: account.phoneNumberId,
              accessToken: account.accessToken,
              to: message.from,
            });

            continue;
          }

          // ✅ Case: Status update (e.g., message read)
          if (value?.statuses?.length > 0) {
            const status = value.statuses[0];
            console.log(`ℹ️ Status update for message ID ${status.id}: ${status.status}`);
            // Optional: Save to DB if needed
            continue;
          }

          // Unknown value
          console.warn('⚠️ Unknown value structure:', JSON.stringify(value, null, 2));
        }
      }

      return res.sendStatus(200);
    }

    // ✅ Test or dev payload from Postman
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
