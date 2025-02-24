import React, { useEffect } from "react";
import { Box, Button, Fab } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import "./Submission.css";
import useAppStore from "../../stores/AppStore";
import useSubmissionStore from "../../stores/SubmissionStore";
import SubmissionFilter from "./SubmissionFilter";
import SubmissionTotalStatCard from "./SubmissionTotalStatCard";
import SubmissionParticipantRatioStatCard from "./SubmissionParticipantRatioStatCard";
import SubmissionCategoryBarChart from "./SubmissionCategoryBarChart";
import SubmissionMonthlyBarChart from "./SubmissionMonthlyBarChart";
import SubmissionDetailsTable from "./SubmissionDetailsTable";
import SubmissionForm from "./SubmissionForm";
import SubmissionDetailsWindow from "./SubmissionDetailsWindow";
import SubmissionAcceptanceRateCard from "./SubmissionAcceptanceRateCard";
import { exportSubmissionCSV } from "../../utils/Helpers";

const Submission = () => {
  const currentYear = useAppStore((state) => state.currentYear);
  const appMode = useAppStore((state) => state.appMode);
  const lists = useSubmissionStore((state) => state.lists);
  const getSubmissions = useSubmissionStore((state) => state.getSubmissions);
  const submissionDetailsOpen = useSubmissionStore(
    (state) => state.submissionDetailsOpen
  );
  const submissionFormOpen = useSubmissionStore(
    (state) => state.submissionFormOpen
  );

  useEffect(() => {
    lists.forEach(async (item) => {
      if (item.year !== currentYear && item.data.length === 0) {
        await getSubmissions(item.year);
      }
    });
  }, []);

  const handleAddClick = () => {
    useSubmissionStore.getState().openSubmissionForm();
    useSubmissionStore.getState().resetSubmissionFormPage();
    useSubmissionStore.getState().setSubmissionFormType("Add");
  };

  const handleDownloadClick = () => {
    exportSubmissionCSV();
  };

  return (
    <Box className="submission-container">
      <Box className="submission-filter">
        <FilterAltIcon />
        <SubmissionFilter />
        <Box display="flex" flexDirection="column" width="fit-content">
          <Button
            className="form-button"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{ minWidth: "fit-content" }}
          >
            Add {currentYear} Submission
          </Button>
        </Box>
      </Box>
      <Box className="submission-content">
        <Grid container spacing={2} columns={12}>
          <Grid size={4}>
            <SubmissionTotalStatCard />
          </Grid>
          <Grid size={4}>
            <SubmissionParticipantRatioStatCard />
          </Grid>
          <Grid size={4}>
            <SubmissionAcceptanceRateCard />
          </Grid>
          <Grid size={7}>
            <SubmissionCategoryBarChart />
          </Grid>
          <Grid size={5}>
            <SubmissionMonthlyBarChart />
          </Grid>
          <Grid size={12}>
            <SubmissionDetailsTable />
          </Grid>
        </Grid>
      </Box>

      {(appMode === "Innovation" || appMode === "Manager") && (
        <Fab
          variant="extended"
          color="secondary"
          sx={{ position: "fixed", bottom: 50, right: 30 }}
          onClick={handleDownloadClick}
        >
          <FileDownloadIcon />
          Download CSV
        </Fab>
      )}

      {submissionDetailsOpen && <SubmissionDetailsWindow />}
      {submissionFormOpen && <SubmissionForm />}
    </Box>
  );
};

export default Submission;
