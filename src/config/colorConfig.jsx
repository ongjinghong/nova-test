import { useTheme } from "@mui/material/styles";
import {
  teal,
  amber,
  indigo,
  blue,
  yellow,
  green,
  lightBlue,
  lightGreen,
  orange,
  purple,
  deepPurple,
  red,
  grey,
  lime,
} from "@mui/material/colors";

const useColorConfig = () => {
  const theme = useTheme();

  const trendColors = {
    up:
      theme.palette.mode === "light"
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === "light"
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === "light"
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const categoryColors = {
    conferences: theme.palette.mode === "light" ? teal[400] : teal[700],
    idf: theme.palette.mode === "light" ? amber[400] : amber[700],
    initiatives: theme.palette.mode === "light" ? blue[400] : blue[700],
    microinnovation: theme.palette.mode === "light" ? yellow[400] : yellow[700],
    opensource: theme.palette.mode === "light" ? green[400] : green[700],
    knowledgesharing:
      theme.palette.mode === "light" ? indigo[400] : indigo[700],
  };

  const statusColors = {
    NEW: theme.palette.mode === "light" ? lightBlue["A100"] : lightBlue["A400"],
    WIP: theme.palette.mode === "light" ? yellow["A200"] : yellow["A700"],
    Submitted:
      theme.palette.mode === "light" ? deepPurple["A100"] : deepPurple["A400"],
    Accepted:
      theme.palette.mode === "light" ? lightGreen["A200"] : lightGreen["A700"],
    Rejected: theme.palette.mode === "light" ? red["A100"] : red["A200"],
    Cancelled: theme.palette.mode === "light" ? grey[400] : grey[700],
  };

  const quarterColors = {
    Q1: theme.palette.mode === "light" ? lightBlue[400] : lightBlue[700],
    Q2: theme.palette.mode === "light" ? green[400] : green[700],
    Q3: theme.palette.mode === "light" ? yellow[400] : yellow[700],
    Q4: theme.palette.mode === "light" ? orange[400] : orange[700],
  };

  const chipColors = {
    Quarter: { backgroundColor: "#5b69ff", color: "white" },
    Status: { backgroundColor: "#cc94da", color: "white" },
    Site: { backgroundColor: "#0095ca", color: "white" },
    Domain: { backgroundColor: "#00c7fd", color: "white" },
  };

  return {
    trendColors,
    statusColors,
    categoryColors,
    quarterColors,
    chipColors,
  };
};

export default useColorConfig;
