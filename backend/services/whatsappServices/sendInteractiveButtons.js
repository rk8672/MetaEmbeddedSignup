const axios = require("axios");

const sendButtonMessage = async ({ phoneNumberId, accessToken, to }) => {
  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "Welcome to Calc360 Health! 👩‍⚕️\nHow can we assist you today?"
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "book_appointment",
              title: "📅 Book Appointment"
            }
          },
          {
            type: "reply",
            reply: {
              id: "view_doctors",
              title: "👨‍⚕️ View Doctors"
            }
          },
          {
            type: "reply",
            reply: {
              id: "talk_to_agent",
              title: "💬 Talk to Agent"
            }
          }
        ]
      }
    }
  };

  try {
    const { data } = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    console.log(`✅ Button message sent to ${to}`);
    return data;
  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error("❌ Failed to send button message:", errData);
    throw new Error(typeof errData === 'string' ? errData : JSON.stringify(errData));
  }
};

module.exports = sendButtonMessage;
