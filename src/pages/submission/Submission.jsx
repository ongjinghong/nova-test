import { useState, useEffect } from "react";
import { Box, Chip, Stack, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid2";

import "./Submission.css";
import HighlightedCard from "./HighlightedCard";
import MonthlySubmissionBarChart from "./MonthlySubmissionBarChart";
import SubmissionCategoryBarChart from "./SubmissionCategoryBarChart";
import CustomizedDataGrid from "./SubmissionDetails";
import { useSharePointData } from "../../data/sharepointData";
import TotalStatCard from "./TotalStatCard";
import RatioStatCard from "./RatioStatCard";
import SitePieChart from "./SitePieChart";
import FilterPanel from "../../components/filter/filter";
import { exportCSV } from "../../utils/SubmissionUtils";

const Submission = () => {
  const { listData } = useSharePointData();
  const { submission, myinfo, member } = listData;
  const [filteredSubmission, setFilteredSubmission] = useState(submission);
  const [filteredMember, setFilteredMember] = useState(member);
  const [managerFilter, setManagerFilter] = useState([]);

  const handleExportClick = () => {
    exportCSV(filteredSubmission, member);
  };

  const handleManagerViewClick = () => {
    const managerName = myinfo[0].name;
    // const managerName = "Koo, Nyuk Kin";
    const lookupIds = member
      .filter((m) => m.manager === managerName)
      .map((m) => m.lookupid);

    setManagerFilter(lookupIds);
  };

  return (
    <Box className="submission-container">
      <Box className="submission-filter">
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={0.5} sx={{ flexGrow: 1 }}>
            <FilterPanel
              data={submission}
              setData={setFilteredSubmission}
              memberData={member}
              setMemberData={setFilteredMember}
              managerMode={managerFilter}
            />
          </Stack>

          {myinfo[0].role.includes("Manager") ||
            (myinfo[0].role.includes("Innovation") && (
              <>
                <Tooltip title="View your direct reports">
                  <Chip label="Manager View" onClick={handleManagerViewClick} />
                </Tooltip>
                <Tooltip title="Export Innovation Details">
                  <Chip label="Download CSV" onClick={handleExportClick} />
                </Tooltip>
              </>
            ))}
        </Stack>
      </Box>
      <Box className="submission-content">
        <Grid container spacing={2} columns={12}>
          <Grid size={9}>
            <Grid container spacing={2} columns={9}>
              <Grid size={3}>
                <TotalStatCard
                  data={filteredSubmission.filter(
                    (submission) => submission.list_id !== "1"
                  )}
                />
              </Grid>
              <Grid size={3}>
                <RatioStatCard
                  data={filteredSubmission.filter(
                    (submission) => submission.list_id !== "1"
                  )}
                  member={filteredMember}
                />
              </Grid>
              <Grid size={3}>
                <HighlightedCard />
              </Grid>
              <Grid size={6}>
                <SubmissionCategoryBarChart
                  data={filteredSubmission.filter(
                    (submission) => submission.list_id !== "1"
                  )}
                />
              </Grid>
              <Grid size={3}>
                <MonthlySubmissionBarChart
                  data={filteredSubmission.filter(
                    (submission) => submission.list_id !== "1"
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={3}>
            <SitePieChart
              data={filteredSubmission.filter(
                (submission) => submission.list_id !== "1"
              )}
            />
          </Grid>
          <Grid size={12}>
            <CustomizedDataGrid data={filteredSubmission} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Submission;
