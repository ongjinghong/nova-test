import * as React from "react";

import {
  Autocomplete,
  Checkbox,
  FormLabel,
  TextField,
  FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/system";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function BasicForm({ data, newData, setNewData, errors }) {
  // Handle form data changes
  const handleChange = (name, value) => {
    setNewData({
      ...newData,
      [name]: value,
    });
  };

  return (
    <Grid container spacing={3}>
      <FormGrid size={12}>
        <FormLabel required>Title</FormLabel>
        <TextField
          id="title"
          name="title"
          type="text"
          placeholder="Title of your Innovation"
          defaultValue={newData.Title !== "" ? newData.Title : data?.title}
          onChange={(e) => handleChange("Title", e.target.value)}
          required
          size="small"
          variant="outlined"
          error={errors.Title}
          helperText={errors.Title && "Title is required"}
        />
      </FormGrid>
      <FormGrid size={6}>
        <FormLabel required>Problem Statement</FormLabel>
        <TextField
          id="problem-statement"
          name="problem"
          type="text"
          placeholder="Problem Statement for your innovation"
          defaultValue={
            newData.ProblemStatement !== ""
              ? newData.ProblemStatement
              : data?.problem
          }
          required
          onChange={(e) => handleChange("ProblemStatement", e.target.value)}
          multiline
          size="medium"
          variant="outlined"
          sx={{ minHeight: "100px" }}
          error={errors.ProblemStatement}
          helperText={
            errors.ProblemStatement && "Problem Statement is required"
          }
        />
      </FormGrid>
      <FormGrid size={6}>
        <FormLabel htmlFor="solution-benefits" required>
          Solution & Benefits
        </FormLabel>
        <TextField
          id="solution-benefits"
          name="snb"
          type="text"
          placeholder="Your innovative solution and its benefits"
          defaultValue={
            newData.SolutionandBenefits !== ""
              ? newData.SolutionandBenefits
              : data?.snb
          }
          onChange={(e) => handleChange("SolutionandBenefits", e.target.value)}
          required
          multiline
          size="medium"
          variant="outlined"
          sx={{ minHeight: "100px" }}
          error={errors.SolutionandBenefits}
          helperText={
            errors.SolutionandBenefits && "Solution & Benefits are required"
          }
        />
      </FormGrid>

      <FormGrid size={6}>
        <FormLabel htmlFor="category" required>
          Category
        </FormLabel>
        <Autocomplete
          disablePortal
          options={[
            "Conferences",
            "IDF",
            "Initiatives",
            "Micro-Innovation",
            "Open Source",
            "Knowledge Sharing",
          ]}
          onChange={(e, value) => handleChange("Category", value)}
          defaultValue={
            newData.Category !== "" ? newData.Category : data?.category
          }
          renderInput={(params) => (
            <TextField
              {...params}
              name="category"
              placeholder={data ? "" : "Innovation category"}
              onChange={(e) => handleChange("Category", e.target.value)}
              size="small"
              error={errors.Category}
              helperText={errors.Category && "Category is required"}
            />
          )}
        />
      </FormGrid>
      <FormGrid size={6}>
        <FormControlLabel
          control={
            <Checkbox
              name="ea"
              value="yes"
              checked={newData?.EA ? newData.EA : data?.ea}
              onChange={(e) => handleChange("EA", e.target.checked)}
              size="small"
            />
          }
          label="Engagement Related"
          sx={{ mt: "-7px", mb: "-8px" }}
        />
        {(newData?.EA ? newData.EA : data?.ea) && (
          <TextField
            id="sr"
            name="sr"
            type="text"
            placeholder="SR number of the engagement"
            defaultValue={newData.SRNumber !== "" ? newData.SRNumber : data?.sr}
            onChange={(e) => handleChange("SRNumber", e.target.value)}
            size="small"
            variant="outlined"
          />
        )}
      </FormGrid>
      <FormGrid size={6}>
        <FormLabel htmlFor="platform" required>
          Submitted Platform
        </FormLabel>
        <TextField
          id="platform"
          name="platform"
          type="text"
          placeholder="Where your innovation submitted to?"
          defaultValue={
            newData.SubmissionPlatform !== ""
              ? newData.SubmissionPlatform
              : data?.platform
          }
          onChange={(e) => handleChange("SubmissionPlatform", e.target.value)}
          required
          variant="outlined"
          size="small"
          error={errors.SubmissionPlatform}
          helperText={
            errors.SubmissionPlatform && "Submission Platform is required"
          }
        />
      </FormGrid>
      {(newData.SubmissionPlatform !== ""
        ? newData.SubmissionPlatform
        : data?.platform) && (
        <FormGrid size={6}>
          <FormLabel htmlFor="SubmissionID">
            {newData.SubmissionPlatform !== ""
              ? newData.SubmissionPlatform
              : data?.platform}
            's ID (if applicable)
          </FormLabel>
          <TextField
            id="platform-id"
            name="platformid"
            type="platform-id"
            placeholder="Submission Platform's ID"
            defaultValue={
              newData.SubmissionID !== ""
                ? newData.SubmissionID
                : data?.platformid
            }
            onChange={(e) => handleChange("SubmissionID", e.target.value)}
            variant="outlined"
            size="small"
          />
        </FormGrid>
      )}
    </Grid>
  );
}
