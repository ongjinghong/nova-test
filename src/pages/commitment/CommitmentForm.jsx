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
import useCommitmentStore from "../../stores/CommitmentStore";

export default function CommitmentForm() {
  const { quarters } = useAppStore((state) => state.constants);
  const loginMember = useMemberStore((state) => state.loginMember);
  const commitments = useCommitmentStore((state) => state.commitments);
  const commitmentFormOpen = useCommitmentStore(
    (state) => state.commitmentFormOpen
  );
  const commitmentFormType = useCommitmentStore(
    (state) => state.commitmentFormType
  );
  const commitmentsInput = useCommitmentStore(
    (state) => state.commitmentsInput
  );
  const commitmentFormPage = useCommitmentStore(
    (state) => state.commitmentFormPage
  );

  const handleFormClose = useCommitmentStore(
    (state) => state.closeCommitmentForm
  );

  useEffect(() => {
    if (commitmentFormOpen) {
      useCommitmentStore.getState().clearCommitmentInput();
      if (commitmentFormType === "Add") {
        quarters.map((quarter) => {
          const newCommitment = {
            ...useCommitmentStore.getState().commitmentInputTemplate,
          };
          newCommitment.Quarter = quarter;
          newCommitment.Name = loginMember.Name;
          newCommitment.Email = loginMember.Email;
          newCommitment.Site = loginMember.Site;
          newCommitment.Domain = loginMember.Domain;
          useCommitmentStore.getState().addCommitmentInput(newCommitment);
        });
      } else if (commitmentFormType === "Update") {
        commitments
          .filter(
            (commitment) =>
              commitment.Email === loginMember.Email && commitment.Year === 2025
          )
          .sort((a, b) => {
            const quarterOrder = ["Q1", "Q2", "Q3", "Q4"];
            return (
              quarterOrder.indexOf(a.Quarter) - quarterOrder.indexOf(b.Quarter)
            );
          })
          .map((commitment) => {
            const newCommitment = {
              ...useCommitmentStore.getState().commitmentInputTemplate,
            };
            newCommitment.id = commitment.ListID;
            newCommitment.Quarter = commitment.Quarter;
            newCommitment.Email = commitment.Email;
            newCommitment.Site = commitment.Site;
            newCommitment.Domain = commitment.Domain;
            newCommitment.Conferences_Primary = commitment.Conferences_Primary;
            newCommitment.Conferences_Secondary =
              commitment.Conferences_Secondary;
            newCommitment.IDF_Primary = commitment.IDF_Primary;
            newCommitment.IDF_Secondary = commitment.IDF_Secondary;
            newCommitment.Initiatives_Primary = commitment.Initiatives_Primary;
            newCommitment.Initiatives_Secondary =
              commitment.Initiatives_Secondary;
            newCommitment.MicroInnovation_Primary =
              commitment.MicroInnovation_Primary;
            newCommitment.MicroInnovation_Secondary =
              commitment.MicroInnovation_Secondary;
            newCommitment.OpenSource_Primary = commitment.OpenSource_Primary;
            newCommitment.OpenSource_Secondary =
              commitment.OpenSource_Secondary;
            useCommitmentStore.getState().addCommitmentInput(newCommitment);
          });
      }
    }
  }, [commitmentFormOpen]);

  const handleInputChange = (event, index, key) => {
    useCommitmentStore
      .getState()
      .updateCommitmentInput(index, key, event.target.value);
  };

  const handleNextPage = () => {
    useCommitmentStore.getState().nextCommitmentFormPage();
  };

  const handlePreviousPage = () => {
    useCommitmentStore.getState().previousCommitmentFormPage();
  };

  const handleSubmit = () => {
    handleFormClose();
    if (commitmentFormType === "Add") {
      useCommitmentStore.getState().addCommitment();
    } else if (commitmentFormType === "Update") {
      useCommitmentStore.getState().updateCommitment();
    }
  };

  return (
    <Dialog
      open={commitmentFormOpen}
      onClose={handleFormClose}
      fullWidth
      maxWidth="sm"
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
          activeStep={commitmentFormPage}
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
          column={12}
          rowSpacing={2}
          columnSpacing={4}
          sx={{ paddingX: 2 }}
        >
          <Grid size={2} sx={{ alignContent: "center" }}>
            <Typography variant="body1">Email</Typography>
          </Grid>
          <Grid size={10}>
            <TextField
              type="text"
              size="small"
              disabled
              fullWidth
              value={loginMember.Email}
            />
          </Grid>
          <Grid size={2} sx={{ alignContent: "center" }}>
            <Typography variant="body1">Site</Typography>
          </Grid>
          <Grid size={4}>
            <TextField
              type="text"
              size="small"
              disabled
              fullWidth
              value={loginMember["Site"]}
            />
          </Grid>
          <Grid size={2} sx={{ alignContent: "center" }}>
            <Typography variant="body1">Domain</Typography>
          </Grid>
          <Grid size={4}>
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

        <Box>
          {commitmentsInput
            .filter((input, index) => index === commitmentFormPage)
            .map((input) => (
              <Grid
                key={input.Quarter}
                container
                rowSpacing={2}
                columnSpacing={4}
                columns={12}
                sx={{ justifyContent: "center" }}
              >
                <Grid size={3} sx={{ alignContent: "center" }}>
                  <Typography variant="body1">Conferences</Typography>
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="Primary"
                    type="number"
                    size="small"
                    fullWidth
                    value={input.Conferences_Primary}
                    onChange={(event) =>
                      handleInputChange(
                        event,
                        commitmentFormPage,
                        "Conferences_Primary"
                      )
                    }
                    slotProps={{ htmlInput: { min: 0, max: 5 } }}
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="Secondary"
                    type="number"
                    size="small"
                    fullWidth
                    value={input.Conferences_Secondary}
                    onChange={(event) =>
                      handleInputChange(
                        event,
                        commitmentFormPage,
                        "Conferences_Secondary"
                      )
                    }
                    slotProps={{ htmlInput: { min: 0, max: 5 } }}
                  />
                </Grid>

                <Grid size={3} sx={{ alignContent: "center" }}>
                  <Typography variant="body1">IDF</Typography>
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="Primary"
                    type="number"
                    size="small"
                    fullWidth
                    value={input.IDF_Primary}
                    onChange={(event) =>
                      handleInputChange(
                        event,
                        commitmentFormPage,
                        "IDF_Primary"
                      )
                    }
                    slotProps={{ htmlInput: { min: 0, max: 5 } }}
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="Secondary"
                    type="number"
                    size="small"
                    fullWidth
                    value={input.IDF_Secondary}
                    onChange={(event) =>
                      handleInputChange(
                        event,
                        commitmentFormPage,
                        "IDF_Secondary"
                      )
                    }
                    slotProps={{ htmlInput: { min: 0, max: 5 } }}
                  />
                </Grid>

                <Grid size={3} sx={{ alignContent: "center" }}>
                  <Typography variant="body1">Initiatives</Typography>
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="Primary"
                    type="number"
                    size="small"
                    fullWidth
                    value={input.Initiatives_Primary}
                    onChange={(event) =>
                      handleInputChange(
                        event,
                        commitmentFormPage,
                        "Initiatives_Primary"
                      )
                    }
                    slotProps={{ htmlInput: { min: 0, max: 5 } }}
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="Secondary"
                    type="number"
                    size="small"
                    fullWidth
                    value={input.Initiatives_Secondary}
                    onChange={(event) =>
                      handleInputChange(
                        event,
                        commitmentFormPage,
                        "Initiatives_Secondary"
                      )
                    }
                    slotProps={{ htmlInput: { min: 0, max: 5 } }}
                  />
                </Grid>

                <Grid size={3} sx={{ alignContent: "center" }}>
                  <Typography variant="body1">Micro Innovation</Typography>
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="Primary"
                    type="number"
                    size="small"
                    fullWidth
                    value={input.MicroInnovation_Primary}
                    onChange={(event) =>
                      handleInputChange(
                        event,
                        commitmentFormPage,
                        "MicroInnovation_Primary"
                      )
                    }
                    slotProps={{ htmlInput: { min: 0, max: 5 } }}
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="Secondary"
                    type="number"
                    size="small"
                    fullWidth
                    value={input.MicroInnovation_Secondary}
                    onChange={(event) =>
                      handleInputChange(
                        event,
                        commitmentFormPage,
                        "MicroInnovation_Secondary"
                      )
                    }
                    slotProps={{ htmlInput: { min: 0, max: 5 } }}
                  />
                </Grid>

                <Grid size={3} sx={{ alignContent: "center" }}>
                  <Typography variant="body1">Open Source</Typography>
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="Primary"
                    type="number"
                    size="small"
                    fullWidth
                    value={input.OpenSource_Primary}
                    onChange={(event) =>
                      handleInputChange(
                        event,
                        commitmentFormPage,
                        "OpenSource_Primary"
                      )
                    }
                    slotProps={{ htmlInput: { min: 0, max: 5 } }}
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="Secondary"
                    type="number"
                    size="small"
                    fullWidth
                    value={input.OpenSource_Secondary}
                    onChange={(event) =>
                      handleInputChange(
                        event,
                        commitmentFormPage,
                        "OpenSource_Secondary"
                      )
                    }
                    slotProps={{ htmlInput: { min: 0, max: 5 } }}
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
          disabled={commitmentFormPage === 0}
        >
          Previous
        </Button>
        <Button
          variant="text"
          endIcon={<ChevronRightRoundedIcon />}
          onClick={commitmentFormPage === 3 ? handleSubmit : handleNextPage}
        >
          {commitmentFormPage === 3 ? "Submit" : "Next"}{" "}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
