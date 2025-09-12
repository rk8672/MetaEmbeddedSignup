// src/components/EmbeddedSignup.jsx
import React, { useEffect } from "react";
import axios from "axios";

const FB_APP_ID = import.meta.env.VITE_FB_APP_ID;
const FB_GRAPH_VERSION = import.meta.env.VITE_FB_GRAPH_VERSION || "v23.0";
const EMBEDDED_CONFIG_ID = import.meta.env.VITE_EMBEDDED_CONFIG_ID;


export default function EmbeddedSignup({ onSuccess }) {
  useEffect(() => {
    // load FB SDK
    if (!window.FB) {
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.src = `https://connect.facebook.net/en_US/sdk.js`;
      script.onload = () => initFB();
      document.body.appendChild(script);
    } else {
      initFB();
    }

    // message listener to receive WA_EMBEDDED_SIGNUP events
    window.addEventListener("message", handleMessageEvent);
    return () => {
      window.removeEventListener("message", handleMessageEvent);
    };
    // eslint-disable-next-line
  }, []);

  const initFB = () => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FB_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: FB_GRAPH_VERSION,
      });
    };
  };

  const handleMessageEvent = (event) => {
    // ensure event.origin is facebook
    if (!event.origin || !event.origin.includes("facebook.com")) return;
    try {
      const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      if (data?.type === "WA_EMBEDDED_SIGNUP") {
        console.log("Embedded signup session event:", data);
        // data.event could be FINISH / CANCEL / error object
        // If FINISH, data.data contains phone_number_id, waba_id, business_id (may also have other fields)
        if (data.event && data.event.startsWith("FINISH")) {
          // We also need the exchangeable code returned via FB.login callback. But the message event contains IDs.
          // We will rely on fbLoginCallback to receive the exchangeable code and handle
        }
      }
    } catch (err) {
      console.warn("Failed to parse FB message event", err);
    }
  };

  // Response callback receives authResponse.code (exchangeable code)
  const fbLoginCallback = (response) => {
    if (response?.authResponse?.code) {
      const code = response.authResponse.code; // short-lived exchangeable code (~30s)
      // send code immediately to backend to exchange for customer token
      (async () => {
        try {
          const payload = { code };
          const res = await axios.post("/api/embedded/exchange", payload);
          // res.data should include saved credential or status
          if (res.data?.credential) {
            if (onSuccess) onSuccess(res.data.credential);
            alert("Embedded signup succeeded and saved.");
          } else if (res.data?.message) {
            alert("Signup info saved: " + res.data.message);
          }
        } catch (err) {
          console.error("Exchange failed", err.response?.data || err.message);
          alert("Failed to exchange code: " + (err.response?.data?.message || err.message));
        }
      })();
    } else {
      console.log("FB login response:", response);
    }
  };

  const launchWhatsAppSignup = () => {
    if (!window.FB) return alert("FB SDK not loaded");
    window.FB.login(fbLoginCallback, {
      config_id: EMBEDDED_CONFIG_ID,
      response_type: "code",
      override_default_response_type: true,
      extras: {
        setup: {},
        featureType: "", // keep blank for default; or use 'whatsapp_business_app_onboarding' etc.
        sessionInfoVersion: "3",
      },
    });
  };

  return (
    <div>
      <button
        onClick={launchWhatsAppSignup}
        style={{
          backgroundColor: "#1877f2",
          color: "#fff",
          padding: "10px 18px",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
        }}
      >
        Connect WhatsApp (Embedded Signup)
      </button>
      <p style={{ fontSize: 12, color: "#666" }}>
        After signup completes, the backend will exchange the returned code and save credentials.
      </p>
    </div>
  );
}
