import React from "react";
import ReactDOM from "react-dom/client";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

import "./assets/fonts/fonts.css";
import App from "./App";
import useAzureStore from "./stores/AzureStore";

const msalInstance = new PublicClientApplication(
  useAzureStore.getState().msalConfig
);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
  // </React.StrictMode>
);
