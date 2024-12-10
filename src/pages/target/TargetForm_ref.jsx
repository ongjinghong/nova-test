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

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function TargetForm({ open, setOpen, data, year }) {
  console.log("-----------WS Target Form page is triggered----------");
  console.log("ws target form data tf.jsx:", data);
  const steps = ["Q1", "Q2", "Q3", "Q4"];
  const { token, listData, fetchTargetData, addTarget, updateTarget } =
    useSharePointData();
  const { myinfo } = listData;
  console.log("WS currentYear tf.jsx:", year);
  const [activeStep, setActiveStep] = useState(0);
  const defaultTargetDataRef = useRef({
    Conference: 0,
    IDF: 0,
    POC_x002f_Pitching: 0,
    Micro_x002d_Innovation: 0,
    OpenSource: 0,
    Site: myinfo[0].site,
    Domain: myinfo[0].domain,
  });
  const newTargetDataRef = useRef([
    {
      ...defaultTargetDataRef.current,
      Quarter: "1",
    },
    {
      ...defaultTargetDataRef.current,
      Quarter: "2",
    },
    {
      ...defaultTargetDataRef.current,
      Quarter: "3",
    },
    {
      ...defaultTargetDataRef.current,
      Quarter: "4",
    },
  ]);
  const [updateTargetID, setUpdateTargetID] = useState([]);
  const [isTimeoutCleared, setIsTimeoutCleared] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const timeoutIdRef = useRef(null);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    console.log("ws tf useEffect triggered with data:", data);
    if (data && data.length === 4) {
      const updatedTargetData = data.map((item, index) => ({
        Conference: item.conferences || 0,
        IDF: item.idf || 0,
        POC_x002f_Pitching: item.initiatives || 0,
        Micro_x002d_Innovation: item.microinnovation || 0,
        OpenSource: item.opensource || 0,
        Site: item.site || myinfo[0].site,
        Domain: item.domain || myinfo[0].domain,
        Quarter: `${index + 1}`,
      }));
      const updatedTargetID = data.map((item) => item.list_id);
      console.log("ws useeffect Updated Target Data tf.jsx:", updatedTargetData);
      newTargetDataRef.current = updatedTargetData;
      setUpdateTargetID(updatedTargetID);
    } else {
      // Reset to default target data if no data is provided
      newTargetDataRef.current = [
        { ...defaultTargetDataRef.current, Quarter: "1" },
        { ...defaultTargetDataRef.current, Quarter: "2" },
        { ...defaultTargetDataRef.current, Quarter: "3" },
        { ...defaultTargetDataRef.current, Quarter: "4" },
      ];
      setUpdateTargetID([]);
    }
    console.log("ws use effect newTargetData tf.jsx", newTargetDataRef.current);
  }, [data, myinfo]);

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
    newTargetDataRef.current = [
      { ...defaultTargetDataRef.current, Quarter: "1" },
      { ...defaultTargetDataRef.current, Quarter: "2" },
      { ...defaultTargetDataRef.current, Quarter: "3" },
      { ...defaultTargetDataRef.current, Quarter: "4" },
    ];
    setUpdateTargetID([]);
    clearTimeout(timeoutIdRef.current);
    clearInterval(intervalIdRef.current);
    console.log("ws handleUpdateClose target form tf.jsx");
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (!data) {
      console.log("add new target", newTargetDataRef.current);
      const response = await addTarget(token, newTargetDataRef.current, year);
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
      console.log("update Target", newTargetDataRef.current);
      console.log("update ID", updateTargetID);
      const response = await updateTarget(
        token,
        updateTargetID,
        newTargetDataRef.current,
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
                    {year} Target for {newTargetDataRef.current[0].Site}{" "}
                    {newTargetDataRef.current[0].Domain} <br />
                    has been {data ? "updated" : "added"}.
                    <br />
                    <br />
                  </Typography>
                  <Button variant="contained" onClick={handleUpdateClose}>
                    {countdown > 0
                      ? `Back to Target Page (${countdown})`
                      : "Back to Target Page"}
                  </Button>
                </Stack>
              )}
              {activeStep == 0 && (
                <FormStep
                  quarter={0}
                  newData={newTargetDataRef.current}
                  setNewData={(updatedData) => {
                    newTargetDataRef.current = updatedData;
                  }}
                />
              )}
              {activeStep == 1 && (
                <FormStep
                  quarter={1}
                  newData={newTargetDataRef.current}
                  setNewData={(updatedData) => {
                    newTargetDataRef.current = updatedData;
                  }}
                />
              )}
              {activeStep == 2 && (
                <FormStep
                  quarter={2}
                  newData={newTargetDataRef.current}
                  setNewData={(updatedData) => {
                    newTargetDataRef.current = updatedData;
                  }}
                />
              )}
              {activeStep == 3 && (
                <FormStep
                  quarter={3}
                  newData={newTargetDataRef.current}
                  setNewData={(updatedData) => {
                    newTargetDataRef.current = updatedData;
                  }}
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