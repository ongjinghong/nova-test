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

export default function TimelineForm({
  data,
  newData,
  setNewData,
  errors,
  year,
}) {
  const handleChange = (name, value) => {
    setNewData({
      ...newData,
      [name]: value,
    });
  };

  return (
    <Grid container spacing={3}>
      <FormGrid size={6}>
        <FormLabel required>Starting Quarter</FormLabel>
        <Autocomplete
          options={["Q1", "Q2", "Q3", "Q4"]}
          defaultValue={
            newData.Quarter !== "" ? newData.Quarter : data?.quarter
          }
          onChange={(e, value) => handleChange("Quarter", value)}
          renderInput={(params) => (
            <TextField
              {...params}
              name="quarter"
              placeholder={data ? "" : "Innovation starting quarter"}
              onChange={(e) => handleChange("Quarter", e.target.value)}
              size="small"
              error={errors.Quarter}
              helperText={errors.Quarter && "Starting Quarter is required"}
            />
          )}
        />
      </FormGrid>
      <FormGrid size={6}>
        {year !== 2024 && (
          <>
            <FormLabel required>Duration(Weeks)</FormLabel>

            <TextField
              name="duration"
              type="number"
              defaultValue={
                newData.Duration > 0
                  ? newData.Duration
                  : data
                  ? data.duration
                  : 0
              }
              onChange={(e) => handleChange("Duration", e.target.value)}
              size="small"
              error={errors.Duration}
              helperText={errors.Duration && "Estimated Duration is required"}
            />
          </>
        )}
      </FormGrid>
      <FormGrid size={6}>
        <FormLabel required>Status</FormLabel>
        <Autocomplete
          disablePortal
          options={[
            "New",
            "WIP",
            "Submitted",
            "Accepted",
            "Rejected",
            "Cancelled",
          ]}
          defaultValue={newData.Status !== "" ? newData.Status : data?.status}
          onChange={(e, value) => handleChange("Status", value)}
          renderInput={(params) => (
            <TextField
              {...params}
              name="status"
              placeholder={data ? "" : "Submission status"}
              onChange={(e) => handleChange("Status", e.target.value)}
              size="small"
              error={errors.Status}
              helperText={errors.Status && "Status is required"}
            />
          )}
        />
      </FormGrid>
      <FormGrid size={6}>
        {/* <FormLabel>Next Steps</FormLabel>
        <TextField
          id="next-steps"
          name="future"
          type="text"
          placeholder="Future steps for your innovation"
          defaultValue={data ? (data.future ? data.future : "") : ""}
          onChange={(e) => handleChange("future", e.target.value)}
          size="small"
          variant="outlined"
          sx={{ minHeight: "100px" }}
        /> */}
      </FormGrid>
    </Grid>
  );
}
