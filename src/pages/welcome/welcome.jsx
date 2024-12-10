import { Button, Box, Typography } from "@mui/material";
import { useMsal } from "@azure/msal-react";

import { loginRequest } from "../../config/azureAuth";
import "./welcome.css";
import backgroundImage from "../../assets/welcome.webp";
import appIcon from "../../assets/icon.png";

export default function Welcome() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  return (
    <Box
      className="welcome-page"
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box className="title-box">
        <Box
          sx={{
            width: "175px",
            height: "175px",
            backgroundImage: `url(${appIcon})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <Typography className="app-name" variant="h2">
          NOVA
        </Typography>
        <Typography className="app-slogan" variant="body2">
          Where Innovation Takes Flight.
        </Typography>
      </Box>

      <Box className="button-box">
        <Button
          className="login-button"
          variant="contained"
          size="large"
          onClick={() => handleLogin()}
        >
          SIGN IN
        </Button>
      </Box>
    </Box>
  );
}
