import React, { use, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  CardActionArea,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";

import "./Overview.css";
import usePerformanceStore from "../../stores/PerformanceStore";
import useCommitmentStore from "../../stores/CommitmentStore";
import useSubmissionStore from "../../stores/SubmissionStore";
import useTargetStore from "../../stores/TargetStore";

export default function OverviewPerformance() {
  const oriCommitments = useCommitmentStore
    .getState()
    .lists.find((x) => x.year === 2025).data;
  const oriTargets = useTargetStore
    .getState()
    .lists.find((x) => x.year === 2025).data;
  const oriSubmissions = useSubmissionStore
    .getState()
    .lists.find((x) => x.year === 2025).data;
  const commitments = usePerformanceStore((state) => state.commitmentData);
  const submissions = usePerformanceStore((state) => state.submissionData);
  const targets = usePerformanceStore((state) => state.targetData);

  useEffect(() => {
    const cQuarterData = useCommitmentStore
      .getState()
      .getQuarterCommitments(
        useCommitmentStore.getState().lists.find((x) => x.year === 2025).data
      );
    const cTotalData = useCommitmentStore
      .getState()
      .getTotalCommitments(
        useCommitmentStore.getState().lists.find((x) => x.year === 2025).data
      );
    usePerformanceStore.getState().setCommitmentQuarterData(cQuarterData);
    usePerformanceStore.getState().setCommitmentTotalData(cTotalData);

    const sQuarterData = useSubmissionStore
      .getState()
      .getQuarterSubmissions(
        useSubmissionStore.getState().lists.find((x) => x.year === 2025).data
      );
    const sTotalData = useSubmissionStore
      .getState()
      .getTotalSubmissions(
        useSubmissionStore.getState().lists.find((x) => x.year === 2025).data
      );
    usePerformanceStore.getState().setSubmissionQuarterData(sQuarterData);
    usePerformanceStore.getState().setSubmissionTotalData(sTotalData);

    const tQuarterData = useTargetStore
      .getState()
      .getQuarterTargets(
        useTargetStore.getState().lists.find((x) => x.year === 2025).data
      );
    const tTotalData = useTargetStore
      .getState()
      .getTotalTargets(
        useTargetStore.getState().lists.find((x) => x.year === 2025).data
      );
    usePerformanceStore.getState().setTargetQuarterData(tQuarterData);
    usePerformanceStore.getState().setTargetTotalData(tTotalData);
  }, [oriCommitments, oriTargets, oriSubmissions]);

  return (
    <Grid container spacing={1} columns={12}>
      <Grid size={12} className="perf-header" sx={{ justifyItems: "center" }}>
        <Typography variant="h6">2025 Intel Flex Global Performance</Typography>
      </Grid>
      <Grid size={6}>
        <Card variant="outlined" sx={{ minHeight: 250, flexGrow: 1 }}>
          <CardContent sx={{ paddingBottom: "10px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography component="h2" variant="subtitle2">
                Total Commitments vs. Targets Performance
              </Typography>
              <Typography variant="h4" component="p">
                {commitments.total.Sum_Primary} / {targets.total.Sum}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="overline">Conferences</Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: 0,
                  mt: -2,
                }}
              >
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (commitments.total.Conferences_Primary /
                        targets.total.Conference) *
                      100
                    }
                  />
                </Box>
                <Box
                  sx={{
                    minWidth: 50,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {`${commitments.total.Conferences_Primary} / ${targets.total.Conference}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="overline">IDF</Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: 0,
                  mt: -2,
                }}
              >
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (commitments.total.IDF_Primary / targets.total.IDF) * 100
                    }
                  />
                </Box>
                <Box
                  sx={{
                    minWidth: 50,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {`${commitments.total.IDF_Primary} / ${targets.total.IDF}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="overline">Initiatives</Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: 0,
                  mt: -2,
                }}
              >
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (commitments.total.Initiatives_Primary /
                        targets.total.POC_x002f_Pitching) *
                      100
                    }
                  />
                </Box>
                <Box
                  sx={{
                    minWidth: 50,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {`${commitments.total.Initiatives_Primary} / ${targets.total.POC_x002f_Pitching}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="overline">Micro Innovation</Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: 0,
                  mt: -2,
                }}
              >
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (commitments.total.MicroInnovation_Primary /
                        targets.total.Micro_x002d_Innovation) *
                      100
                    }
                  />
                </Box>
                <Box
                  sx={{
                    minWidth: 50,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {`${commitments.total.MicroInnovation_Primary} / ${targets.total.Micro_x002d_Innovation}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="overline">Open Source</Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: 0,
                  mt: -2,
                }}
              >
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (commitments.total.OpenSource_Primary /
                        targets.total.OpenSource) *
                      100
                    }
                  />
                </Box>
                <Box
                  sx={{
                    minWidth: 50,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {`${commitments.total.OpenSource_Primary} / ${targets.total.OpenSource}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={6}>
        <Card variant="outlined" sx={{ minHeight: 250, flexGrow: 1 }}>
          <CardContent sx={{ paddingBottom: "10px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography component="h2" variant="subtitle2">
                Total Submissions vs. Targets Performance
              </Typography>
              <Typography variant="h4" component="p">
                {submissions.total.Sum} / {targets.total.Sum}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="overline">Conferences</Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: 0,
                  mt: -2,
                }}
              >
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (submissions.total.Conferences /
                        targets.total.Conference) *
                      100
                    }
                  />
                </Box>
                <Box
                  sx={{
                    minWidth: 50,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {`${submissions.total.Conferences} / ${targets.total.Conference}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="overline">IDF</Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: 0,
                  mt: -2,
                }}
              >
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(submissions.total.IDF / targets.total.IDF) * 100}
                  />
                </Box>
                <Box
                  sx={{
                    minWidth: 50,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {`${submissions.total.IDF} / ${targets.total.IDF}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="overline">Initiatives</Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: 0,
                  mt: -2,
                }}
              >
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (submissions.total.Initiatives /
                        targets.total.POC_x002f_Pitching) *
                      100
                    }
                  />
                </Box>
                <Box
                  sx={{
                    minWidth: 50,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {`${submissions.total.Initiatives} / ${targets.total.POC_x002f_Pitching}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="overline">Micro Innovation</Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: 0,
                  mt: -2,
                }}
              >
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (submissions.total["Micro-Innovation"] /
                        targets.total.Micro_x002d_Innovation) *
                      100
                    }
                  />
                </Box>
                <Box
                  sx={{
                    minWidth: 50,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {`${submissions.total["Micro-Innovation"]} / ${targets.total.Micro_x002d_Innovation}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="overline">Open Source</Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: 0,
                  mt: -2,
                }}
              >
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (submissions.total["Open Source"] /
                        targets.total.OpenSource) *
                      100
                    }
                  />
                </Box>
                <Box
                  sx={{
                    minWidth: 50,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {`${submissions.total["Open Source"]} / ${targets.total.OpenSource}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
