const WhatsAppAccount = require("../models/WhatsAppAccount");
const axios = require("axios");

exports.sendMessage = async (req, res) => {
  const { accountId, to, message } = req.body;

  const account = await WhatsAppAccount.findById(accountId);
  if (!account) return res.status(404).json({ error: "Account not found" });

  const url = `https://graph.facebook.com/v19.0/${account.phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: message },
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    res.json({ success: true, data: response.data });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || "Send failed" });
  }
};
