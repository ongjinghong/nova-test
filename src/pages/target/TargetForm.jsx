import React, { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import useAppStore from "../../stores/AppStore";
import useMemberStore from "../../stores/MemberStore";
import useTargetStore from "../../stores/TargetStore";

export default function TargetForm() {
  const { quarters } = useAppStore((state) => state.constants);
  const loginMember = useMemberStore((state) => state.loginMember);
  const targets = useTargetStore((state) => state.targets);
  const targetFormOpen = useTargetStore((state) => state.targetFormOpen);
  const targetFormType = useTargetStore((state) => state.targetFormType);
  const targetsInput = useTargetStore((state) => state.targetsInput);
  const targetFormPage = useTargetStore((state) => state.targetFormPage);
  const handleFormClose = useTargetStore((state) => state.closeTargetForm);

  useEffect(() => {
    if (targetFormOpen) {
      useTargetStore.getState().clearTargetInput();
      if (targetFormType === "Add") {
        quarters.map((quarter) => {
          const newTarget = {
            ...useTargetStore.getState().targetInputTemplate,
          };
          newTarget.Quarter = quarter;
          newTarget.Email = loginMember.Email;
          newTarget.Site = loginMember.Site;
          newTarget.Domain = loginMember.Domain;
          useTargetStore.getState().addTargetInput(newTarget);
        });
      } else if (targetFormType === "Update") {
        targets
          .filter(
            (target) =>
              target.Year === 2025 &&
              target.Site === loginMember.Site &&
              target.Domain === loginMember.Domain
          )
          .map((target) => {
            const newTarget = {
              ...useTargetStore.getState().targetInputTemplate,
            };
            newTarget.id = target.ListID;
            newTarget.Quarter = target.Quarter;
            newTarget.Site = target.Site;
            newTarget.Domain = target.Domain;
            newTarget.Conference = target.Conference;
            newTarget.IDF = target.IDF;
            newTarget.POC_x002f_Pitching = target.POC_x002f_Pitching;
            newTarget.Micro_x002d_Innovation = target.Micro_x002d_Innovation;
            newTarget.OpenSource = target.OpenSource;
            useTargetStore.getState().addTargetInput(newTarget);
          });
      }
    }
  }, [targetFormOpen]);

  const handleInputChange = (event, index, key) => {
    useTargetStore.getState().updateTargetInput(index, key, event.target.value);
  };

  const handleNextPage = () => {
    useTargetStore.getState().nextTargetFormPage();
  };

  const handlePreviousPage = () => {
    useTargetStore.getState().previousTargetFormPage();
  };

  const handleSubmit = () => {
    if (targetFormType === "Add") {
      useTargetStore.getState().addTarget();
    } else if (targetFormType === "Update") {
      useTargetStore.getState().updateTarget();
    }
    useTargetStore.getState().closeTargetForm();
  };

  return (
    <Dialog
      open={targetFormOpen}
      onClose={handleFormClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          component: "form",
        },
      }}
      sx={{ paddingY: 0 }}
    >
      <DialogContent sx={{ paddingY: 6 }}>
        <Stepper
          id="submission-stepper"
          activeStep={targetFormPage}
          sx={{ marginBottom: 4 }}
        >
          {quarters.map((quarter) => (
            <Step key={quarter}>
              <StepLabel>{quarter}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Grid
          container
          columns={12}
          rowSpacing={1}
          columnSpacing={4}
          sx={{ paddingX: 2 }}
        >
          <Grid size={4} sx={{ alignContent: "center" }}>
            <Typography variant="body1">Site</Typography>
          </Grid>
          <Grid size={8}>
            <TextField
              type="text"
              size="small"
              disabled
              fullWidth
              value={loginMember["Site"]}
            />
          </Grid>
          <Grid size={4} sx={{ alignContent: "center" }}>
            <Typography variant="body1">Domain</Typography>
          </Grid>
          <Grid size={8}>
            <TextField
              type="text"
              size="small"
              disabled
              fullWidth
              value={loginMember["Domain"]}
            />
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 4 }} />

        <Box sx={{ justifyItems: "center" }}>
          {targetsInput
            .filter((input, index) => index === targetFormPage)
            .map((input) => (
              <Grid
                key={input.Quarter}
                container
                rowSpacing={2}
                columnSpacing={4}
                columns={12}
                sx={{ width: "75%", justifyContent: "center" }}
              >
                <Grid size={7} sx={{ alignContent: "center" }}>
                  <Typography variant="body1">Conferences</Typography>
                </Grid>
                <Grid size={5}>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={input.Conference}
                    onChange={(event) =>
                      handleInputChange(event, targetFormPage, "Conference")
                    }
                    slotProps={{ htmlInput: { min: 0, max: 25 } }}
                  />
                </Grid>

                <Grid size={7} sx={{ alignContent: "center" }}>
                  <Typography variant="body1">IDF</Typography>
                </Grid>
                <Grid size={5}>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={input.IDF}
                    onChange={(event) =>
                      handleInputChange(event, targetFormPage, "IDF")
                    }
                    slotProps={{ htmlInput: { min: 0, max: 25 } }}
                  />
                </Grid>

                <Grid size={7} sx={{ alignContent: "center" }}>
                  <Typography variant="body1">Initiatives</Typography>
                </Grid>
                <Grid size={5}>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={input.POC_x002f_Pitching}
                    onChange={(event) =>
                      handleInputChange(
                        event,
                        targetFormPage,
                        "POC_x002f_Pitching"
                      )
                    }
                    slotProps={{ htmlInput: { min: 0, max: 25 } }}
                  />
                </Grid>

                <Grid size={7} sx={{ alignContent: "center" }}>
                  <Typography variant="body1">Micro Innovation</Typography>
                </Grid>
                <Grid size={5}>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={input.Micro_x002d_Innovation}
                    onChange={(event) =>
                      handleInputChange(
                        event,
                        targetFormPage,
                        "Micro_x002d_Innovation"
                      )
                    }
                    slotProps={{ htmlInput: { min: 0, max: 25 } }}
                  />
                </Grid>

                <Grid size={7} sx={{ alignContent: "center" }}>
                  <Typography variant="body1">Open Source</Typography>
                </Grid>
                <Grid size={5}>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={input.OpenSource}
                    onChange={(event) =>
                      handleInputChange(event, targetFormPage, "OpenSource")
                    }
                    slotProps={{ htmlInput: { min: 0, max: 25 } }}
                  />
                </Grid>
              </Grid>
            ))}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          paddingX: 3,
          justifyContent: "space-between",
          marginBottom: 1,
        }}
      >
        <Button
          startIcon={<ChevronLeftRoundedIcon />}
          variant="text"
          onClick={handlePreviousPage}
          disabled={targetFormPage === 0}
        >
          Previous
        </Button>
        <Button
          variant="text"
          endIcon={<ChevronRightRoundedIcon />}
          onClick={targetFormPage === 3 ? handleSubmit : handleNextPage}
        >
          {targetFormPage === 3 ? "Submit" : "Next"}{" "}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
