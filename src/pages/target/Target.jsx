import React, { useState, useEffect } from "react";
import { useSharePointData } from "../../data/sharepointData";
import { Box, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";

import "./Target.css";
import FilterPanel from "../../components/filter/filter";
import TotalTargetCard from "./TotalTargetCard";
import PerformanceCard from "../../components/card/PerformanceCard";
import CategoryCard from "../../components/card/CategoryCard";
import TotalTargetBarChart from "./TotalTargetBarChart";
import TargetDetails from "./TargetDetails";
import TargetHighlight from "./TargetHighlight";
import { getCurrentYear, getLast30Days } from "../../utils/GeneralUtils";

const Target = () => {
  const { listData } = useSharePointData();
  const { target, member, submission, commitment } = listData; // Ensure member is defined and imported if necessary

  const [filteredTarget, setFilteredTarget] = useState(target);
  const [filteredMember, setFilteredMember] = useState(member);
  const [filteredCommitment, setFilteredCommitment] = useState(commitment);
  const [filteredSubmission, setFilteredSubmission] = useState(submission);
  const [managerFilter, setManagerFilter] = useState([]); // must present to prevent infinity loop in filter when not used

  const getCategorySum = (category) => {
    return filteredTarget.reduce((sum, item) => sum + (item[category] || 0), 0);
  };

  const getDiff = (submissionCategory, targetCategory) => {
    let diff =
      getCategorySum(targetCategory) -
      filteredSubmission.filter((item) => item.category === submissionCategory)
        .length;
    if (diff < 0) {
      diff = 0;
    }
    return diff;
  };

  return (
    <Box className="target-container">
      <Box className="target-filter">
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
              data={target}
              setData={setFilteredTarget}
              memberData={member}
              setMemberData={setFilteredMember}
              managerMode={managerFilter}
              compareData={submission}
              setCompareData={setFilteredSubmission}
              compareSecondData={commitment}
              setCompareSecondData={setFilteredCommitment}
            />
          </Stack>
        </Stack>
      </Box>

      <Box className="target-content">
        <Grid container spacing={2} columns={12}>
          {/* First row */}
          <Grid size={3}>
            <TotalTargetCard
              data={filteredTarget}
              last30Days={getLast30Days(false)}
            />
          </Grid>
          <Grid size={3}>
            <PerformanceCard
              data={filteredTarget}
              dataType="Target"
              secondData={filteredSubmission}
              secondDataType="Submission"
              last30Days={getLast30Days(false)}
            />
          </Grid>
          <Grid size={3}>
            <PerformanceCard
              data={filteredTarget}
              dataType="Target"
              secondData={filteredCommitment}
              secondDataType="Commitment"
              last30Days={getLast30Days(false)}
            />
          </Grid>
          <Grid size={3}>
            <TargetHighlight />
          </Grid>

          {/* Second row */}
          <Grid size={2}>
            <CategoryCard
              data={getCategorySum("conferences")}
              dataType="Target"
              categoryName="Conference"
              diff={getDiff("Conferences", "conferences")}
              completion={true}
            />
          </Grid>
          <Grid size={2}>
            <CategoryCard
              data={getCategorySum("idf")}
              dataType="Target"
              categoryName="IDF"
              diff={getDiff("IDF", "idf")}
              completion={true}
            />
          </Grid>
          <Grid size={2}>
            <CategoryCard
              data={getCategorySum("initiatives")}
              dataType="Target"
              categoryName="Initiative"
              diff={getDiff("Initiatives", "initiatives")}
              completion={true}
            />
          </Grid>
          <Grid size={2}>
            <CategoryCard
              data={getCategorySum("microinnovation")}
              dataType="Target"
              categoryName="Micro Innovation"
              diff={getDiff("Micro-Innovation", "microinnovation")}
              completion={true}
            />
          </Grid>
          <Grid size={2}>
            <CategoryCard
              data={getCategorySum("opensource")}
              dataType="Target"
              categoryName="Open Source"
              diff={getDiff("Open Source", "opensource")}
              completion={true}
            />
          </Grid>
          <Grid size={2}>
            <CategoryCard
              data={getCategorySum("knowledgesharing")}
              dataType="Target"
              categoryName="Knowledge Sharing"
              diff={getDiff("Knowledge Sharing", "knowledgesharing")}
              completion={true}
            />
          </Grid>

          <Grid size={5}>
            <TotalTargetBarChart data={filteredTarget} />
          </Grid>
          <Grid size={7}>
            <TargetDetails data={filteredTarget} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Target;
