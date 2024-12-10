import React, { useState, useRef, useEffect } from "react";
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
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { styled } from "@mui/system";

import { useSharePointData } from "../../data/sharepointData";
import FormStep from "./TargetStepForm";

export default function TargetForm({ open, setOpen, data, year }) {
  const steps = ["Q1", "Q2", "Q3", "Q4"];
  const { token, listData, fetchTargetData, addTarget, updateTarget } =
    useSharePointData();
  const { myinfo } = listData;
  const [activeStep, setActiveStep] = useState(-1);
  const [defaultTargetData, setDefaultTargetData] = useState({
    Conference: 0,
    IDF: 0,
    POC_x002f_Pitching: 0,
    Micro_x002d_Innovation: 0,
    OpenSource: 0,
    Site: myinfo[0].site,
    Domain: myinfo[0].domain,
  });
  const [newTargetData, setNewTargetData] = useState([
    {
      ...defaultTargetData,
      Quarter: "1",
    },
    {
      ...defaultTargetData,
      Quarter: "2",
    },
    {
      ...defaultTargetData,
      Quarter: "3",
    },
    {
      ...defaultTargetData,
      Quarter: "4",
    },
  ]);
  const [updateTargetID, setUpdateTargetID] = useState([]);
  const [isTimeoutCleared, setIsTimeoutCleared] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const timeoutIdRef = useRef(null);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      if (data && data.length === 4) {
        const updatedTargetData = data.map((item, index) => ({
          ...defaultTargetData,
          Conference: item.conferences || defaultTargetData.Conference,
          IDF: item.idf || defaultTargetData.IDF,
          POC_x002f_Pitching:
            item.initiatives || defaultTargetData.POC_x002f_Pitching,
          Micro_x002d_Innovation:
            item.microinnovation || defaultTargetData.Micro_x002d_Innovation,
          OpenSource: item.opensource || defaultTargetData.OpenSource,
          Site: item.site || defaultTargetData.Site,
          Domain: item.domain || defaultTargetData.Domain,
          Quarter: `${index + 1}`,
        }));
        const updatedTargetID = data.map((item) => item.list_id);
        setNewTargetData(updatedTargetData);
        setUpdateTargetID(updatedTargetID);
      }
    } else {
      setActiveStep(-1);
    }
  }, [open, data, defaultTargetData]);

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

  const handleFormClose = (refresh) => {
    setOpen(false);
    setNewTargetData([
      { ...defaultTargetData, Quarter: "1" },
      { ...defaultTargetData, Quarter: "2" },
      { ...defaultTargetData, Quarter: "3" },
      { ...defaultTargetData, Quarter: "4" },
    ]);
    clearTimeout(timeoutIdRef.current);
    clearInterval(intervalIdRef.current);
    if (refresh) {
      fetchTargetData(token);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (data.length == 0) {
      console.log("add new target", newTargetData);
      const response = await addTarget(token, newTargetData, year);
      if (response.every((res) => res === "Item created successfully")) {
        setActiveStep(steps.length);
        startCountdown();
        timeoutIdRef.current = setTimeout(() => {
          if (!isTimeoutCleared) {
            fetchTargetData(token);
          }
        }, 10000); // 10000 milliseconds = 10 seconds
      }
    } else {
      console.log("update Target", newTargetData);
      console.log("update ID", updateTargetID);
      const response = await updateTarget(
        token,
        updateTargetID,
        newTargetData,
        year
      );
      if (response.every((res) => res === "Item updated successfully")) {
        setActiveStep(steps.length);
        startCountdown();
        timeoutIdRef.current = setTimeout(() => {
          if (!isTimeoutCleared) {
            fetchTargetData(token);
          }
        }, 10000); // 10000 milliseconds = 10 seconds
      }
    }
  };

  return (
    <Dialog open={open} onClose={() => handleFormClose(false)} maxWidth="sm">
      <IconButton
        aria-label="close"
        onClick={() => handleFormClose(false)}
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
                id="target-stepper"
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
                    Thank you for your {data ? "update" : "Target submission"}!
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", maxWidth: "500px" }}
                  >
                    {year} Target for {newTargetData[0].Site}{" "}
                    {newTargetData[0].Domain} <br />
                    has been {data ? "updated" : "added"}.
                    <br />
                    <br />
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleFormClose(true)}
                  >
                    {countdown > 0
                      ? `Back to Target Page (${countdown})`
                      : "Back to Target Page"}
                  </Button>
                </Stack>
              )}
              {activeStep == 0 && (
                <FormStep
                  quarter={0}
                  newData={newTargetData}
                  setNewData={setNewTargetData}
                />
              )}
              {activeStep == 1 && (
                <FormStep
                  quarter={1}
                  newData={newTargetData}
                  setNewData={setNewTargetData}
                />
              )}
              {activeStep == 2 && (
                <FormStep
                  quarter={2}
                  newData={newTargetData}
                  setNewData={setNewTargetData}
                />
              )}
              {activeStep == 3 && (
                <FormStep
                  quarter={3}
                  newData={newTargetData}
                  setNewData={setNewTargetData}
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
