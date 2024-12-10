import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
// theme
import "./assets/fonts/fonts.css";

// local import
import App from "./App";
import { msalConfig } from "./config/azureAuth";

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
  // </React.StrictMode>
);
