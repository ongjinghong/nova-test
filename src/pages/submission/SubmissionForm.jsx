import React, { use, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CheckIcon from "@mui/icons-material/Check";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import useAppStore from "../../stores/AppStore";
import useMemberStore from "../../stores/MemberStore";
import useSubmissionStore from "../../stores/SubmissionStore";

export default function SubmissionForm() {
  const { sites, domains, quarters, statuses, categories } = useAppStore(
    (state) => state.constants
  );
  const submissions = useSubmissionStore((state) => state.submissions);
  const submissionFormOpen = useSubmissionStore(
    (state) => state.submissionFormOpen
  );
  const submissionFormType = useSubmissionStore(
    (state) => state.submissionFormType
  );
  const submissionUpdateID = useSubmissionStore(
    (state) => state.submissionUpdateID
  );
  const submissionsInput = useSubmissionStore(
    (state) => state.submissionsInput
  );
  const submissionInputError = useSubmissionStore(
    (state) => state.submissionInputError
  );
  const submissionFormPage = useSubmissionStore(
    (state) => state.submissionFormPage
  );
  const primaryAuthorNameSearch = useSubmissionStore(
    (state) => state.primaryAuthorNameSearch
  );
  const secondaryAuthorNameSearch = useSubmissionStore(
    (state) => state.secondaryAuthorNameSearch
  );
  const primaryAuthorNameSearchResults = useSubmissionStore(
    (state) => state.primaryAuthorNameSearchResults
  );
  const secondaryAuthorNameSearchResults = useSubmissionStore(
    (state) => state.secondaryAuthorNameSearchResults
  );
  const handleFormClose = useSubmissionStore(
    (state) => state.closeSubmissionForm
  );

  useEffect(() => {
    if (submissionFormOpen) {
      useSubmissionStore.getState().clearSubmissionInput();
      useSubmissionStore.getState().clearSubmissionInputError();
      if (submissionFormType === "Add") {
        const newSubmission = {
          ...useSubmissionStore.getState().submissionInputTemplate,
        };
        useSubmissionStore.getState().addSubmissionInput(newSubmission);
      } else if (submissionFormType === "Update") {
        const newSubmission = {
          ...useSubmissionStore.getState().submissionInputTemplate,
        };
        const updateSubmissionItem = submissions.find(
          (item) => item.Year === 2025 && item.ListID === submissionUpdateID
        );
        newSubmission.Site = updateSubmissionItem.Site;
        newSubmission.Domain = updateSubmissionItem.Domain;
        newSubmission.Title = updateSubmissionItem.Title;
        newSubmission.ProblemStatement = updateSubmissionItem.ProblemStatement;
        newSubmission.SolutionandBenefits =
          updateSubmissionItem.SolutionandBenefits;
        newSubmission.Quarter = updateSubmissionItem.Quarter;
        newSubmission.Duration = updateSubmissionItem.Duration;
        newSubmission.Category = updateSubmissionItem.Category;
        newSubmission.Status = updateSubmissionItem.Status;
        newSubmission.EA = updateSubmissionItem.EA;
        newSubmission.SRNumber = updateSubmissionItem.SRNumber;
        newSubmission.SubmissionPlatform =
          updateSubmissionItem.SubmissionPlatform;
        newSubmission.SubmissionPlatformID =
          updateSubmissionItem.SubmissionPlatformID;
        newSubmission.PrimaryAuthor = updateSubmissionItem.PrimaryAuthor;
        newSubmission.SecondaryAuthors = updateSubmissionItem.SecondaryAuthors;
        useSubmissionStore.getState().setSubmissionInput(newSubmission);
      }
    }
  }, [submissionFormOpen]);

  const handleInputChange = (key, value) => {
    console.log(key, value);
    useSubmissionStore.getState().updateSubmissionInput(key, value);
  };

  const handleBlur = () => {
    useSubmissionStore.getState().clearPrimaryAuthorNameSearchResults();
    useSubmissionStore.getState().clearSecondaryAuthorNameSearchResults();
  };

  const handlePrimaryAuthorSearch = (input) => {
    useSubmissionStore.getState().setPrimaryAuthorNameSearch(input);
  };

  const handleSecondaryAuthorSearch = (input) => {
    useSubmissionStore.getState().setSecondaryAuthorNameSearch(input);
  };

  useEffect(() => {
    const fetchPrimaryAuthorNames = async () => {
      const results = await useMemberStore
        .getState()
        .getIntelEmpoyeeNames(primaryAuthorNameSearch);

      useSubmissionStore.getState().setPrimaryAuthorNameSearchResults(results);
    };

    if (primaryAuthorNameSearch.length > 3) {
      fetchPrimaryAuthorNames();
    }
  }, [primaryAuthorNameSearch]);

  useEffect(() => {
    const fetchSecondaryAuthorNames = async () => {
      const results = await useMemberStore
        .getState()
        .getIntelEmpoyeeNames(secondaryAuthorNameSearch);

      useSubmissionStore
        .getState()
        .setSecondaryAuthorNameSearchResults(results);
    };

    if (secondaryAuthorNameSearch.length > 3) {
      fetchSecondaryAuthorNames();
    }
  }, [secondaryAuthorNameSearch]);

  const handleNextPage = () => {
    if (submissionFormPage === 0) {
      useSubmissionStore
        .getState()
        .setSubmissionInputError("Title", submissionsInput.Title === "");
      useSubmissionStore
        .getState()
        .setSubmissionInputError(
          "ProblemStatement",
          submissionsInput.ProblemStatement === ""
        );
      useSubmissionStore
        .getState()
        .setSubmissionInputError("Category", submissionsInput.Category === "");
      useSubmissionStore
        .getState()
        .setSubmissionInputError(
          "PrimaryAuthor",
          submissionsInput.PrimaryAuthor === ""
        );
      if (submissionsInput.Category === "Micro Innovation") {
        useSubmissionStore
          .getState()
          .setSubmissionInputError(
            "SolutionandBenefits",
            submissionsInput.SolutionandBenefits === ""
          );
      }
    }
    if (submissionFormPage === 1) {
      useSubmissionStore
        .getState()
        .setSubmissionInputError("Site", submissionsInput.Site.length === 0);
      useSubmissionStore
        .getState()
        .setSubmissionInputError(
          "Domain",
          submissionsInput.Domain.length === 0
        );
      if (submissionsInput.EA) {
        useSubmissionStore
          .getState()
          .setSubmissionInputError(
            "SRNumber",
            submissionsInput.SRNumber === ""
          );
      }
    }

    // Check if all submissionInputError values are false
    if (
      Object.values(useSubmissionStore.getState().submissionInputError).every(
        (error) => !error
      )
    ) {
      useSubmissionStore.getState().nextSubmissionFormPage();
    }
  };

  const handlePreviousPage = () => {
    useSubmissionStore.getState().previousSubmissionFormPage();
  };

  const handleSubmit = async () => {
    handleFormClose(); // Close Form First
    if (submissionFormPage === 2) {
      useSubmissionStore
        .getState()
        .setSubmissionInputError("Quarter", submissionsInput.Quarter === "");
      useSubmissionStore
        .getState()
        .setSubmissionInputError("Duration", submissionsInput.Duration <= 0);
      useSubmissionStore
        .getState()
        .setSubmissionInputError("Status", submissionsInput.Status === "");
      useSubmissionStore
        .getState()
        .setSubmissionInputError(
          "SubmissionPlatform",
          submissionsInput.SubmissionPlatform === ""
        );
    }

    // Check if all submissionInputError values are false
    if (
      Object.values(useSubmissionStore.getState().submissionInputError).every(
        (error) => !error
      )
    ) {
      const fetchLookupID = async (name) => {
        // Replace this with the actual function to get the lookup ID
        // For example, you might call an API to get the ID
        return await useMemberStore.getState().getLookupID(name);
      };

      const primaryAuthorLookupID = await fetchLookupID(
        submissionsInput.PrimaryAuthor
      );
      const secondaryAuthorLookupIDs = await Promise.all(
        submissionsInput.SecondaryAuthors.map((author) => fetchLookupID(author))
      );

      const updatedSubmissionInput = {
        ...submissionsInput,
        PrimaryAuthorLookupId: primaryAuthorLookupID,
        SecondaryAuthorsLookupId: secondaryAuthorLookupIDs,
        "SecondaryAuthorsLookupId@odata.type": "Collection(Edm.String)",
        "Site@odata.type": "Collection(Edm.String)",
        "Domain@odata.type": "Collection(Edm.String)",
      };

      // Remove the original PrimaryAuthor and SecondaryAuthors fields
      delete updatedSubmissionInput.PrimaryAuthor;
      delete updatedSubmissionInput.SecondaryAuthors;
      console.log(updatedSubmissionInput);
      if (submissionFormType === "Add") {
        useSubmissionStore.getState().addSubmission(updatedSubmissionInput);
      } else if (submissionFormType === "Update") {
        useSubmissionStore.getState().updateSubmission(updatedSubmissionInput);
      }
      useSubmissionStore.getState().closeSubmissionForm();
    }
  };

  return (
    <Dialog
      open={submissionFormOpen}
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
          activeStep={submissionFormPage}
          sx={{ marginBottom: 4 }}
        >
          {["Information", "Flex Related", "Timeline"].map((page) => (
            <Step key={page}>
              <StepLabel>{page}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid
          container
          rowSpacing={2}
          columnSpacing={4}
          columns={12}
          sx={{ paddingX: "10px", justifyContent: "center", overflowY: "auto" }}
        >
          {submissionFormPage === 0 && (
            <>
              <Grid size={12} sx={{ alignContent: "center" }}>
                <Typography variant="body1">Title</Typography>
                <TextField
                  placeholder="Title of the innovation"
                  type="text"
                  size="small"
                  fullWidth
                  value={submissionsInput.Title}
                  onChange={(e) => handleInputChange("Title", e.target.value)}
                  error={submissionInputError.Title}
                  helperText={
                    submissionInputError.Title ? "Title is required" : ""
                  }
                />
              </Grid>
              <Grid size={12} sx={{ alignContent: "center" }}>
                <Typography variant="body1">Problem Statement</Typography>
                <TextField
                  placeholder="What is the problem that the innovation is solving?"
                  multiline
                  type="text"
                  size="small"
                  rows={3}
                  fullWidth
                  value={submissionsInput.ProblemStatement}
                  onChange={(e) =>
                    handleInputChange("ProblemStatement", e.target.value)
                  }
                  error={submissionInputError.ProblemStatement}
                  helperText={
                    submissionInputError.ProblemStatement
                      ? "Problem Statement is required"
                      : ""
                  }
                />
              </Grid>
              <Grid size={12} sx={{ alignContent: "center" }}>
                <Typography variant="body1">Solution & Benefits</Typography>
                <TextField
                  placeholder="How does the innovation solve the problem and its benefits"
                  multiline
                  type="text"
                  size="small"
                  rows={3}
                  fullWidth
                  value={submissionsInput.SolutionandBenefits}
                  onChange={(e) =>
                    handleInputChange("SolutionandBenefits", e.target.value)
                  }
                  error={submissionInputError.ProblemStatement}
                  helperText={
                    submissionInputError.ProblemStatement
                      ? "Problem Statement is required for Micro Innovation"
                      : ""
                  }
                />
              </Grid>

              <Grid size={12} sx={{ alignContent: "center" }}>
                <Typography variant="body1">Category</Typography>
                <Select
                  size="small"
                  fullWidth
                  value={submissionsInput.Category}
                  onChange={(e) =>
                    handleInputChange("Category", e.target.value)
                  }
                  error={submissionInputError.Category}
                  helperText={
                    submissionInputError.Category
                      ? "Please select a category"
                      : ""
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid size={3} sx={{ alignContent: "center" }}>
                <Typography variant="body1">Primary Author</Typography>
              </Grid>
              <Grid size={9} sx={{ alignContent: "center" }}>
                <Autocomplete
                  options={primaryAuthorNameSearchResults}
                  filterOptions={(options) => options} // No filtering
                  size="small"
                  defaultValue={submissionsInput.PrimaryAuthor}
                  inputValue={primaryAuthorNameSearch}
                  onInputChange={(event, newInputValue) => {
                    handlePrimaryAuthorSearch(newInputValue);
                  }}
                  onChange={(event, value) => {
                    handleInputChange("PrimaryAuthor", value);
                  }}
                  onBlur={handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      placeholder="Primary Author of the innovation"
                      size="small"
                      error={submissionInputError.PrimaryAuthor}
                      helperText={
                        submissionInputError.PrimaryAuthor
                          ? "Please enter the primary author"
                          : ""
                      }
                    />
                  )}
                />
              </Grid>
              <Grid size={3} sx={{ alignContent: "center" }}>
                <Typography variant="body1">Secondary Authors</Typography>
              </Grid>
              <Grid size={9} sx={{ alignContent: "center" }}>
                <Autocomplete
                  multiple
                  options={secondaryAuthorNameSearchResults}
                  filterOptions={(options) => options} // No filtering
                  size="small"
                  value={submissionsInput.SecondaryAuthors}
                  inputValue={secondaryAuthorNameSearch}
                  onInputChange={(event, newInputValue) => {
                    handleSecondaryAuthorSearch(newInputValue);
                  }}
                  onChange={(event, value) => {
                    handleInputChange("SecondaryAuthors", value);
                  }}
                  onBlur={handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Secondary Author(s) of the innovation"
                      size="small"
                    />
                  )}
                />
              </Grid>
            </>
          )}

          {submissionFormPage === 1 && (
            <>
              <Grid size={12} sx={{ alignContent: "center" }}>
                <Typography variant="body1">Site</Typography>
                <Select
                  multiple
                  placeholder="Involved Flex members' site(s)"
                  size="small"
                  fullWidth
                  value={submissionsInput.Site}
                  onChange={(e) => handleInputChange("Site", e.target.value)}
                  error={submissionInputError.Site}
                  helperText={
                    submissionInputError.Site
                      ? "Please select the site which Flex members are involved"
                      : ""
                  }
                >
                  {sites.map((site) => (
                    <MenuItem key={site} value={site}>
                      {site}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid size={12} sx={{ alignContent: "center" }}>
                <Typography variant="body1">Domain</Typography>
                <Select
                  multiple
                  placeholder="Involved Flex members' domain(s)"
                  size="small"
                  fullWidth
                  value={submissionsInput.Domain}
                  onChange={(e) => handleInputChange("Domain", e.target.value)}
                  error={submissionInputError.Domain}
                  helperText={
                    submissionInputError.Domain
                      ? "Please select the domain which Flex members are involved"
                      : ""
                  }
                >
                  {domains.map((domain) => (
                    <MenuItem key={domain} value={domain}>
                      {domain}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid size={12} sx={{ alignContent: "center" }}>
                <Box flexDirection={"row"} display="flex" alignItems={"center"}>
                  <Typography variant="body1">EA</Typography>
                  <Checkbox
                    checked={submissionsInput.EA}
                    size="small"
                    onChange={(e) => handleInputChange("EA", e.target.checked)}
                  />
                </Box>

                <TextField
                  placeholder="SR Number of the innovation"
                  type="text"
                  size="small"
                  disabled={!submissionsInput.EA}
                  fullWidth
                  value={submissionsInput.SRNumber}
                  onChange={(e) =>
                    handleInputChange("SRNumber", e.target.value)
                  }
                  error={submissionInputError.SRNumber}
                  helperText={
                    submissionInputError.SRNumber
                      ? "Please input related Project Engagement number"
                      : ""
                  }
                />
              </Grid>
            </>
          )}

          {submissionFormPage === 2 && (
            <>
              <Grid size={6} sx={{ alignContent: "center" }}>
                <Typography variant="body1">Quarter</Typography>
                <Select
                  size="small"
                  fullWidth
                  value={submissionsInput.Quarter}
                  onChange={(e) => handleInputChange("Quarter", e.target.value)}
                  error={submissionInputError.Quarter}
                  helperText={
                    submissionInputError.Quarter
                      ? "Please select the starting quarter"
                      : ""
                  }
                >
                  {quarters.map((quarter) => (
                    <MenuItem key={quarter} value={quarter}>
                      {quarter}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid size={6} sx={{ alignContent: "center" }}>
                <Typography variant="body1">
                  Expected Duration (Weeks)
                </Typography>
                <TextField
                  placeholder="Duration of the submission"
                  type="number"
                  size="small"
                  fullWidth
                  value={submissionsInput.Duration || 0}
                  onChange={(e) =>
                    handleInputChange("Duration", e.target.value)
                  }
                  error={submissionInputError.Duration}
                  helperText={
                    submissionInputError.Duration
                      ? "Please select the expected/took duration"
                      : ""
                  }
                  slotProps={{ htmlInput: { min: 1, max: 52 } }}
                />
              </Grid>
              <Grid size={3} sx={{ alignContent: "center" }}>
                <Typography variant="body1">Status</Typography>
              </Grid>
              <Grid size={9} sx={{ alignContent: "center" }}>
                <Select
                  size="small"
                  fullWidth
                  value={submissionsInput.Status}
                  onChange={(e) => handleInputChange("Status", e.target.value)}
                  error={submissionInputError.Status}
                  helperText={
                    submissionInputError.Status
                      ? "Please select the current status of the submission"
                      : ""
                  }
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid size={3} sx={{ alignContent: "center" }}>
                <Typography variant="body1">Submission Platform</Typography>
              </Grid>
              <Grid size={9} sx={{ alignContent: "center" }}>
                <TextField
                  placeholder="This Innovation is submitted on which platform?"
                  type="text"
                  size="small"
                  fullWidth
                  value={submissionsInput.SubmissionPlatform}
                  onChange={(e) =>
                    handleInputChange("SubmissionPlatform", e.target.value)
                  }
                  error={submissionInputError.SubmissionPlatform}
                  helperText={
                    submissionInputError.SubmissionPlatform
                      ? "Please input the submission platform"
                      : ""
                  }
                />
              </Grid>
              <Grid size={3} sx={{ alignContent: "center" }}>
                <Typography variant="body1">
                  Submission Platform's ID/URL
                </Typography>
              </Grid>
              <Grid size={9} sx={{ alignContent: "center" }}>
                <TextField
                  placeholder="ID/URL of the submission on the submission platform"
                  type="text"
                  size="small"
                  fullWidth
                  value={submissionsInput.SubmissionPlatformID}
                  onChange={(e) =>
                    handleInputChange("SubmissionPlatformID", e.target.value)
                  }
                />
              </Grid>
            </>
          )}
        </Grid>
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
          disabled={submissionFormPage === 0}
        >
          Previous
        </Button>
        <Button
          variant="text"
          endIcon={<ChevronRightRoundedIcon />}
          onClick={submissionFormPage === 2 ? handleSubmit : handleNextPage}
        >
          {submissionFormPage === 2 ? "Submit" : "Next"}{" "}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
