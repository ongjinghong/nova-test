import React, { useEffect, useState } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
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
  Star,
  Feedback,
  BugReport,
  AllInclusive,
  Groups,
  EmojiEvents,
  Construction,
  SportsEsports,
} from "@mui/icons-material";

import "./sideBar.css";
import appIcon from "../../assets/icon.png";
import useAppStore from "../../stores/AppStore";
import useInnovationStore from "../../stores/InnovationStore";
// import useFunStore from "../../stores/FunStore";

export default function SideBar() {
  const version = useAppStore((state) => state.appVersion);
  const pages = useAppStore((state) => state.constants.pages);
  const currentPage = useAppStore((state) => state.currentPage);
  const appReady = useAppStore((state) => state.appReady);

  useEffect(() => {
    useAppStore.getState().getAppVersion();
  }, []);

  const handlePageChange = (page) => {
    useAppStore.getState().setCurrentPage(page);
    if (page === "Tools") {
      useInnovationStore.getState().setCurrentPage("home");
    }
    // else if (page === "Fun Activities") {
    //   useFunStore.getState().setCurrentPage("home");
    // }
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
          <Typography variant="caption">{version}-ALPHA</Typography>
        </Box>
        <Box className="sidebar-nav">
          <List>
            {pages.map((page, index) => (
              <Box key={page}>
                <ListItem disablePadding>
                  <ListItemButton
                    disabled={!appReady || (index >= 4 && index < 7)}
                    selected={currentPage === page}
                    onClick={() => handlePageChange(page)}
                  >
                    <ListItemIcon className="nav-icon">
                      {page === "Overview" && <Dashboard />}
                      {page === "Commitment" && <Flag />}
                      {page === "Submission" && <AppRegistration />}
                      {page === "Target" && <Language />}
                      {page === "Stars" && <Star />}
                      {page === "FullSpectrum" && <AllInclusive />}
                      {page === "Members" && <Groups />}
                      {page === "Hall of Fames" && <EmojiEvents />}
                      {page === "Tools" && <Construction />}
                      {page === "Fun Activities" && <SportsEsports />}
                    </ListItemIcon>
                    <ListItemText primary={page} />
                  </ListItemButton>
                </ListItem>
                {index === 0 && (
                  <Divider
                    className="track-divider"
                    key="track-divider"
                    textAlign="left"
                    sx={{ opacity: 0.6, marginTop: "10px" }}
                  >
                    <Typography variant="caption" gutterBottom>
                      DATA
                    </Typography>
                  </Divider>
                )}
                {index === 3 && (
                  <Divider
                    className="helper-divider"
                    key="helper-divider"
                    textAlign="left"
                    sx={{ opacity: 0.6, marginTop: "10px" }}
                  >
                    <Typography variant="caption" gutterBottom>
                      FLEX's
                    </Typography>
                  </Divider>
                )}
                {index === 6 && (
                  <Divider
                    className="helper-divider"
                    key="helper-divider"
                    textAlign="left"
                    sx={{ opacity: 0.6, marginTop: "10px" }}
                  >
                    <Typography variant="caption" gutterBottom>
                      LEARNING
                    </Typography>
                  </Divider>
                )}
              </Box>
            ))}
          </List>
        </Box>
        <Box sx={{}}>
          <List
            sx={{
              width: "100%",
            }}
          >
            <ListItem key="Report" className="report-button" disablePadding>
              <ListItemButton
                onClick={() =>
                  openUrl(
                    "https://github.com/intel-innersource/applications.tools.intel-flex-nova/issues/new?assignees=&labels=bug&template=bug_report.md&title=bug%3A+"
                  )
                }
                sx={{ paddingLeft: "35px" }}
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
                  openUrl(
                    "https://github.com/intel-innersource/applications.tools.intel-flex-nova/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=feat%3A+"
                  )
                }
                sx={{ paddingLeft: "35px" }}
              >
                <ListItemIcon className="feedback-icon">
                  <Feedback fontSize="small" />
                </ListItemIcon>
                <ListItemText className="feedback-text" primary="Feedback" />
              </ListItemButton>
            </ListItem>
            {/* <ListItem key="LogOut" className="logout-button" disablePadding>
              <ListItemButton onClick={() => handleLogout("redirect")}>
                <ListItemIcon className="logout-icon">
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText className="logout-text" primary="Log Out" />
              </ListItemButton>
            </ListItem> */}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}
