import React, { useEffect, useRef } from "react";
import {
  Box,
  Chip,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Fab,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";

import useInnovationStore from "../../stores/InnovationStore";
import SCAMPER from "./scamper/Scamper";
import TRIZ from "./triz/TRIZ";
import SIT from "./sit/SIT";
import { getRandomColor, getTextColor } from "../../utils/Helpers";

// The page component displays every tool in a card layout
const InnovationTools = () => {
  const { tools, searchQuery, setSearchQuery, currentPage, setCurrentPage } =
    useInnovationStore();
  const topRef = useRef(null);

  // Filter tools based on the search query (checking name, category, and origin)
  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.origin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div ref={topRef}></div>
      {currentPage === "home" && (
        <Container
          maxWidth="lg"
          sx={{
            height: "100%",
            padding: 2,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            scrollbarWidth: "none",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Innovation Ideation & Thinking Tools
          </Typography>
          {/* Search Field */}
          <TextField
            fullWidth
            placeholder="Search tools..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Grid
            container
            spacing={2}
            sx={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {filteredTools
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((tool) => (
                <Grid
                  size={4}
                  key={tool.id}
                  // When the SCAMPER card is clicked, switch to the scamper page
                  onClick={() => {
                    if (tool.name.toUpperCase() === "SCAMPER") {
                      setCurrentPage("scamper");
                    } else if (tool.name.toUpperCase() === "TRIZ") {
                      setCurrentPage("triz");
                    } else if (
                      tool.name === "SIT (Systematic Inventive Thinking)"
                    ) {
                      setCurrentPage("sit");
                    }
                  }}
                >
                  <Card
                    sx={{
                      minHeight: "150px",
                      display: "flex",
                      flexDirection: "column",
                      cursor: tool.active ? "pointer" : "default",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: tool.active ? "scale(1.05)" : "none",
                      },
                      border: tool.active ? "0.1px solid" : "none",
                      borderRadius: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: 1,
                      }}
                    >
                      {(() => {
                        const bgColor = getRandomColor();
                        const textColor = getTextColor(bgColor);
                        return (
                          <Chip
                            disabled={!tool.active}
                            size="small"
                            label={tool.category}
                            sx={{ backgroundColor: bgColor, color: textColor }}
                          />
                        );
                      })()}
                    </Box>

                    <CardContent sx={{ pt: 0 }}>
                      <Typography
                        variant="h6"
                        color={tool.active ? "text.primary" : "text.secondary"}
                      >
                        {tool.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {tool.description}
                      </Typography>
                      {/* <Typography
                      variant="caption"
                      display="block"
                      color={tool.active ? "text.primary" : "text.secondary"}
                    >
                      <strong>Origin:</strong> {tool.origin}
                    </Typography> */}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>
      )}

      <Fab
        color="secondary"
        sx={{ position: "fixed", bottom: 50, right: 30 }}
        onClick={() => topRef.current.scrollIntoView({ behavior: "smooth" })}
      >
        <VerticalAlignTopIcon />
      </Fab>

      {currentPage === "scamper" && <SCAMPER />}
      {currentPage === "triz" && <TRIZ />}
      {currentPage === "sit" && <SIT />}
    </>
  );
};

export default InnovationTools;
