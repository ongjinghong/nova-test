import { useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

import SubmissionForm from "./SubmissionForm";

export default function HighlightedCard() {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [formYear, setFormYear] = useState(2024);

  const handleFormOpen = (year) => {
    setOpenUpdate(true);
    setFormYear(year);
  };

  return (
    <>
      <Card variant="outlined" sx={{ height: "18vh", flexGrow: 1 }}>
        <CardContent>
          <InsightsRoundedIcon />
          <Typography variant="subtitle2" sx={{ fontWeight: "600" }}>
            Submit your Innovation
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Track your innovation using NOVA app today!
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "5px",
              marginTop: "30px",
            }}
          >
            <Button
              variant="contained"
              size="small"
              color="primary"
              endIcon={
                <ChevronRightRoundedIcon
                  sx={{ marginLeft: "-7px", marginRight: "-7px" }}
                />
              }
              sx={{ fontSize: "12px" }}
              onClick={() => handleFormOpen(2024)}
            >
              Add 2024 Submission
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              endIcon={
                <ChevronRightRoundedIcon
                  sx={{ marginLeft: "-7px", marginRight: "-7px" }}
                />
              }
              sx={{ fontSize: "12px" }}
              onClick={() => handleFormOpen(2025)}
            >
              Add 2025 Submission
            </Button>
          </Box>
        </CardContent>
      </Card>
      <SubmissionForm
        open={openUpdate}
        setOpen={setOpenUpdate}
        data={null}
        year={formYear}
      />
    </>
  );
}
