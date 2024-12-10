import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import GroupsIcon from "@mui/icons-material/Groups";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import GitHubIcon from "@mui/icons-material/GitHub";
import ConstructionIcon from "@mui/icons-material/Construction";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

// Define a mapping of category names to icon components
const iconMapping = {
  Conference: ArticleIcon,
  IDF: LightbulbIcon,
  Initiative: GroupsIcon,
  "Open Source": GitHubIcon,
  "Micro Innovation": ConstructionIcon,
  "Knowledge Sharing": CoPresentIcon,
};

export default function CategoryCard({
  data,
  secondaryData,
  dataType,
  categoryName,
  completion = false,
  diff = -1,
}) {
  const Icon = iconMapping[categoryName];

  return (
    <Card variant="outlined" sx={{ flexGrow: 1 }}>
      <CardContent>
        <Stack direction={"column"}>
          <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
            <Stack direction={"column"}>
              <Icon
                sx={{
                  width: 48,
                  height: 48,
                  padding: 1,
                }}
              />
              <Typography
                component="h2"
                variant="subtitle2"
                gutterBottom
                sx={{ paddingLeft: "8px" }}
              >
                {categoryName}
              </Typography>
            </Stack>
            <Stack direction={"column"} alignItems={"end"}>
              {completion && diff > 0 && (
                <Typography variant="caption" align="right">
                  {diff} {categoryName} required
                </Typography>
              )}
              {completion && diff == 0 && (
                <>
                  <Typography variant="caption" align="right">
                    Target Met
                  </Typography>
                  <TaskAltIcon
                    sx={{
                      width: 36,
                      height: 36,
                      marginTop: 1,
                      color: "green",
                    }}
                  />
                </>
              )}
            </Stack>
          </Stack>

          {dataType === "Commitment" && (
            <Stack
              direction={"row"}
              sx={{ alignContent: "center", marginTop: "16px", width: "100%" }}
            >
              <Stack
                direction={"column"}
                sx={{ alignItems: "center", width: "50%" }}
              >
                <Typography variant="body2">Primary</Typography>
                <Typography variant="h3" component="p">
                  {data}
                </Typography>
              </Stack>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Stack
                direction={"column"}
                sx={{ alignItems: "center", width: "50%" }}
              >
                <Typography variant="body2">Secondary</Typography>
                <Typography variant="h3" component="p">
                  {secondaryData}
                </Typography>
              </Stack>
            </Stack>
          )}

          {dataType === "Target" && (
            <Stack
              direction={"column"}
              sx={{
                alignItems: "end",
                marginTop: "16px",
                width: "100%",
              }}
            >
              <Typography variant="h3" component="p">
                {data}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
