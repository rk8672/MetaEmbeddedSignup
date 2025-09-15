
import { callMetaApi } from "../utils/metaApi.js";

//  Subscribe WABA to webhook
export const subscribeWebhook = async (req, res) => {
  const { wabaId, accessToken } = req.body;

  try {
    const endpoint = `/${wabaId}/subscribed_apps`;

    const response = await callMetaApi({
      endpoint,
      accessToken,
      method: "POST",
      data: {
        subscribed_fields: [
          "messages",
          "message_template_status_update",
          "phone_number_name_update",
        ],
      },
    });

    res.json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.error(" Webhook subscribe error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getWebhookStatus = async (req, res) => {
  const { wabaId, accessToken } = req.body;

  try {
    const endpoint = `/${wabaId}/subscribed_apps`;

    const response = await callMetaApi({
      endpoint,
      accessToken,
      method: "GET",
    });

    res.json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.error(" Webhook status error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const unsubscribeWebhook = async (req, res) => {
  const { wabaId, accessToken } = req.body;

  try {
    const endpoint = `/${wabaId}/subscribed_apps`;

    const response = await callMetaApi({
      endpoint,
      accessToken,
      method: "DELETE",
    });

    res.json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.error(" Webhook unsubscribe error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
