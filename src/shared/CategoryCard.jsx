import { Box, Card, CardContent, Typography } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import GroupsIcon from "@mui/icons-material/Groups";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import GitHubIcon from "@mui/icons-material/GitHub";
import ConstructionIcon from "@mui/icons-material/Construction";
import CoPresentIcon from "@mui/icons-material/CoPresent";

// Define a mapping of category names to icon components
const iconMapping = {
  Conferences: ArticleIcon,
  IDF: LightbulbIcon,
  Initiatives: GroupsIcon,
  "Open Source": GitHubIcon,
  "Micro-Innovation": ConstructionIcon,
  "Knowledge Sharing": CoPresentIcon,
};

export default function CategoryCard({ category, sum }) {
  const Icon = iconMapping[category];

  return (
    <Card variant="outlined">
      <CardContent sx={{ padding: 1, mb: -2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Icon
              sx={{
                width: 36,
                height: 36,
              }}
            />
            <Typography variant="subtitle2" sx={{ paddingLeft: "4px" }}>
              {category}
            </Typography>
          </Box>

          <Typography variant="h4">{sum}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
