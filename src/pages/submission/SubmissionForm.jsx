import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import BasicForm from "./src/BasicForm";
import AuthorForm from "./src/AuthorForm";
import TimelineForm from "./src/TimelineForm";
import { useSharePointData } from "../../data/sharepointData";

const steps = [
  "Basic Details",
  "Author and Related Information",
  "Timeline and Status",
];
function getStepContent(step, data, errors, newData, setNewData, year) {
  switch (step) {
    case 0:
      return (
        <BasicForm
          data={data}
          newData={newData}
          setNewData={setNewData}
          errors={errors}
          // year={year}
        />
      );
    case 1:
      return (
        <AuthorForm
          data={data}
          newData={newData}
          setNewData={setNewData}
          errors={errors}
          // year={year}
        />
      );
    case 2:
      return (
        <TimelineForm
          data={data}
          newData={newData}
          setNewData={setNewData}
          errors={errors}
          year={year}
        />
      );
    default:
      throw new Error("Unknown step");
  }
}

export default function SubmissionForm({ open, setOpen, data, year }) {
  const { token, fetchSubmissionData, addSubmission, updateSubmission } =
    useSharePointData();
  const [activeStep, setActiveStep] = useState(0);
  const [defaultSubmissionData, setDefaultSubmissionData] = useState({
    Title: "",
    ProblemStatement: "",
    SolutionandBenefits: "",
    Category: "",
    EA: null,
    SRNumber: "",
    SubmissionPlatform: "",
    SubmissionID: "",
    PrimaryAuthorLookupId: "",
    SecondaryAuthorLookupId: [],
    Site: [],
    Domain: [],
    Quarter: "",
    Duration: 0,
    Status: "",
    // Future: "",
  });
  const [newSubmissionData, setNewSubmissionData] = useState(
    defaultSubmissionData
  );
  const [errors, setErrors] = useState({});
  const [isTimeoutCleared, setIsTimeoutCleared] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const timeoutIdRef = useRef(null);
  const intervalIdRef = useRef(null);

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
    setNewSubmissionData(defaultSubmissionData);
    clearTimeout(timeoutIdRef.current);
    clearInterval(intervalIdRef.current);
  };

  const validateFields = () => {
    const newErrors = {};
    if (activeStep === 0) {
      if (!newSubmissionData.Title && !data) newErrors.Title = true;
      if (!newSubmissionData.ProblemStatement && !data)
        newErrors.ProblemStatement = true;
      if (!newSubmissionData.SolutionandBenefits && !data)
        newErrors.SolutionandBenefits = true;
      if (!newSubmissionData.Category && !data) newErrors.Category = true;
      if (!newSubmissionData.SubmissionPlatform && !data)
        newErrors.SubmissionPlatform = true;
    } else if (activeStep === 1) {
      if (!newSubmissionData.PrimaryAuthorLookupId && !data)
        newErrors.PrimaryAuthorLookupId = true;
      if (!newSubmissionData.Site.length && !data) newErrors.Site = true;
      if (!newSubmissionData.Domain.length && !data) newErrors.Domain = true;
    } else if (activeStep === 2) {
      if (!newSubmissionData.Quarter && !data) newErrors.Quarter = true;
      if (newSubmissionData.Duration <= 0) newErrors.Duration = true;
      if (!newSubmissionData.Status && !data) newErrors.Status = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateFields()) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      if (!data) {
        console.log("add new submission", newSubmissionData);
        const response = await addSubmission(token, newSubmissionData, year);
        if (response === "Item created successfully") {
          setActiveStep(steps.length);
          startCountdown();
          timeoutIdRef.current = setTimeout(() => {
            if (!isTimeoutCleared) {
              fetchSubmissionData(token);
            }
          }, 10000); // 10000 milliseconds = 10 seconds
        }
      } else {
        console.log("update submission", newSubmissionData);
        const response = await updateSubmission(
          token,
          data ? data.list_id : "",
          newSubmissionData,
          year
        );
        if (response === "Item updated successfully") {
          setActiveStep(steps.length);
          startCountdown();
          timeoutIdRef.current = setTimeout(() => {
            if (!isTimeoutCleared) {
              fetchSubmissionData(token);
            }
          }, 10000); // 10000 milliseconds = 10 seconds
        }
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Dialog open={open} onClose={handleUpdateClose} fullWidth maxWidth="md">
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
              backgroundColor: "transparent",
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
              {activeStep === steps.length ? (
                <Stack
                  spacing={2}
                  useFlexGap
                  sx={{ alignItems: "center", textAlign: "center" }}
                >
                  <Typography variant="h1">✅</Typography>
                  <Typography variant="h5">
                    Thank you for your {data ? "update" : "submission"}!
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", maxWidth: "500px" }}
                  >
                    Your {year} submission{" "}
                    <strong>&nbsp;#{data.list_id}</strong>
                    <br />
                    <strong>{data.title}</strong>
                    <br />
                    has been {data ? "updated" : "added"}.
                    <br />
                    Keep up the good work!
                  </Typography>
                  <Button variant="contained" onClick={handleUpdateClose}>
                    {countdown > 0
                      ? `Back to Submission Page (${countdown})`
                      : "Back to Submission Page"}
                  </Button>
                </Stack>
              ) : (
                <React.Fragment>
                  {getStepContent(
                    activeStep,
                    data,
                    errors,
                    newSubmissionData,
                    setNewSubmissionData,
                    year
                  )}
                </React.Fragment>
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
