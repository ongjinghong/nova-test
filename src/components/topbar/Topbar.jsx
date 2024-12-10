import { useState, useEffect, useContext } from "react";
import { Avatar, Box, Typography, IconButton, Badge } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { NotificationsOutlined } from "@mui/icons-material";
import { invoke } from "@tauri-apps/api/core";

import { useProfileData } from "../../data/profileData";
import { ThemeContext } from "../../config/themeContext";

import "./topBar.css";

export default function TopBar() {
  const { profile, picture } = useProfileData();
  const [greeting, setGreeting] = useState("");
  const { themeMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    // Fetch greeting
    const fetchGreeting = async () => {
      try {
        const response = await invoke("get_greeting");
        setGreeting(response);
      } catch (error) {
        console.error("Failed to fetch greeting:", error);
      }
    };

    fetchGreeting();
  }, []);

  return (
    <Box className="content-header">
      <Box className="header-theme">
        <IconButton
          size="large"
          color="inherit"
          className="theme-icon"
          onClick={toggleTheme}
        >
          {themeMode == "light" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>
      {/* <Box className="header-notifications">
        <IconButton size="large" color="inherit" className="notification-icon">
          <Badge badgeContent={0} color="error">
            <NotificationsOutlined />
          </Badge>
        </IconButton>
      </Box> */}
      <Box className="header-greetings">
        <Typography variant="overline">{greeting}</Typography>
        <Typography variant="button" sx={{ marginTop: "-10px" }}>
          {profile && profile.displayName}
        </Typography>
      </Box>
      <Box className="header-pic">
        {profile && picture && (
          <Avatar alt={profile.displayName} src={picture} />
        )}
      </Box>
    </Box>
  );
}
