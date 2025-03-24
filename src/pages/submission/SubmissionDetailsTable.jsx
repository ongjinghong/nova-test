import React, { useEffect } from "react";
import { Button, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";

import "./Submission.css";
import useColorConfig from "../../config/colorConfig";
import useAppStore from "../../stores/AppStore";
import useSubmissionStore from "../../stores/SubmissionStore";
import useMemberStore from "../../stores/MemberStore";

export default function SubmissionDetailsTable({ rows }) {
  const currentYear = useAppStore((state) => state.currentYear);
  const loginMember = useMemberStore((state) => state.loginMember);
  const data = useSubmissionStore((state) => state.filteredSubmissions);
  const { statusColors } = useColorConfig();

  const handleDetailsClick = (id) => {
    console.log(id);
    useSubmissionStore.getState().openSubmissionDetailsWindow();
    useSubmissionStore.getState().setSubmissionDetailsWindowID(id);
  };

  const handleUpdateClick = (id) => {
    useSubmissionStore.getState().openSubmissionForm();
    useSubmissionStore.getState().resetSubmissionFormPage();
    useSubmissionStore.getState().setSubmissionUpdateID(id);
    useSubmissionStore.getState().setSubmissionFormType("Update");
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.1,
      minwidth: 10,
    },
    {
      field: "Title",
      headerName: "Title",
      flex: 1.1,
      minwidth: 250,
      hideable: false,
    },
    {
      field: "Category",
      headerName: "Category",
      flex: 0.5,
      minwidth: 100,
      hideable: false,
    },
    {
      field: "Site",
      headerName: "Site",
      flex: 0.35,
      minwidth: 100,
      hideable: false,
    },
    {
      field: "Domain",
      headerName: "Domain",
      flex: 0.35,
      minwidth: 100,
      hideable: false,
    },
    {
      field: "Quarter",
      headerName: "Quarter",
      flex: 0.2,
      minWidth: 80,
      hideable: false,
    },
    {
      field: "Status",
      headerName: "Status",
      flex: 0.3,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            backgroundColor: statusColors[params.value],
          }}
          size="small"
        />
      ),
    },
    {
      field: "SubmissionPlatform",
      headerName: "Platform",
      flex: 0.4,
      minWidth: 80,
      hideable: false,
    },
    {
      field: "PrimaryAuthor",
      headerName: "Primary Author",
      flex: 0.5,
      minWidth: 80,
      hideable: false,
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            sx={{ fontSize: "10px" }}
            onClick={() => handleDetailsClick(params.row.id)}
          >
            Details
            <OpenInNewIcon sx={{ marginLeft: 0.5, fontSize: "12px" }} />
          </Button>
          {params.row.Year === currentYear &&
            (params.row.PrimaryAuthor === loginMember.Name ||
              params.row.SecondaryAuthors.includes(loginMember.Name)) && (
              <Button
                variant="contained"
                size="small"
                sx={{ ml: 0.5, fontSize: "10px" }}
                onClick={() => handleUpdateClick(params.row.ListID)}
              >
                Update
                <EditIcon sx={{ marginLeft: 0.5, fontSize: "12px" }} />
              </Button>
            )}
        </>
      ),
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
        pagination: {
          paginationModel: { pageSize: rows ? rows[0] : 10 },
        },
      }}
      columnVisibilityModel={{
        id: false,
      }}
      pageSizeOptions={rows ? rows : [10, 20, 50]}
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
