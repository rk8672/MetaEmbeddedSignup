import { useEffect, useState } from "react";

export default function WhatsAppEmbeddedSignup({
  APP_ID = "1161878365754956",          // Replace with your App ID
  CONFIG_ID = "1171586581686783",    // Replace with your Embedded Signup Config ID
  FEATURE_TYPE = "",                 // Optional: "", "only_waba_sharing", "whatsapp_business_app_onboarding"
}) {
  const [accessToken, setAccessToken] = useState("");
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // Load Facebook SDK dynamically
  useEffect(() => {
    if (window.FB) {
      setSdkLoaded(true);
      return;
    }

    window.fbAsyncInit = function () {
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
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [APP_ID]);

  // Listen for Embedded Signup messages
  useEffect(() => {
    const handleMessage = async (event) => {
      if (!event.origin.endsWith("facebook.com")) return;

      try {
        const data = JSON.parse(event.data);

        if (data.type === "WA_EMBEDDED_SIGNUP") {
          console.log("WA_EMBEDDED_SIGNUP event:", data);

          if (data.event === "FINISH") {
            const { code, waba_id, phone_number_id } = data.data;

            if (!code) {
              console.error("Embedded Signup code missing!");
              return;
            }

            const sessionInfoPre = document.getElementById("sessionInfo");
            if (sessionInfoPre) {
              sessionInfoPre.textContent = `Signup Complete!\nWABA ID: ${waba_id}\nPhone Number ID: ${phone_number_id}\nCode: ${code}`;
            }

            // Exchange code on your backend
            const res = await fetch(
              `https://metaembeddedsignup-backend.onrender.com/api/embeddedSignup/exchange-token?code=${code}`
            );
            const result = await res.json();
            if (result.success) setAccessToken(result.access_token);
          }

          if (data.event === "CANCEL") {
            console.warn("Embedded Signup Abandoned:", data.data);
          }
        }
      } catch  {
        console.warn("Non-JSON message received:", event.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Launch Embedded Signup
  const launchWhatsAppSignup = () => {
    if (!sdkLoaded || !window.FB) {
      alert("FB SDK not loaded yet!");
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse?.code) {
          console.log("Received code:", response.authResponse.code);
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

      <pre id="sessionInfo">Waiting for signup...</pre>

      {accessToken && (
        <div>
          <h3>✅ Access Token:</h3>
          <pre>{accessToken}</pre>
        </div>
      )}
    </div>
  );
}
