import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  Flag,
  AppRegistration,
  Language,
  Logout,
  Star,
  Feedback,
  BugReport,
  AllInclusive,
} from "@mui/icons-material";
import { getVersion } from "@tauri-apps/api/app";
import { useMsal } from "@azure/msal-react";
import {} from "@tauri-apps/api";

import "./sideBar.css";
import * as shell from "@tauri-apps/plugin-shell";
import appIcon from "../../assets/icon.png";

export default function SideBar({ setPage }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { instance, accounts } = useMsal();
  const [appVersion, setAppVersion] = useState("0.0.0");

  const handleListItemClick = (index, page) => {
    setSelectedIndex(index);
    setPage(page);
  };

  const handleLogout = (logoutType) => {
    if (logoutType === "popup") {
      instance.logoutPopup({
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/",
      });
    } else if (logoutType === "redirect") {
      instance.logoutRedirect({
        postLogoutRedirectUri: "/",
      });
    }
  };

  useEffect(() => {
    getVersion()
      .then((version) => {
        setAppVersion(version);
      })
      .catch((error) => {
        console.error("Error fetching version:", error);
      });
  });

  const openURL = async (page_url) => {
    const url = page_url;
    await shell.open(url);
  };

  return (
    <Drawer className="sidebar" variant="persistent" anchor="left" open={true}>
      <Box className="sidebar-content">
        <Box className="sidebar-header">
          <Box
            sx={{
              width: "100px",
              height: "100px",
              backgroundImage: `url(${appIcon})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <Typography
            variant="h4"
            sx={{ letterSpacing: "15px", marginLeft: "10px" }}
          >
            NOVA
          </Typography>
          <Typography variant="caption">{appVersion}-ALPHA</Typography>
        </Box>
        <Box className="sidebar-nav">
          <List>
            <ListItem key="Home" disablePadding>
              <ListItemButton
                selected={selectedIndex === 0}
                onClick={() => handleListItemClick(0, "Home")}
              >
                <ListItemIcon className="nav-icon">
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Overview" />
              </ListItemButton>
            </ListItem>

            <Divider className="track-divider" textAlign="left">
              <Typography variant="caption" gutterBottom>
                TRACKED DATA
              </Typography>
            </Divider>

            <ListItem key="Commitment" disablePadding>
              <ListItemButton
                selected={selectedIndex === 2}
                onClick={() => handleListItemClick(2, "Commitment")}
              >
                <ListItemIcon className="nav-icon">
                  <Flag />
                </ListItemIcon>
                <ListItemText primary="Commitment" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Submission" disablePadding>
              <ListItemButton
                selected={selectedIndex === 3}
                onClick={() => handleListItemClick(3, "Submission")}
              >
                <ListItemIcon className="nav-icon">
                  <AppRegistration />
                </ListItemIcon>
                <ListItemText primary="Submission" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Target" disablePadding>
              <ListItemButton
                selected={selectedIndex === 4}
                onClick={() => handleListItemClick(4, "Target")}
              >
                <ListItemIcon className="nav-icon">
                  <Language />
                </ListItemIcon>
                <ListItemText primary="Target" />
              </ListItemButton>
            </ListItem>

            <Divider className="helper-divider" textAlign="left">
              <Typography variant="caption" gutterBottom>
                INNOVATORS
              </Typography>
            </Divider>
            <ListItem key="Innovation Stars" disablePadding>
              <ListItemButton
                selected={selectedIndex === 1}
                onClick={() => handleListItemClick(1, "Innovation Stars")}
              >
                <ListItemIcon className="nav-icon">
                  <Star />
                </ListItemIcon>
                <ListItemText primary="Innovation Stars" />
              </ListItemButton>
            </ListItem>
            <ListItem key="FullSpectrum" disablePadding>
              <ListItemButton
                selected={selectedIndex === 5}
                onClick={() => handleListItemClick(5, "FullSpectrum")}
              >
                <ListItemIcon className="nav-icon">
                  <AllInclusive />
                </ListItemIcon>
                <ListItemText primary="Full Spectrum" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Box sx={{}}>
          <List
            sx={{
              paddingLeft: "20px",
              width: "100%",
            }}
          >
            <ListItem key="Report" className="report-button" disablePadding>
              <ListItemButton
                sx={{}}
                onClick={() =>
                  openURL(
                    "https://github.com/intel-innersource/applications.tools.intel-flex-nova/issues/new?assignees=&labels=bug&template=bug_report.md&title=bug%3A+"
                  )
                }
              >
                <ListItemIcon className="report-icon">
                  <BugReport fontSize="small" />
                </ListItemIcon>
                <ListItemText className="report-text" primary="Report a Bug" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Feedback" className="feedback-button" disablePadding>
              <ListItemButton
                onClick={() =>
                  openURL(
                    "https://github.com/intel-innersource/applications.tools.intel-flex-nova/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=feat%3A+"
                  )
                }
              >
                <ListItemIcon className="feedback-icon">
                  <Feedback fontSize="small" />
                </ListItemIcon>
                <ListItemText className="feedback-text" primary="Feedback" />
              </ListItemButton>
            </ListItem>
            <ListItem key="LogOut" className="logout-button" disablePadding>
              <ListItemButton onClick={() => handleLogout("redirect")}>
                <ListItemIcon className="logout-icon">
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText className="logout-text" primary="Log Out" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}
