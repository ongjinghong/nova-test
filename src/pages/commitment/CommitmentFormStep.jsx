import { useState } from "react";

import { FormLabel, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/system";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function CommitmentFormStep({ quarter, newData, setNewData }) {
  // Handle form data changes
  // Handle form data changes
  const handleValueChange = (name, value) => {
    const updatedData = [...newData];
    updatedData[quarter] = { ...updatedData[quarter], [name]: parseInt(value) };
    setNewData(updatedData);
  };

  return (
    <Grid container spacing={3}>
      <FormGrid size={12} sx={{ marginBottom: "-10px" }}>
        <FormLabel required>Conferences</FormLabel>
      </FormGrid>
      <FormGrid size={6}>
        <TextField
          id={`conferences-primary-q${quarter}`}
          name={`conferences-primary-q${quarter}`}
          label="Primary"
          type="number"
          defaultValue={newData[quarter].Conferences_Primary}
          onChange={(e) =>
            handleValueChange("Conferences_Primary", e.target.value)
          }
        />
      </FormGrid>
      <FormGrid size={6}>
        <TextField
          id={`conferences-secondary-q${quarter}`}
          name={`conferences-secondary-q${quarter}`}
          type="number"
          label="Secondary"
          defaultValue={newData[quarter].Conferences_Secondary}
          onChange={(e) =>
            handleValueChange("Conferences_Secondary", e.target.value)
          }
        />
      </FormGrid>
      <FormGrid size={12} sx={{ marginBottom: "-10px" }}>
        <FormLabel required>IDF</FormLabel>
      </FormGrid>
      <FormGrid size={6}>
        <TextField
          id={`idf-primary-q${quarter}`}
          name={`idf-primary-q${quarter}`}
          type="number"
          label="Primary"
          defaultValue={newData[quarter].IDF_Primary}
          onChange={(e) => handleValueChange("IDF_Primary", e.target.value)}
        />
      </FormGrid>
      <FormGrid size={6}>
        <TextField
          id="idf-secondary"
          name="idf-secondary"
          type="number"
          label="Secondary"
          defaultValue={newData[quarter]?.IDF_Secondary}
          onChange={(e) => handleValueChange("IDF_Secondary", e.target.value)}
        />
      </FormGrid>
      <FormGrid size={12} sx={{ marginBottom: "-10px" }}>
        <FormLabel required>Initiatives</FormLabel>
      </FormGrid>
      <FormGrid size={6}>
        <TextField
          id={`initiatives-primary-q${quarter}`}
          name={`initiatives-primary-q${quarter}`}
          type="number"
          label="Primary"
          defaultValue={newData[quarter]?.Initiatives_Primary}
          onChange={(e) =>
            handleValueChange("Initiatives_Primary", e.target.value)
          }
        />
      </FormGrid>
      <FormGrid size={6}>
        <TextField
          id="initiatives-secondary"
          name="initiatives-secondary"
          type="number"
          label="Secondary"
          defaultValue={newData[quarter]?.Initiatives_Secondary}
          onChange={(e) =>
            handleValueChange("Initiatives_Secondary", e.target.value)
          }
        />
      </FormGrid>
      <FormGrid size={12} sx={{ marginBottom: "-10px" }}>
        <FormLabel required>Micro Innovation</FormLabel>
      </FormGrid>
      <FormGrid size={6}>
        <TextField
          id={`microinnovation-primary-q${quarter}`}
          name={`microinnovation-primary-q${quarter}`}
          type="number"
          label="Primary"
          defaultValue={newData[quarter]?.MicroInnovation_Primary}
          onChange={(e) =>
            handleValueChange("MicroInnovation_Primary", e.target.value)
          }
        />
      </FormGrid>
      <FormGrid size={6}>
        <TextField
          id="microinnovation-secondary"
          name="microinnovation-secondary"
          type="number"
          label="Secondary"
          defaultValue={newData[quarter]?.MicroInnovation_Secondary}
          onChange={(e) =>
            handleValueChange("MicroInnovation_Secondary", e.target.value)
          }
        />
      </FormGrid>
      <FormGrid size={12} sx={{ marginBottom: "-10px" }}>
        <FormLabel required>Open Source</FormLabel>
      </FormGrid>
      <FormGrid size={6}>
        <TextField
          id={`opensource-primary-q${quarter}`}
          name={`opensource-primary-q${quarter}`}
          type="number"
          label="Primary"
          defaultValue={newData[quarter]?.OpenSource_Primary}
          onChange={(e) =>
            handleValueChange("OpenSource_Primary", e.target.value)
          }
        />
      </FormGrid>
      <FormGrid size={6}>
        <TextField
          id="opensource-secondary"
          name="opensource-secondary"
          type="number"
          label="Secondary"
          defaultValue={newData[quarter]?.OpenSource_Secondary}
          onChange={(e) =>
            handleValueChange("OpenSource_Secondary", e.target.value)
          }
        />
      </FormGrid>
    </Grid>
  );
}
