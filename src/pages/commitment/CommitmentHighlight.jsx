import { useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

import CommitmentForm from "./CommitmentForm";
import { useSharePointData } from "../../data/sharepointData";

export default function CommitmentHighlight() {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [formYear, setFormYear] = useState(2024);
  const { listData } = useSharePointData();
  const { mycommitment } = listData;
  const currentYear = new Date().getFullYear();
  const mycommitmentCurrentYear = mycommitment.filter(
    (item) => item.year === currentYear
  );

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
            {mycommitmentCurrentYear.length == 0
              ? "Submit your commitment"
              : "Thanks for your commitment."}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {mycommitmentCurrentYear.length == 0
              ? "Track your annual innovation commitment/goal with NOVA!"
              : "Looking forward for your innovation submission!"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "5px",
              marginTop: "7%",
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
              onClick={() => handleFormOpen(2025)}
              disabled={currentYear <= 2025 ? false : true}
            >
              Add 2025 Commitment
            </Button>
          </Box>
        </CardContent>
      </Card>
      <CommitmentForm
        open={openUpdate}
        setOpen={setOpenUpdate}
        data={null}
        year={formYear}
      />
    </>
  );
}
