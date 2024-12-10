import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Card,
  CardContent,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useSharePointData } from "../../data/sharepointData";
import CommitmentForm from "./CommitmentForm";
import { getCurrentYear, getCurrentQuarter } from "../../utils/GeneralUtils";

const MyCommitmentCard = ({ expand }) => {
  const { listData } = useSharePointData();
  const { mycommitment } = listData;
  const currentYear = getCurrentYear();
  const currentQuarter = getCurrentQuarter();
  const mycommitmentCurrentYear = mycommitment
    .filter((item) => item.year === parseInt(currentYear))
    .sort(
      (a, b) =>
        parseInt(a.quarter.substring(1)) - parseInt(b.quarter.substring(1))
    );
  const [openUpdate, setOpenUpdate] = useState(false);

  const handleUpdateClick = () => {
    setOpenUpdate(true);
  };

  return (
    <>
      <Card variant="outlined">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexGrow: 1,
            paddingLeft: "15px",
            paddingTop: "15px",
            paddingRight: "15px",
            alignItems: "center",
          }}
        >
          <Chip
            key="personal-commit"
            label="PERSONAL COMMITMENT"
            size="small"
          />
          <Button
            variant="contained"
            size="small"
            endIcon={<EditIcon />}
            sx={{ fontSize: "10px" }}
            onClick={handleUpdateClick}
          >
            Update
          </Button>
        </Box>

        <CardContent>
          {mycommitmentCurrentYear.length > 0 && (
            <Stack direction="column" spacing={1}>
              {mycommitmentCurrentYear.map((comm) => (
                <Accordion
                  key={comm.quarter}
                  sx={{ width: "100%" }}
                  defaultExpanded={
                    expand
                      ? comm.quarter === currentQuarter.toString() ||
                        comm.quarter === `Q${currentQuarter}`
                        ? true
                        : false
                      : false
                  }
                >
                  <AccordionSummary
                    key={comm.quarter}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`quarter${comm.quarter}-content`}
                    id={`quarter${comm.quarter}-header`}
                  >
                    <Typography className="mycommitment-title">
                      {currentYear == 2024 ? "Q" : ""}
                      {comm.quarter}
                    </Typography>

                    <Typography className="mycommitment-value">
                      <PersonIcon />
                      {comm.conf +
                        comm.idf +
                        comm.init +
                        comm.uinvt +
                        comm.opensrc}{" "}
                    </Typography>
                    <Typography className="mycommitment-value">
                      <PeopleIcon />{" "}
                      {comm.conf2 +
                        comm.idf2 +
                        comm.init2 +
                        comm.uinvt2 +
                        comm.opensrc2}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    key={comm.quarter}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "90%",
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <Typography className="mycommitment-title">
                        Conference:
                      </Typography>
                      <Typography className="mycommitment-details-value">
                        {comm.conf}
                      </Typography>
                      <Typography className="mycommitment-details-value">
                        {comm.conf2}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <Typography className="mycommitment-title">
                        IDF:
                      </Typography>
                      <Typography className="mycommitment-details-value">
                        {comm.idf}
                      </Typography>
                      <Typography className="mycommitment-details-value">
                        {comm.idf2}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <Typography className="mycommitment-title">
                        Initiatives:{" "}
                      </Typography>
                      <Typography className="mycommitment-details-value">
                        {comm.init}{" "}
                      </Typography>
                      <Typography className="mycommitment-details-value">
                        {comm.init2}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <Typography className="mycommitment-title">
                        Micro Innovation:{" "}
                      </Typography>
                      <Typography className="mycommitment-details-value">
                        {comm.uinvt}{" "}
                      </Typography>
                      <Typography className="mycommitment-details-value">
                        {comm.uinvt2}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <Typography className="mycommitment-title">
                        Open Source:{" "}
                      </Typography>
                      <Typography className="mycommitment-details-value">
                        {comm.opensrc}
                      </Typography>
                      <Typography className="mycommitment-details-value">
                        {" "}
                        {comm.opensrc2}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <CommitmentForm
        open={openUpdate}
        setOpen={setOpenUpdate}
        data={mycommitmentCurrentYear}
        year={currentYear}
      />
    </>
  );
};

export default MyCommitmentCard;
