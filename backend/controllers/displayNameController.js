import { callMetaApi } from "../utils/metaApi.js";

export const getDisplayNameDetails = async (req, res) => {
  try {
    const { phoneNumberId, accessToken } = req.body;

    if (!phoneNumberId || !accessToken) {
      return res.status(400).json({ error: "phoneNumberId and accessToken are required" });
    }

    const data = await callMetaApi({
      endpoint: `/${phoneNumberId}`,
      accessToken,
      method: "GET",
      params: {
        fields: "display_phone_number,verified_name,name_status",
      },
    });

    return res.json({ data: [data] }); 
  } catch (error) {
    console.error("DisplayName API Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message || "Failed to fetch display name" });
  }
};
