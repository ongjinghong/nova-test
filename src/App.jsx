import React, { useEffect } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { Box, Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import "./App.css";
import ThemeWrapper from "./utils/Themes";
import Welcome from "./pages/welcome/welcome";
import SideBar from "./components/sidebar/sideBar";
import TopBar from "./components/topbar/topBar";
import Overview from "./pages/overview/Overview";
import Commitment from "./pages/commitment/Commitment";
import Submission from "./pages/submission/Submission";
import Target from "./pages/target/Target";
import Stars from "./pages/stars/stars";
import FullSpectrum from "./pages/innovators/FullSpectrum";

import useAppStore from "./stores/AppStore";
import useAzureStore from "./stores/AzureStore";
import useLoginStore from "./stores/LoginStore";
import Announcement from "./components/announcement/announcement";

function App() {
  const { instance, accounts } = useMsal();
  const setMsalInstance = useAzureStore((state) => state.setMsalInstance);
  const setMsalAccounts = useAzureStore((state) => state.setMsalAccounts);
  const setAccessToken = useLoginStore((state) => state.setAccessToken);
  const currentPage = useAppStore((state) => state.currentPage);
  const statusOpen = useAppStore((state) => state.statusOpen);
  const statusMessage = useAppStore((state) => state.statusMessage);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: useAzureStore.getState().apiPermissions, // Replace with your scopes
          account: accounts[0],
        });
        setAccessToken(tokenResponse.accessToken);
      } catch (error) {
        console.error("Error acquiring token silently:", error);
      }
    };

    const initializeMsal = async () => {
      try {
        await instance.initialize();
        console.debug("MSAL instance initialized.", instance);
        setMsalInstance(instance);
        if (accounts.length > 0) {
          console.debug("MSAL accounts:", accounts);
          setMsalAccounts(accounts);
          fetchAccessToken();
        }
      } catch (error) {
        console.error("Error initializing MSAL instance:", error);
      }
    };

    if (instance) {
      initializeMsal();
    }
  }, [instance, accounts, setMsalInstance, setMsalAccounts, setAccessToken]);

  const handleStatusClose = () => {
    useAppStore.getState().closeStatus();
    useAppStore.getState().clearStatusMessage();
  };

  return (
    <ThemeWrapper>
      <Box className="app-box">
        <AuthenticatedTemplate>
          <SideBar />
          <Box className="app-content">
            <TopBar />
            {currentPage === "Overview" && <Overview />}
            {currentPage === "Commitment" && <Commitment />}
            {currentPage === "Submission" && <Submission />}
            {currentPage === "Target" && <Target />}
            {currentPage === "Innovation Stars" && <Stars />}
            {currentPage === "FullSpectrum" && <FullSpectrum />}
          </Box>
          <Announcement />
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={statusOpen}
            autoHideDuration={5000}
            onClose={handleStatusClose}
            message={statusMessage}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={handleStatusClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        </AuthenticatedTemplate>

        <UnauthenticatedTemplate>
          <Welcome />
        </UnauthenticatedTemplate>
      </Box>
    </ThemeWrapper>
  );
}

export default App;
