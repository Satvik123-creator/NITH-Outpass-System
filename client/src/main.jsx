import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";


// Dev helper: suppress extension-origin noisy errors from content scripts
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  window.addEventListener(
    "error",
    (e) => {
      const fname = e?.filename || "";
      if (
        fname.includes("content-script") ||
        fname.includes("AdUnit") ||
        fname.includes("chrome-extension://")
      ) {
        e.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener("unhandledrejection", (evt) => {
    const reason = String(evt?.reason || "");
    if (reason.includes("content-script") || reason.includes("AdUnit")) {
      evt.preventDefault();
    }
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
