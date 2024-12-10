import { useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

import TargetForm from "./TargetForm";
import { useSharePointData } from "../../data/sharepointData";

export default function TargetHighlight() {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [formYear, setFormYear] = useState(null);
  const { listData } = useSharePointData();
  const { myinfo, target } = listData;
  const currentYear = new Date().getFullYear();
  const currentYearTarget = target.filter((item) => item.year === currentYear);

  const handleAddFormOpen = (year) => {
    setOpenAdd(true);
    setFormYear(year);
  };

  const handleUpdateFormOpen = (year) => {
    setOpenUpdate(true);
    setFormYear(year);
  };

  return (
    <>
      <Card variant="outlined" sx={{ height: "18vh", flexGrow: 1 }}>
        <CardContent>
          <InsightsRoundedIcon />
          <Typography variant="subtitle2" sx={{ fontWeight: "600" }}>
            {currentYearTarget.length == 0 ? `Submit Now!` : `Thank You!`}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {currentYearTarget.length == 0
              ? `${currentYear} Target for ${myinfo[0].site} ${myinfo[0].domain} still empty.`
              : `${currentYear} Target for ${myinfo[0].site} ${myinfo[0].domain} is present.`}
          </Typography>
          {(myinfo[0].role.includes("Manager") ||
            myinfo[0].role.includes("Innovation")) && (
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
                onClick={() =>
                  target.filter((item) => item.year === 2024).length > 0
                    ? handleUpdateFormOpen(2024)
                    : handleAddFormOpen(2024)
                }
                disabled={currentYear <= 2024 ? false : true}
              >
                {target.filter((item) => item.year === 2024).length > 0
                  ? "Update"
                  : "Add"}{" "}
                2024 Target
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
                onClick={() =>
                  target.filter((item) => item.year === 2025).length > 0
                    ? handleUpdateFormOpen(2025)
                    : handleAddFormOpen(2025)
                }
                disabled={currentYear <= 2025 ? false : true}
              >
                {target.filter((item) => item.year === 2025).length > 0
                  ? "Update"
                  : "Add"}{" "}
                2025 Target
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <TargetForm
        open={openAdd}
        setOpen={setOpenAdd}
        data={null}
        year={formYear}
      />
      <TargetForm
        open={openUpdate}
        setOpen={setOpenUpdate}
        data={target.filter(
          (item) =>
            item.site === myinfo[0].site &&
            item.domain === myinfo[0].domain &&
            item.year === formYear
        )}
        year={formYear}
      />
    </>
  );
}
