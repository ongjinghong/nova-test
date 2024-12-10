import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormLabel,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { styled } from "@mui/system";

import { useSharePointData } from "../../data/sharepointData";
import CommitmentFormStep from "./CommitmentFormStep";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function CommitmentForm({ open, setOpen, data, year }) {
  const steps = ["Q1", "Q2", "Q3", "Q4"];
  const {
    token,
    listData,
    fetchCommitmentData,
    addCommitment,
    updateCommitment,
  } = useSharePointData();
  const { myinfo } = listData;
  const [activeStep, setActiveStep] = useState(0);
  const [defaultCommitmentData, setDefaultCommitmentData] = useState({
    Conferences_Primary: 0,
    Conferences_Secondary: 0,
    IDF_Primary: 0,
    IDF_Secondary: 0,
    Initiatives_Primary: 0,
    Initiatives_Secondary: 0,
    MicroInnovation_Primary: 0,
    MicroInnovation_Secondary: 0,
    OpenSource_Primary: 0,
    OpenSource_Secondary: 0,
  });
  const [newCommitmentData, setNewCommitmentData] = useState([
    {
      ...defaultCommitmentData,
      Name: myinfo[0].name,
      Email: myinfo[0].email,
      Site: myinfo[0].site,
      Domain: myinfo[0].domain,
      Quarter: "Q1",
    },
    {
      ...defaultCommitmentData,
      Name: myinfo[0].name,
      Email: myinfo[0].email,
      Site: myinfo[0].site,
      Domain: myinfo[0].domain,
      Quarter: "Q2",
    },
    {
      ...defaultCommitmentData,
      Name: myinfo[0].name,
      Email: myinfo[0].email,
      Site: myinfo[0].site,
      Domain: myinfo[0].domain,
      Quarter: "Q3",
    },
    {
      ...defaultCommitmentData,
      Name: myinfo[0].name,
      Email: myinfo[0].email,
      Site: myinfo[0].site,
      Domain: myinfo[0].domain,
      Quarter: "Q4",
    },
  ]);
  const [updateCommitmentID, setUpdateCommitmentID] = useState([]);
  const [isTimeoutCleared, setIsTimeoutCleared] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const timeoutIdRef = useRef(null);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    if (data && data.length === 4) {
      const updatedCommitmentData = data.map((item, index) => ({
        ...defaultCommitmentData,
        Conferences_Primary:
          item.conf || defaultCommitmentData.Conferences_Primary,
        Conferences_Secondary:
          item.conf2 || defaultCommitmentData.Conferences_Secondary,
        IDF_Primary: item.idf || defaultCommitmentData.IDF_Primary,
        IDF_Secondary: item.idf2 || defaultCommitmentData.IDF_Secondary,
        Initiatives_Primary:
          item.init || defaultCommitmentData.Initiatives_Primary,
        Initiatives_Secondary:
          item.init2 || defaultCommitmentData.Initiatives_Secondary,
        MicroInnovation_Primary:
          item.uinvt || defaultCommitmentData.MicroInnovation_Primary,
        MicroInnovation_Secondary:
          item.uinvt2 || defaultCommitmentData.MicroInnovation_Secondary,
        OpenSource_Primary:
          item.opensrc || defaultCommitmentData.OpenSource_Primary,
        OpenSource_Secondary:
          item.opensrc2 || defaultCommitmentData.OpenSource_Secondary,
        Name: myinfo[0].name,
        Email: myinfo[0].email,
        Site: myinfo[0].site,
        Domain: myinfo[0].domain,
        Quarter: `Q${index + 1}`,
      }));
      const updatedCommitmentID = data.map((item) => item.list_id);
      setNewCommitmentData(updatedCommitmentData);
      setUpdateCommitmentID(updatedCommitmentID);
    }
  }, [data, defaultCommitmentData, myinfo]);

  const startCountdown = () => {
    setCountdown(10);
    intervalIdRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(intervalIdRef.current);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const handleUpdateClose = () => {
    setOpen(false);
    setActiveStep(0);
    setNewCommitmentData([
      defaultCommitmentData,
      defaultCommitmentData,
      defaultCommitmentData,
      defaultCommitmentData,
    ]);
    clearTimeout(timeoutIdRef.current);
    clearInterval(intervalIdRef.current);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (!data) {
      console.log("add new commitment", newCommitmentData);
      const response = await addCommitment(token, newCommitmentData, year);
      if (response.every((res) => res === "Item created successfully")) {
        setActiveStep(steps.length);
        startCountdown();
        timeoutIdRef.current = setTimeout(() => {
          if (!isTimeoutCleared) {
            fetchCommitmentData(token);
          }
        }, 10000); // 10000 milliseconds = 10 seconds
      }
    } else {
      console.log("update commitment", newCommitmentData);
      const response = await updateCommitment(
        token,
        updateCommitmentID,
        newCommitmentData,
        year
      );
      if (response.every((res) => res === "Item updated successfully")) {
        setActiveStep(steps.length);
        startCountdown();
        timeoutIdRef.current = setTimeout(() => {
          if (!isTimeoutCleared) {
            fetchCommitmentData(token);
          }
        }, 10000); // 10000 milliseconds = 10 seconds
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleUpdateClose} maxWidth="sm">
      <IconButton
        aria-label="close"
        onClick={handleUpdateClose}
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
        <Grid container columns={12}>
          <Grid
            size={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              backgroundColor: { xs: "transparent", sm: "background.default" },
              alignItems: "start",
              pt: 4,
              px: 2,
              gap: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                flexGrow: 1,
                width: "100%",
              }}
            >
              <Stepper
                id="submission-stepper"
                activeStep={activeStep}
                sx={{ width: "100%", height: 40 }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{
                      ":first-of-type": { pl: 0 },
                      ":last-child": { pr: 2 },
                    }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                width: "100%",
                gap: { xs: 5, md: "none" },
              }}
            >
              {activeStep === steps.length && (
                <Stack
                  spacing={2}
                  useFlexGap
                  sx={{ alignItems: "center", textAlign: "center" }}
                >
                  <Typography variant="h1">✅</Typography>
                  <Typography variant="h5">
                    Thank you for your {data ? "update" : "commitment"}!
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", maxWidth: "500px" }}
                  >
                    Your {year} commitment <br />
                    has been {data ? "updated" : "added"}.
                    <br />
                    Looking forward for your innovation!
                  </Typography>
                  <Button variant="contained" onClick={handleUpdateClose}>
                    {countdown > 0
                      ? `Back to Commitment Page (${countdown})`
                      : "Back to Commitment Page"}
                  </Button>
                </Stack>
              )}
              {activeStep == 0 && (
                <CommitmentFormStep
                  quarter={0}
                  newData={newCommitmentData}
                  setNewData={setNewCommitmentData}
                />
              )}
              {activeStep == 1 && (
                <CommitmentFormStep
                  quarter={1}
                  newData={newCommitmentData}
                  setNewData={setNewCommitmentData}
                />
              )}
              {activeStep == 2 && (
                <CommitmentFormStep
                  quarter={2}
                  newData={newCommitmentData}
                  setNewData={setNewCommitmentData}
                />
              )}
              {activeStep == 3 && (
                <CommitmentFormStep
                  quarter={3}
                  newData={newCommitmentData}
                  setNewData={setNewCommitmentData}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      {activeStep !== steps.length ? (
        <DialogActions>
          <Box
            sx={[
              {
                display: "flex",
                flexDirection: { xs: "column-reverse", sm: "row" },
                alignItems: "end",
                flexGrow: 1,
                gap: 1,
                pt: 2,
                px: 4,
                pb: 4,
              },
              activeStep !== 0
                ? { justifyContent: "space-between" }
                : { justifyContent: "flex-end" },
            ]}
          >
            {activeStep !== 0 && (
              <Button
                startIcon={<ChevronLeftRoundedIcon />}
                onClick={handleBack}
                variant="text"
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                Previous
              </Button>
            )}
            <Button
              variant="contained"
              endIcon={<ChevronRightRoundedIcon />}
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNext
              }
              sx={{ width: "fit-content" }}
            >
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </Box>
        </DialogActions>
      ) : null}
    </Dialog>
  );
}
