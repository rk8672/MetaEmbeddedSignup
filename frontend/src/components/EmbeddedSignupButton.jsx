import { useEffect, useState } from "react";

export default function WhatsAppEmbeddedSignup({
  APP_ID = "1161878365754956", 
 CONFIG_ID = "1171586581686783",
}) {
  const [accessToken, setAccessToken] = useState("");
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // Load FB SDK only once
    if (window.fbAsyncInit) return;

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: APP_ID,
        cookie: true,
        xfbml: true,
        version: "v23.0",
      });
      console.log("✅ FB SDK Initialized");
      setSdkLoaded(true);
    };

    // Inject SDK script
    const scriptId = "facebook-jssdk";
    if (!document.getElementById(scriptId)) {
      const js = document.createElement("script");
      js.id = scriptId;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.async = true;
      js.defer = true;
      document.body.appendChild(js);
    }

    // Handle Embedded Signup message
    const handleMessage = async (event) => {
      if (!["https://www.facebook.com", "https://web.facebook.com"].includes(event.origin)) return;

      try {
        const data = JSON.parse(event.data);

        if (data.type === "WA_EMBEDDED_SIGNUP" && data.event === "FINISH") {
          const { code, waba_id, phone_number_id } = data.data;
          console.log("✅ Embedded Signup Data:", data.data);

          if (!code) {
            console.error("❌ Code is missing from signup data!");
            return;
          }

          // Show info on UI
          const sessionInfoPre = document.getElementById("sessionInfo");
          if (sessionInfoPre) {
            sessionInfoPre.textContent = `Signup Complete!\nWABA ID: ${waba_id}\nPhone Number ID: ${phone_number_id}\nCode: ${code}`;
          }

          // Send code to backend to get business token
          const res = await fetch(
            `https://metaembeddedsignup-backend.onrender.com/api/embeddedSignup/exchange-token?code=${code}`
          );
          const result = await res.json();

          if (result.success) {
            setAccessToken(result.access_token);
            console.log("✅ Access Token received");
          } else {
            console.error("❌ Failed to get Access Token", result);
          }
        }
      } catch (err) {
        console.warn("⚠️ Error parsing message:", err, event.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [APP_ID]);

  const handleSignupClick = () => {
    if (!sdkLoaded) return alert("⚠️ FB SDK not loaded yet!");

    if (!window.FB) return alert("⚠️ FB object not found!");

    console.log("Opening Embedded Signup...");

    window.FB.login(
      () => {
        console.log("FB.login triggered (Embedded Signup popup opened)");
      },
      {
        config_id: CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          featureType: "",
          sessionInfoVersion: "2",
        },
      }
    );
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <button onClick={handleSignupClick}>
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
