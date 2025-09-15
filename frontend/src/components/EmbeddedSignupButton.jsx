import { useEffect, useState } from "react";

export default function WhatsAppEmbeddedSignup({
  APP_ID = "1161878365754956",          // Replace with your App ID
  CONFIG_ID = "1171586581686783",      // Replace with your Embedded Signup Config ID
  FEATURE_TYPE = "",            // Optional: "", "only_waba_sharing", "whatsapp_business_app_onboarding"
}) {
  const [accessToken, setAccessToken] = useState("");
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sessionInfo, setSessionInfo] = useState("Waiting for signup...");

  // 1️⃣ Load FB SDK dynamically
  useEffect(() => {
    console.log("Loading FB SDK...");
    if (window.FB) {
      console.log("FB SDK already loaded.");
      setSdkLoaded(true);
      return;
    }

    window.fbAsyncInit = function () {
      console.log("Initializing FB SDK...");
      window.FB.init({
        appId: APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v23.0",
      });
      console.log("FB SDK Initialized");
      setSdkLoaded(true);
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.onload = () => console.log("FB SDK script loaded.");
    document.body.appendChild(script);

    return () => {
      console.log("Removing FB SDK script...");
      script.remove();
    };
  }, [APP_ID]);

  // 2️⃣ Helper to parse query strings
  function parseQueryString(queryString) {
    const params = {};
    queryString.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key) params[key] = decodeURIComponent(value || "");
    });
    console.log("Parsed query string:", params);
    return params;
  }

  // 3️⃣ Listen for Embedded Signup messages
  useEffect(() => {
  let storedIds = {}; // store IDs once

const handleMessage = async (event) => {
  let data;

  try {
    data = JSON.parse(event.data);
  } catch {
    data = { data: parseQueryString(event.data), type: "WA_EMBEDDED_SIGNUP", event: "FINISH" };
  }

  if (data.type === "WA_EMBEDDED_SIGNUP") {
    // Only set IDs if they exist
    storedIds = {
      waba_id: data.data?.waba_id || storedIds.waba_id,
      phone_number_id: data.data?.phone_number_id || storedIds.phone_number_id,
      business_id: data.data?.business_id || storedIds.business_id,
      code: data.data?.code || data.code || storedIds.code,
    };

    setSessionInfo(
      `Signup Complete!\nWABA ID: ${storedIds.waba_id}\nPhone Number ID: ${storedIds.phone_number_id}\nBusiness ID: ${storedIds.business_id}\nCode: ${storedIds.code}`
    );

    if (storedIds.code) {
      // exchange code with backend
      // const res = await fetch(
      //   `https://metaembeddedsignup-backend.onrender.com/api/embeddedSignup/exchange-token?code=${storedIds.code}`
      // );
      const res = await fetch("https://metaembeddedsignup-backend.onrender.com/api/embeddedSignup/exchange-token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    code: storedIds.code,
    wabaId: storedIds.waba_id,
    phoneNumberId: storedIds.phone_number_id,
    businessId: storedIds.business_id,
  }),
});
      const result = await res.json();
      if (result.success) setAccessToken(result.access_token);
    }
  }
};

    window.addEventListener("message", handleMessage);
    return () => {
      console.log("Removing message event listener...");
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // 4️⃣ Launch Embedded Signup
  const launchWhatsAppSignup = () => {
    console.log("Launching WhatsApp Embedded Signup...");
    if (!sdkLoaded || !window.FB) {
      alert("FB SDK not loaded yet!");
      console.warn("FB SDK not loaded.");
      return;
    }

    window.FB.login(
      (response) => {
        console.log("FB.login callback response:", response);
        if (response.authResponse?.code) {
          console.log("Received code from FB.login:", response.authResponse.code);
        } else {
          console.warn("Embedded Signup login response:", response);
        }
      },
      {
        config_id: CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: FEATURE_TYPE,
          sessionInfoVersion: "3",
        },
      }
    );
  };

  // 5️⃣ Render
  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <button
        onClick={launchWhatsAppSignup}
        style={{
          backgroundColor: "#1877f2",
          border: 0,
          borderRadius: 4,
          color: "#fff",
          cursor: "pointer",
          fontSize: 16,
          fontWeight: "bold",
          height: 40,
          padding: "0 24px",
        }}
      >
        Connect WhatsApp (Embedded Signup)
      </button>

      <pre id="sessionInfo">{sessionInfo}</pre>

      {accessToken && (
        <div>
          <h3>✅ Access Token:</h3>
          <pre>{accessToken}</pre>
        </div>
      )}
    </div>
  );
}
