import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import "./topBar.css";
import useAppStore from "../../stores/AppStore";
import useLoginStore from "../../stores/LoginStore";

export default function TopBar() {
  const greeting = useAppStore((state) => state.greetings);
  const themeMode = useAppStore((state) => state.themeMode);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const profileMenuAnchor = useAppStore((state) => state.profileMenuAnchor);

  const token = useLoginStore((state) => state.accessToken);
  const profile = useLoginStore((state) => state.loginProfile);
  const profilePic = useLoginStore((state) => state.loginPicture);

  useEffect(() => {
    if (token) {
      useAppStore.getState().setGreetings();
      useLoginStore.getState().getMSProfile();
      useLoginStore.getState().getMSProfilePic();
    }
  }, [token]);

  const handleProfileClick = (event) => {
    useAppStore.getState().setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    useAppStore.getState().setProfileMenuAnchor(null);
  };

  return (
    <Box className="content-header">
      <Box className="header-action">
        <Tooltip
          title="Coming Soon"
          arrow
          placement="right"
          color={"secondary"}
        >
          <Button
            variant="contained"
            startIcon={<SmartToyIcon />}
            sx={{ width: 150, borderRadius: 20 }}
          >
            NOVA Agent
          </Button>
        </Tooltip>
      </Box>

      <Box className="header-profile">
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

        <Box className="header-greetings">
          <Typography variant="overline">{greeting}</Typography>
          <Typography variant="button" sx={{ marginTop: "-10px" }}>
            {profile && profile.displayName}
          </Typography>
        </Box>
        <Box className="header-pic">
          <Badge overlap="circular" color="error">
            {profile && (
              <Avatar
                alt={profile.displayName}
                src={profilePic}
                onClick={handleProfileClick}
              />
            )}
          </Badge>
          <Menu
            anchorEl={profileMenuAnchor}
            open={profileMenuAnchor ? true : false}
            onClose={handleProfileClose}
            onClick={handleProfileClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              },
            }}
          >
            <MenuItem disabled>Profile</MenuItem>
            <MenuItem disabled>Settings</MenuItem>
            <MenuItem disabled>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
}
