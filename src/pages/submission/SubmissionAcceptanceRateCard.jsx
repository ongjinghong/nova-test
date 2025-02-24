import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import useSubmissionStore from "../../stores/SubmissionStore";

export default function SubmissionAcceptanceRateCard() {
  const data = useSubmissionStore((state) => state.filteredSubmissions);
  const acceptedSubmissions = useSubmissionStore(
    (state) => state.acceptedSubmissions
  );
  const totalSubmissions = useSubmissionStore(
    (state) => state.totalSubmissions
  );

  useEffect(() => {
    useSubmissionStore.getState().getAcceptedSubmissions();
  }, [data]);

  return (
    <Card variant="outlined" sx={{ height: "100%", width: "100%" }}>
      <CardContent sx={{ paddingBottom: "10px" }}>
        <Typography component="h2" variant="subtitle2" sx={{ mb: 1 }}>
          Acceptance Rate
        </Typography>
        <Grid container columns={12}>
          <Grid
            size={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="caption">Conferences</Typography>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                size={80}
                thickness={6}
                value={100}
                sx={{ color: "#e0e0e0", position: "absolute" }}
              />
              <CircularProgress
                variant="determinate"
                size={80}
                thickness={6}
                value={
                  (acceptedSubmissions.Conferences /
                    totalSubmissions.Conferences) *
                    100 || 0
                }
                color={
                  (acceptedSubmissions.Conferences /
                    totalSubmissions.Conferences) *
                    100 >=
                  50
                    ? "success"
                    : "warning"
                }
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="button"
                  sx={{
                    color: "text.secondary",
                    textAlign: "center",
                    marginBottom: -0.5,
                  }}
                >
                  {`${Math.round(
                    (acceptedSubmissions.Conferences /
                      totalSubmissions.Conferences) *
                      100 || 0
                  )}%`}
                </Typography>
                <Typography
                  variant="caption"
                  fontSize={10}
                  sx={{
                    color: "text.secondary",
                    textAlign: "center",
                  }}
                >
                  {`${acceptedSubmissions.Conferences}/${totalSubmissions.Conferences}`}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid
            size={4}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="caption">IDF</Typography>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                size={80}
                thickness={6}
                value={100}
                sx={{ color: "#e0e0e0", position: "absolute" }}
              />
              <CircularProgress
                variant="determinate"
                size={80}
                thickness={6}
                value={
                  (acceptedSubmissions.IDF / totalSubmissions.IDF) * 100 || 0
                }
                color={
                  (acceptedSubmissions.IDF / totalSubmissions.IDF) * 100 >= 20
                    ? "success"
                    : "warning"
                }
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="button"
                  sx={{
                    color: "text.secondary",
                    textAlign: "center",
                    marginBottom: -0.5,
                  }}
                >
                  {`${Math.round(
                    (acceptedSubmissions.IDF / totalSubmissions.IDF) * 100 || 0
                  )}%`}
                </Typography>
                <Typography
                  variant="caption"
                  fontSize={10}
                  sx={{
                    color: "text.secondary",
                    textAlign: "center",
                  }}
                >
                  {`${acceptedSubmissions.IDF}/${totalSubmissions.IDF}`}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid
            size={4}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="caption">Open Source</Typography>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                size={80}
                thickness={6}
                value={100}
                sx={{ color: "#e0e0e0", position: "absolute" }}
              />
              <CircularProgress
                variant="determinate"
                size={80}
                thickness={6}
                value={
                  (acceptedSubmissions["Open Source"] /
                    totalSubmissions["Open Source"]) *
                    100 || 0
                }
                color={
                  (acceptedSubmissions["Open Source"] /
                    totalSubmissions["Open Source"]) *
                    100 >=
                  75
                    ? "success"
                    : "warning"
                }
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="button"
                  sx={{
                    color: "text.secondary",
                    textAlign: "center",
                    marginBottom: -0.5,
                  }}
                >
                  {`${Math.round(
                    (acceptedSubmissions["Open Source"] /
                      totalSubmissions["Open Source"]) *
                      100 || 0
                  )}%`}
                </Typography>
                <Typography
                  variant="caption"
                  fontSize={10}
                  sx={{
                    color: "text.secondary",
                    textAlign: "center",
                  }}
                >
                  {`${acceptedSubmissions["Open Source"]}/${totalSubmissions["Open Source"]}`}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
