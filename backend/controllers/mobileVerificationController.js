import { callMetaApi } from "../utils/metaApi.js";
import FormData from "form-data";


export const requestMobileOTP = async (req, res) => {
  try {
    const { phoneNumberId, accessToken } = req.body;

    if (!phoneNumberId || !accessToken) {
      return res
        .status(400)
        .json({ error: "phoneNumberId and accessToken are required" });
    }

    const form = new FormData();
    form.append("code_method", "SMS"); 
    form.append("language", "en");    

    const data = await callMetaApi({
      endpoint: `/${phoneNumberId}/request_code`,
      accessToken,
      method: "POST",
      data: form,
      headers: form.getHeaders(),
    });

    res.json({ data });
  } catch (error) {
    console.error("Request OTP Error:", error);

   return res.status(500).json({
  error: error.response?.data?.error || { message: error.message },
});
  }
};


export const verifyMobileOTP = async (req, res) => {
  try {
    const { phoneNumberId, accessToken, code } = req.body;

    if (!phoneNumberId || !accessToken || !code) {
      return res.status(400).json({
        error: "phoneNumberId, accessToken and code are required",
      });
    }

    const form = new FormData();
    form.append("code", code);

    const data = await callMetaApi({
      endpoint: `/${phoneNumberId}/verify_code`,
      accessToken,
      method: "POST",
      data: form,
      headers: form.getHeaders(),
    });

    res.json({ data });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      error: error.response?.data?.error || { message: error.message },
    });
  }
};
