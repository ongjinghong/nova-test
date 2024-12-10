import React, { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useSharePointData } from "../../data/sharepointData";
import Grid from "@mui/material/Grid2";

import "./Commitment.css";
import CommitmentHighlight from "./CommitmentHighlight";
import MyCommitmentCard from "./MyCommitmentCard";
import FilterPanel from "../../components/filter/filter";
import CategoryCard from "../../components/card/CategoryCard";
import TotalCommitmentBarChart from "./TotalCommitmentBarChart";
import TotalCommitmentCard from "./TotalCommitmentCard";
import PerformanceCard from "../../components/card/PerformanceCard";
import { getCurrentYear, getLast30Days } from "../../utils/GeneralUtils";

const Commitment = () => {
  const { listData } = useSharePointData();
  const { commitment, mycommitment, submission, member } = listData;
  const [filteredCommitment, setFilteredCommitment] = useState(commitment);
  const [filteredMember, setFilteredMember] = useState(member);
  const [filteredSubmission, setFilteredSubmission] = useState(submission);
  const [managerFilter, setManagerFilter] = useState([]); // must present to prevent infinity loop in filter when not used

  const commitCategoryMap = {
    conf: "Conference",
    conf2: "Conference2",
    idf: "IDF",
    idf2: "IDF2",
    init: "Initiatives",
    init2: "Initiatives2",
    uinvt: "Microinnovation",
    uinvt2: "Microinnovation2",
    opensrc: "Opensource",
    opensrc2: "Opensource2",
  };

  return (
    <Box className="commitment-container">
      <Box className="commitment-filter">
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
              data={commitment}
              setData={setFilteredCommitment}
              memberData={member}
              setMemberData={setFilteredMember}
              managerMode={managerFilter}
              compareData={submission}
              setCompareData={setFilteredSubmission}
            />
          </Stack>
        </Stack>
      </Box>

      <Box className="commitment-content">
        <Grid container spacing={2} columns={12}>
          {/* Container for the first, second, and third columns */}
          <Grid size={9}>
            <Grid container columns={15} spacing={2}>
              {/* First row */}
              <Grid size={5}>
                <TotalCommitmentCard
                  data={filteredCommitment}
                  type="Primary"
                  last30Days={getLast30Days(false)}
                />
              </Grid>
              <Grid size={5}>
                <TotalCommitmentCard
                  data={filteredCommitment}
                  type="Secondary"
                  last30Days={getLast30Days(false)}
                />
              </Grid>
              <Grid size={5}>
                <PerformanceCard
                  data={filteredCommitment}
                  dataType="Commitment"
                  secondData={filteredSubmission}
                  secondDataType="Submission"
                  last30Days={getLast30Days(false)}
                />
              </Grid>

              {/* Second row */}
              <Grid size={3}>
                <CategoryCard
                  data={filteredCommitment.reduce(
                    (sum, item) => sum + (item.conf || 0),
                    0
                  )}
                  secondaryData={filteredCommitment.reduce(
                    (sum, item) => sum + (item.conf2 || 0),
                    0
                  )}
                  dataType="Commitment"
                  categoryName="Conference"
                />
              </Grid>
              <Grid size={3}>
                <CategoryCard
                  data={filteredCommitment.reduce(
                    (sum, item) => sum + (item.idf || 0),
                    0
                  )}
                  secondaryData={filteredCommitment.reduce(
                    (sum, item) => sum + (item.idf2 || 0),
                    0
                  )}
                  dataType="Commitment"
                  categoryName="IDF"
                />
              </Grid>
              <Grid size={3}>
                <CategoryCard
                  data={filteredCommitment.reduce(
                    (sum, item) => sum + (item.init || 0),
                    0
                  )}
                  secondaryData={filteredCommitment.reduce(
                    (sum, item) => sum + (item.init2 || 0),
                    0
                  )}
                  dataType="Commitment"
                  categoryName="Initiative"
                />
              </Grid>
              <Grid size={3}>
                <CategoryCard
                  data={filteredCommitment.reduce(
                    (sum, item) => sum + (item.uinvt || 0),
                    0
                  )}
                  secondaryData={filteredCommitment.reduce(
                    (sum, item) => sum + (item.uinvt2 || 0),
                    0
                  )}
                  dataType="Commitment"
                  categoryName="Micro Innovation"
                />
              </Grid>
              <Grid size={3}>
                <CategoryCard
                  data={filteredCommitment.reduce(
                    (sum, item) => sum + (item.opensrc || 0),
                    0
                  )}
                  secondaryData={filteredCommitment.reduce(
                    (sum, item) => sum + (item.opensrc2 || 0),
                    0
                  )}
                  dataType="Commitment"
                  categoryName="Open Source"
                />
              </Grid>

              <Grid size={15}>
                <TotalCommitmentBarChart data={filteredCommitment} />
              </Grid>
            </Grid>
          </Grid>

          {/* Personal Commitment */}
          <Grid size={3}>
            <Grid container columns={3} spacing={2}>
              <Grid size={3}>
                <CommitmentHighlight />
              </Grid>
              <Grid size={3}>
                <MyCommitmentCard expand={true} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Commitment;
