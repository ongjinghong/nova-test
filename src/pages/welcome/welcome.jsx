import { Button, Box, Typography } from "@mui/material";

import "./welcome.css";
import appIcon from "../../assets/icon.png";
import backgroundImage from "../../assets/welcome.webp";
import useAzureStore from "../../stores/AzureStore";

export default function Welcome() {
  const msalInstance = useAzureStore((state) => state.msalInstance);
  const apiPermissions = useAzureStore((state) => state.apiPermissions);

  const handleLogin = () => {
    msalInstance
      .loginRedirect({
        scopes: apiPermissions,
      })
      .catch((e) => {
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
