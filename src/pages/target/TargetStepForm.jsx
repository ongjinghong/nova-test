import { useState } from "react";

import { FormLabel, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/system";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function TargetFormStep({ quarter, newData, setNewData }) {
  // Handle form data changes
  const handleValueChange = (name, value) => {
    const updatedData = [...newData];
    updatedData[quarter] = { ...updatedData[quarter], [name]: parseInt(value) };
    setNewData(updatedData);
  };
  // console.log("target step form setnewData", setNewData);

  return (
    <Grid container spacing={3}>
      <FormGrid size={6}>
        <TextField
          label="Site"
          value={newData[quarter].Site}
          fullWidth
          disabled
          margin="normal"
        />
      </FormGrid>
      <FormGrid size={6}>
        <TextField
          label="Domain"
          value={newData[quarter].Domain}
          fullWidth
          disabled
          margin="normal"
        />
      </FormGrid>
      <FormGrid size={12} sx={{ marginBottom: "-10px" }}>
        <FormLabel required>Conferences</FormLabel>
      </FormGrid>
      <FormGrid size={12}>
        <TextField
          id={`conferences-q${quarter}`}
          name={`conferences-q${quarter}`}
          type="number"
          defaultValue={newData[quarter].Conference}
          onChange={(e) => handleValueChange("Conference", e.target.value)}
        />
      </FormGrid>
      <FormGrid size={12} sx={{ marginBottom: "-10px" }}>
        <FormLabel required>IDF</FormLabel>
      </FormGrid>
      <FormGrid size={12}>
        <TextField
          id={`idf-q${quarter}`}
          name={`idf-q${quarter}`}
          type="number"
          defaultValue={newData[quarter].IDF}
          onChange={(e) => handleValueChange("IDF", e.target.value)}
        />
      </FormGrid>
      <FormGrid size={12} sx={{ marginBottom: "-10px" }}>
        <FormLabel required>Initiatives</FormLabel>
      </FormGrid>
      <FormGrid size={12}>
        <TextField
          id={`initiatives-q${quarter}`}
          name={`initiatives-q${quarter}`}
          type="number"
          defaultValue={newData[quarter]?.POC_x002f_Pitching}
          onChange={(e) =>
            handleValueChange("POC_x002f_Pitching", e.target.value)
          }
        />
      </FormGrid>
      <FormGrid size={12} sx={{ marginBottom: "-10px" }}>
        <FormLabel required>Micro Innovation</FormLabel>
      </FormGrid>
      <FormGrid size={12}>
        <TextField
          id={`microinnovation-q${quarter}`}
          name={`microinnovation-q${quarter}`}
          type="number"
          defaultValue={newData[quarter]?.Micro_x002d_Innovation}
          onChange={(e) =>
            handleValueChange("Micro_x002d_Innovation", e.target.value)
          }
        />
      </FormGrid>
      <FormGrid size={12} sx={{ marginBottom: "-10px" }}>
        <FormLabel required>Open Source</FormLabel>
      </FormGrid>
      <FormGrid size={12}>
        <TextField
          id={`opensource-q${quarter}`}
          name={`opensource-q${quarter}`}
          type="number"
          defaultValue={newData[quarter]?.OpenSource}
          onChange={(e) => handleValueChange("OpenSource", e.target.value)}
        />
      </FormGrid>
    </Grid>
  );
}
