import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

import useTargetStore from "../../stores/TargetStore";

export default function TargetDetails() {
  const data = useTargetStore((state) => state.filteredTargets);
  const columns = [
    {
      field: "Site",
      headerName: "Site",
      flex: 0.6,
      minwidth: 250,
      hideable: false,
    },
    {
      field: "Domain",
      headerName: "Domain",
      flex: 0.6,
      minwidth: 100,
      hideable: false,
    },
    {
      field: "Quarter",
      headerName: "Quarter",
      flex: 0.4,
      minwidth: 80,
      hideable: false,
    },
    {
      field: "Conference",
      headerName: "Conferences",
      flex: 0.5,
      minwidth: 80,
      hideable: false,
    },
    {
      field: "IDF",
      headerName: "IDF",
      flex: 0.5,
      width: 80,
      hideable: false,
    },
    {
      field: "POC_x002f_Pitching",
      headerName: "Initiative",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "Micro_x002d_Innovation",
      headerName: "Micro Innovation",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "OpenSource",
      headerName: "Open Source",
      flex: 0.5,
      minWidth: 80,
    },
  ];

  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 4 } },
      }}
      columnVisibilityModel={{
        id: false,
      }}
      pageSizeOptions={[4, 8]}
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
