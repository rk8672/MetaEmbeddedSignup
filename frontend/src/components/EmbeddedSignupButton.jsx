import { useEffect, useState } from "react";

export default function WhatsAppEmbeddedSignup({
 APP_ID = "1161878365754956", 
 CONFIG_ID = "1171586581686783",
}) {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    // Load FB SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: APP_ID,
        cookie: true,
        xfbml: true,
        version: "v23.0",
      });
      console.log("FB SDK Initialized");
    };

    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.async = true;
      js.defer = true;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");

    // Listen for Embedded Signup completion
    const handleMessage = async (event) => {
      if (!["https://www.facebook.com", "https://web.facebook.com"].includes(event.origin))
        return;

      try {
        const data = JSON.parse(event.data);

        if (data.type === "WA_EMBEDDED_SIGNUP" && data.event === "FINISH") {
          const { code, waba_id, phone_number_id } = data.data;
          console.log("Embedded Signup Data:", data.data);

          if (!code) {
            console.error("Embedded Signup code is missing!");
            return;
          }

          // Show info on page
          const sessionInfoPre = document.getElementById("sessionInfo");
          if (sessionInfoPre) {
            sessionInfoPre.textContent = `Signup Complete!\nWABA ID: ${waba_id}\nPhone Number ID: ${phone_number_id}\nCode: ${code}`;
          }

          // Exchange code for business token
          const res = await fetch(
            `https://metaembeddedsignup-backend.onrender.com/api/embeddedSignup/exchange-token?code=${code}`
          );
          const result = await res.json();

          if (result.success) setAccessToken(result.access_token);
        }
      } catch (err) {
        console.warn("Error parsing message:", err, event.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [APP_ID]);

  const handleSignupClick = () => {
    if (!window.FB) {
      alert("FB SDK not loaded yet!");
      return;
    }

    // Trigger WhatsApp Embedded Signup
    window.FB.CustomerChat.showEmbeddedSignup({
      config_id: CONFIG_ID,
      extras: { sessionInfoVersion: "2" },
    });
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
