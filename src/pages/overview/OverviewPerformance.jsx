import React, { useEffect } from "react";
import { Box, ButtonGroup, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid2";
import { invoke } from "@tauri-apps/api/core";
import { downloadDir } from "@tauri-apps/api/path";

import "./Overview.css";
import useAppStore from "../../stores/AppStore";
import usePerformanceStore from "../../stores/PerformanceStore";
import useSubmissionStore from "../../stores/SubmissionStore";

export default function OverviewPerformance() {
  const data = usePerformanceStore((state) => state.data);
  const quarters = useAppStore((state) => state.constants.quarters);
  const appMode = useAppStore((state) => state.appMode);
  const filters = usePerformanceStore((state) => state.filters);
  const submissions = useSubmissionStore
    .getState()
    .lists.find((x) => x.year === 2025).data;

  useEffect(() => {
    usePerformanceStore.getState().setData(filters);
  }, [submissions, filters]);

  const handleFilterClick = (event) => {
    const currentFilters = usePerformanceStore.getState().filters;
    if (currentFilters.includes(event.target.textContent)) {
      usePerformanceStore
        .getState()
        .setFilters(
          currentFilters.filter((filter) => filter !== event.target.textContent)
        );
    } else {
      usePerformanceStore
        .getState()
        .setFilters([...currentFilters, event.target.textContent]);
    }
  };

  const columns = [
    { field: "indicator", headerName: "Indicators", flex: 2 },
    { field: "amr_engineering", headerName: "AMR Engineering", flex: 1 },
    { field: "gear_engineering", headerName: "GEAR Engineering", flex: 1 },
    { field: "my_engineering", headerName: "MY Engineering", flex: 1 },
    { field: "prc_engineering", headerName: "PRC Engineering", flex: 1 },
    { field: "tfm", headerName: "TFM", flex: 1 },
    { field: "oms", headerName: "OMS", flex: 1 },
    { field: "fc", headerName: "FC", flex: 1 },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
      headerClassName: "header-total",
      cellClassName: "cell-total",
    },
    {
      field: "unique_total",
      headerName: "Unique Total",
      flex: 1,
      headerClassName: "header-unique-total",
      cellClassName: "cell-unique-total",
    },
  ];

  const getRowClassName = (params) => {
    if (params.id === data.length) {
      return "last-row";
    }
    return "";
  };

  const getCellClassName = (params) => {
    if (params.id === data.length) {
      if (params.field === "indicator") {
        return "last-row-first-cell";
      } else if (params.field === "total" || params.field === "unique_total") {
        return "last-row-last-cells";
      } else {
        return "last-row-cells";
      }
    }
    return "";
  };

  const exportToXSLX = async () => {
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    const dataByQuarter = quarters.map((q) =>
      usePerformanceStore.getState().getCombinedData([q])
    );

    const headers = columns.map((col) => col.headerName);

    const processDataRows = (data) => [
      headers,
      ...data.map((row) =>
        headers.map((header) => {
          const field = columns.find((col) => col.headerName === header).field;
          let value = row[field];

          if (typeof value === "string") {
            value = value.trim();
            if (value.startsWith("- ")) {
              value = value.replace(/^- /, "");
            }
          }

          // Handle arrays of strings
          if (Array.isArray(value) && typeof value[0] === "string") {
            value = value.join(";"); // Join strings with semicolons
          }

          return String(value);
        })
      ),
    ];

    const dataRows = processDataRows(data);
    const quarterRows = dataByQuarter.map(processDataRows);
    const downloadPath = await downloadDir();

    try {
      await invoke("export_to_performance_xlsx", {
        data: JSON.stringify(dataRows),
        quarters: JSON.stringify(quarters),
        dataByQuarter: JSON.stringify(quarterRows),
        path: downloadPath,
      });
      console.log("Export successful");
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  return (
    <Grid
      container
      spacing={1}
      columns={12}
      sx={{
        marginBottom: "40px",
        justifyContent: "center",
      }}
    >
      <Grid
        size={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Intel Flex Global Performance</Typography>
        <ButtonGroup sx={{ width: "25%" }}>
          {quarters.map((quarter) => (
            <Button
              fullWidth
              size="small"
              key={quarter}
              variant={filters.includes(quarter) ? "contained" : "outlined"}
              onClick={handleFilterClick}
            >
              {quarter}
            </Button>
          ))}
          {appMode === "Innovation" && (
            <Button
              sx={{ width: "600px" }}
              size="small"
              variant="outlined"
              onClick={exportToXSLX}
            >
              Download
            </Button>
          )}
        </ButtonGroup>
      </Grid>
      <Grid size={11}>
        <DataGrid
          rows={data}
          columns={columns}
          density="compact"
          hideFooterPagination
          hideFooter
          getRowClassName={getRowClassName}
          getCellClassName={getCellClassName}
          sx={{
            width: "100%",
            "& .header-total, .header-unique-total": {
              backgroundColor: "orange",
              color: "black",
              fontWeight: "bold",
              border: "1px solid rgba(224, 224, 224, 1)",
            },
            "& .cell-total, .cell-unique-total": {
              backgroundColor: "yellow",
              color: "black",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "darkblue",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-cell": {
              border: "1px solid rgba(224, 224, 224, 1)",
            },
            "& .last-row-first-cell": {
              backgroundColor: "orange",
              color: "black",
            },
            "& .last-row-cells": {
              backgroundColor: "yellow",
              color: "black",
            },
            "& .last-row-last-cells": {
              backgroundColor: "orange",
              color: "black",
            },
          }}
        />
      </Grid>
    </Grid>
  );
}
