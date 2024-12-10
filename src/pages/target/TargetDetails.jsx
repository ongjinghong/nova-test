import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
  Typography,
  IconButton,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function TargetDetails({ data, rows }) {
  const columns = [
    {
      field: "site",
      headerName: "Site",
      flex: 0.6,
      minwidth: 250,
      hideable: false,
    },
    {
      field: "domain",
      headerName: "Domain",
      flex: 0.6,
      minwidth: 100,
      hideable: false,
    },
    {
      field: "quarter",
      headerName: "Quarter",
      flex: 0.4,
      minwidth: 80,
      hideable: false,
    },
    {
      field: "conferences",
      headerName: "Conferences",
      flex: 0.5,
      minwidth: 80,
      hideable: false,
    },
    {
      field: "idf",
      headerName: "IDF",
      flex: 0.5,
      width: 80,
      hideable: false,
    },
    {
      field: "initiatives",
      headerName: "Initiative",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "microinnovation",
      headerName: "Micro Innovation",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "opensource",
      headerName: "Open Source",
      flex: 0.5,
      minWidth: 80,
    },
  ];

  return (
    <DataGrid
      rows={data.slice().sort((a, b) => b.id - a.id)}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: rows ? rows : 10 } },
      }}
      columnVisibilityModel={{
        id: false,
      }}
      pageSizeOptions={rows ? [rows] : [10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
}
