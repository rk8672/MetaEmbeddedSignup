import axios from "axios";


export const callMetaApi = async ({
  endpoint,
  accessToken,
  method = "GET",
  params = {},
  data = {},
  headers = {},
}) => {
  try {
    const url = `https://graph.facebook.com/v23.0${endpoint}`;

    const response = await axios({
      method,
      url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      },
      params,
      data,  
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return response.data;
  } catch (error) {
    console.error("Meta API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || "Meta API call failed");
  }
};
