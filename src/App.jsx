import React, { useState, useEffect, useMemo } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Box } from "@mui/material";

import "./App.css";
import Welcome from "./pages/welcome/welcome";
import SideBar from "./components/sidebar/sideBar";
import TopBar from "./components/topbar/topBar";
import Home from "./pages/home/home";
import Commitment from "./pages/commitment/Commitment";
import Submission from "./pages/submission/Submission";
import Target from "./pages/target/Target";
import Stars from "./pages/stars/stars";
import FullSpectrum from "./pages/innovators/FullSpectrum";
import { FetchProfileData } from "./data/profileData";
import { FetchSharepointData } from "./data/sharepointData";
import { ThemeContextProvider } from "./config/themeContext";

function App() {
  const [currentPage, setCurrentPage] = useState("Home");

  const renderPage = () => {
    switch (currentPage) {
      case "Home":
        return <Home />;
      case "Commitment":
        return <Commitment />;
      case "Submission":
        return <Submission />;
      case "Target":
        return <Target />;
      case "Innovation Stars":
        return <Stars />;
      case "FullSpectrum":
        return <FullSpectrum />;
      default:
        return <Home />;
    }
  };

  return (
    <ThemeContextProvider>
      <Box className="app-box">
        <AuthenticatedTemplate>
          <FetchProfileData>
            <SideBar setPage={setCurrentPage} />
            <Box className="app-content">
              <TopBar />
              <FetchSharepointData>{renderPage()}</FetchSharepointData>
            </Box>
          </FetchProfileData>
        </AuthenticatedTemplate>

        <UnauthenticatedTemplate>
          <Welcome />
        </UnauthenticatedTemplate>
      </Box>
    </ThemeContextProvider>
  );
}

export default App;
