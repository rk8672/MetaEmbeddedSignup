import { callMetaApi } from "../utils/metaApi.js";

export const getWhatsappDetails = async (req, res) => {
  try {
    const { whatsappId, accessToken } = req.body;

    if (!whatsappId || !accessToken) {
      return res.status(400).json({ message: "whatsappId and accessToken are required" });
    }

    // Call Meta API 
    const data = await callMetaApi({
      endpoint: `/${whatsappId}/phone_numbers`,
      accessToken,
      method: "GET",
    });

   if (!data?.data || data.data.length === 0) {
      return res.status(404).json({ message: "No phone numbers found" });
    }

  
    const { paging, ...rest } = data;
    res.json(rest);

  } catch (error) {
    console.error("Error fetching WhatsApp details:", error.message);
    res.status(500).json({ message: error.message });
  }
};
