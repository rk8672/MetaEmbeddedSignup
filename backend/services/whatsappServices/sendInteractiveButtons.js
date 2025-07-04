const axios = require("axios");

module.exports = async ({ phoneNumberId, accessToken, to, headerText, bodyText, buttons }) => {
  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      header: { type: "text", text: headerText },
      action: {
        buttons: buttons.map((btn, index) => ({
          type: "reply",
          reply: {
            id: btn.id,
            title: btn.title,
          },
        })),
      },
    },
  };

  try {
    const { data } = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Interactive button message sent to:", to);
    return data;
  } catch (error) {
    console.error("❌ Failed to send interactive button message:", error.response?.data || error.message);
    throw error;
  }
};
