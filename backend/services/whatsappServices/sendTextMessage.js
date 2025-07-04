// File: services/whatsapp/senders/sendTextMessage.js
const axios = require("axios");


const sendTextMessage = async ({ phoneNumberId, accessToken, to, text }) => {
  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  };

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const { data } = await axios.post(url, payload, { headers });
    console.log(`✅ Text message sent to ${to}:`, text);
    return data;
  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error("❌ Failed to send text message:", errData);
    throw new Error(typeof errData === 'string' ? errData : JSON.stringify(errData));
  }
};

module.exports = sendTextMessage;
