import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import "../assets/fonts/fonts.css";
import useAppStore from "../stores/AppStore";

const ThemeWrapper = ({ children }) => {
  const themeMode = useAppStore((state) => state.themeMode);
  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
    typography: {
      fontFamily: ["IntelOneDisplay", "IntelOneMono", "IntelOneText"].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeWrapper;
