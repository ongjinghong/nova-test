import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTheme } from "@mui/material/styles";

import "./Submission.css";
import useSubmissionStore from "../../stores/SubmissionStore";

export default function SubmissionDetailsWindow() {
  const theme = useTheme();
  const submissionDetailsOpen = useSubmissionStore(
    (state) => state.submissionDetailsOpen
  );
  const data = useSubmissionStore((state) =>
    state.submissions.find((item) => item.id === state.submissionDetailsID)
  );

  console.log(useSubmissionStore.getState().submissionDetailsID, data);

  const handleCloseDetails = () => {
    useSubmissionStore.getState().closeSubmissionDetailsWindow();
  };

  return (
    <Dialog
      open={submissionDetailsOpen}
      onClose={handleCloseDetails}
      fullWidth
      maxWidth="md"
    >
      <IconButton
        aria-label="close"
        onClick={handleCloseDetails}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[700],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box sx={{ display: "flex", gap: "3px" }}>
          <Chip label={data.Quarter} color="primary" size="small" />
          <Chip label={data.Category} color="secondary" size="small" />
        </Box>

        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <Typography variant="h6">{data.Title}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="overline">
              <b>PROBLEM STATEMENT</b>
            </Typography>
            <Typography
              variant="body2"
              className="details-dialog"
              sx={{
                maxHeight: "200px",
                overflow: "auto",
                textAlign: "justify",
                paddingRight: "10px",
                paddingLeft: "5px",
                borderLeft: "3px solid #0054ae",
              }}
            >
              {data.ProblemStatement}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="overline">
              <b>SOLUTION & BENEFITS</b>
            </Typography>
            <Typography
              variant="body2"
              className="details-dialog"
              sx={{
                maxHeight: "200px",
                overflow: "auto",
                textAlign: "justify",
                paddingRight: "10px",
                paddingLeft: "5px",
                borderLeft: "3px solid #0054ae",
              }}
            >
              {data.SolutionandBenefits}
            </Typography>
          </Grid>
          <Grid size={4}>
            <Divider textAlign="left">
              <Typography
                variant="overline"
                sx={{
                  color: theme.palette.mode === "dark" ? "#039be5" : "#0054ae",
                }}
              >
                ORIGIN
              </Typography>
            </Divider>

            <Stack
              spacing={2}
              sx={{
                borderLeft: "3px solid #0054ae",
                borderRight: "1px",
                borderBottom: "1px",
                paddingLeft: "5px",
              }}
            >
              <Box key="site">
                <Typography variant="caption">Site</Typography>
                {data.Site.map((item) => (
                  <Typography key={item} variant="body2">
                    {item}
                  </Typography>
                ))}
              </Box>
              <Box key="domain">
                <Typography variant="caption">Domain</Typography>
                {data.Domain.map((item) => (
                  <Typography key={item} variant="body2">
                    {item}
                  </Typography>
                ))}
              </Box>
              <Box key="ea">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="caption" sx={{ paddingTop: "2px" }}>
                    EA
                  </Typography>
                  {data.EA ? (
                    <VerifiedIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <CancelIcon fontSize="small" />
                  )}
                </Box>
                <Typography variant="body2">
                  {data.SRNumber === undefined ? "None" : data.SRNumber}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid size={4}>
            <Divider textAlign="left">
              <Typography
                variant="overline"
                sx={{
                  color: theme.palette.mode === "dark" ? "#039be5" : "#0054ae",
                }}
              >
                SUBMISSION DETAILS
              </Typography>
            </Divider>
            <Stack
              spacing={2}
              sx={{
                borderLeft: "3px solid #0054ae",
                borderRight: "1px",
                borderBottom: "1px",
                paddingLeft: "5px",
              }}
            >
              <Box key="status">
                <Typography variant="caption">Status</Typography>
                <Typography variant="body2">{data.Status}</Typography>
              </Box>
              <Box key="platform">
                <Typography variant="caption">Submitted Platform</Typography>
                <Typography variant="body2">
                  {data.SubmissionPlatform}
                </Typography>
              </Box>
              <Box key="platform-id">
                <Typography variant="caption">
                  Submitted Platform's ID
                </Typography>
                <Typography variant="body2">
                  {data.SubmissionPlatformID === undefined
                    ? "Unknown"
                    : data.SubmissionPlatformID}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid size={4}>
            <Divider textAlign="left">
              <Typography
                variant="overline"
                sx={{
                  color: theme.palette.mode === "dark" ? "#039be5" : "#0054ae",
                }}
              >
                AUTHOR DETAILS
              </Typography>
            </Divider>
            <Stack
              spacing={2}
              sx={{
                borderLeft: "3px solid #0054ae",
                borderRight: "1px",
                borderBottom: "1px",
                paddingLeft: "5px",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">Primary Author</Typography>
                <Chip
                  avatar={
                    <Avatar
                      alt={data.PrimaryAuthor}
                      // src={author1Pic}
                    />
                  }
                  label={data.PrimaryAuthor}
                  variant="outlined"
                  sx={{ width: "fit-content" }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">Secondary Authors</Typography>
                {data.SecondaryAuthors?.map((author) => (
                  <Chip
                    key={author}
                    avatar={
                      <Avatar
                        alt={author}
                        // src={author2Pic[author.LookupId]}
                      />
                    }
                    label={author}
                    variant="outlined"
                    sx={{ width: "fit-content" }}
                  />
                ))}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDetails} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
