const express = require('express');
const router = express.Router();

const WhatsAppAccount = require('../models/WhatsAppAccount');
const MessageLog = require('../models/MessageLog');

router.use(express.json());

// ✅ Verification route (only for GET requests from Meta setup)
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
  return res.sendStatus(403);
});

// ✅ Webhook callback route (POST from Meta or Postman)
router.post('/', (req, res) => {
  console.log('📥 Message received:', req.body);
  res.sendStatus(200);
});
// router.post('/', async (req, res) => {
//   try {
//     const body = req.body;
//     console.log('📡 Webhook POST received:');
//     console.dir(body, { depth: null });

//     if (body.object === 'whatsapp_business_account') {
//       const entries = body.entry || [];

//       for (const entry of entries) {
//         for (const change of entry.changes || []) {
//           const value = change.value;
//           const message = value?.messages?.[0];
//           const phoneNumberId = value?.metadata?.phone_number_id;

//           if (!message || !phoneNumberId) {
//             console.warn('⚠️ Missing message or phoneNumberId');
//             continue;
//           }

//           const account = await WhatsAppAccount.findOne({ phoneNumberId });
//           if (!account) {
//             console.warn(`❌ No account found for ${phoneNumberId}`);
//             continue;
//           }

//           await MessageLog.create({
//             organizationId: account.organizationId,
//             whatsappAccountId: account._id,
//             direction: 'inbound',
//             message,
//             timeStamp: new Date(Number(message.timestamp) * 1000) || new Date()
//           });

//           console.log(`📥 Message from ${message.from}: ${message.text?.body}`);
//         }
//       }

//       return res.sendStatus(200);
//     }

//     // Allow non-Meta test POSTs (e.g. Postman tests)
//     console.warn('⚠️ POST payload not recognized, but accepted');
//     return res.sendStatus(200);
//   } catch (err) {
//     console.error('❌ Webhook POST error:', err);
//     return res.sendStatus(500);
//   }
// });

module.exports = router;
