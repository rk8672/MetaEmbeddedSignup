import { useEffect } from "react";

export default function EmbeddedSignup() {
  useEffect(() => {
    // Load FB SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "801281555533147", // Your Meta App ID
        cookie: true,
        xfbml: true,
        version: "v23.0",
      });
      console.log("FB SDK Initialized");
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.async = true;
      js.defer = true;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");

    // Listen for Embedded Signup events
    const handleMessage = (event) => {
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
      )
        return;

      try {
        const data = JSON.parse(event.data);
        if (data.type === "WA_EMBEDDED_SIGNUP" && data.event === "FINISH") {
          const { phone_number_id, waba_id } = data.data;
          const sessionPre = document.getElementById("sessionInfo");
          if (sessionPre)
            sessionPre.textContent = `✅ Signup Complete!\nWABA ID: ${waba_id}\nPhone Number ID: ${phone_number_id}`;
          console.log("Embedded Signup Data:", data.data);
        }
      } catch (err) {
        console.warn("Non-JSON message received:", event.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleSignupClick = () => {
    const CONFIG_ID = "565106129591059"; // Your Embedded Signup Config ID
    if (!window.FB) {
      alert("FB SDK not loaded yet!");
      return;
    }

    window.FB.login(function (response) {
      if (response.authResponse) {
        console.log("User logged in:", response.authResponse);
      }
    }, {
      config_id: CONFIG_ID,
      response_type: "code",
      override_default_response_type: true,
      extras: {
        featureType: "",
        sessionInfoVersion: "2",
      },
    });
  };

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f2f2f2"
    }}>
      <button
        onClick={handleSignupClick}
        style={{
          padding: "12px 24px",
          backgroundColor: "#25d366",
          color: "white",
          fontSize: "16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}
      >
        Connect WhatsApp (Embedded Signup)
      </button>
      <pre
        id="sessionInfo"
        style={{
          background: "#fff",
          padding: "12px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          height: "150px",
          overflow: "auto",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        Session info will appear here after signup...
      </pre>
    </div>
  );
}
