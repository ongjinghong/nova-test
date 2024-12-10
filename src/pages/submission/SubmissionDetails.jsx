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
import { OpenInNew, Edit, VolunteerActivism } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/Cancel";
import Grid from "@mui/material/Grid2";
import { invoke } from "@tauri-apps/api/core";
import { useTheme } from "@mui/material/styles";

import { useSharePointData } from "../../data/sharepointData";
import "./SubmissionDetails.css";
import SubmissionForm from "./SubmissionForm";
import useColorConfig from "../../config/colorConfig";

function renderStatus(status) {
  const { statusColors } = useColorConfig();

  return (
    <Chip
      label={status}
      sx={{
        backgroundColor: statusColors[status],
      }}
      size="small"
    />
  );
}

function renderActions(params) {
  const theme = useTheme();
  const { listData, token } = useSharePointData();
  const { myinfo, member } = listData;
  const [openDetails, setOpenDetails] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [author1Pic, setAuthor1Pic] = useState("");
  const [author2Pic, setAuthor2Pic] = useState({});
  const isOwner = (id) =>
    Array.isArray(params.row.author2) &&
    params.row.author2.some((item) => item.LookupId === id);

  const handleDetailClick = async () => {
    setOpenDetails(true);

    const email_address = member.find(
      (item) => item.lookupid === params.row.author1
    )?.email;
    if (email_address) {
      try {
        const base64Image = await invoke("fetch_profile_photo", {
          token,
          email: email_address,
        });
        setAuthor1Pic(`data:image/jpeg;base64,${base64Image}`);
      } catch (err) {
        console.error("Failed to fetch profile photo:", err);
      }
    }

    const author2PicsArray = await Promise.all(
      params.row.author2.map(async (author) => {
        try {
          const base64Image = await invoke("fetch_profile_photo", {
            token,
            email: author.Email,
          });
          return { [author.LookupId]: `data:image/jpeg;base64,${base64Image}` };
        } catch (err) {
          console.error(
            `Failed to fetch profile photo for ${author.Email}:`,
            err
          );
          return { [author.LookupId]: null };
        }
      })
    );

    const author2Pics = author2PicsArray.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});

    setAuthor2Pic(author2Pics);
  };

  const handleDetailClose = () => {
    setOpenDetails(false);
  };

  const handleUpdateClick = () => {
    setOpenUpdate(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        marginTop: "3px",
        gap: 1,
      }}
    >
      <Button
        variant="contained"
        size="small"
        endIcon={<OpenInNew />}
        sx={{ fontSize: "10px" }}
        onClick={handleDetailClick}
      >
        Details
      </Button>
      {(params.row.author1 === myinfo[0].lookupid ||
        isOwner(myinfo[0].lookupid)) && (
        <Button
          variant="contained"
          size="small"
          endIcon={<Edit />}
          sx={{ fontSize: "10px" }}
          onClick={handleUpdateClick}
        >
          Update
        </Button>
      )}

      {/* {params.row.author1 !== myinfo[0].lookupid &&
        !isOwner(myinfo[0].lookupid) &&
        params.row.status === "NEW" && (
          <Button
            aria-hidden={false}
            variant="contained"
            size="small"
            endIcon={<VolunteerActivism />}
            sx={{ fontSize: "10px" }}
          >
            Volunteer
          </Button>
        )} */}

      {/* Details Dialog */}
      <Dialog
        open={openDetails}
        onClose={handleDetailClose}
        fullWidth
        maxWidth="md"
      >
        <IconButton
          aria-label="close"
          onClick={handleDetailClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[700],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Box sx={{ display: "flex", gap: "3px" }}>
            <Chip label={params.row.quarter} color="primary" size="small" />
            <Chip label={params.row.category} color="secondary" size="small" />
          </Box>

          <Grid container spacing={2} columns={12}>
            <Grid size={12}>
              <Typography variant="h6">{params.row.title}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="overline">
                <b>PROBLEM STATEMENT</b>
              </Typography>
              <Typography
                variant="body2"
                className="details-dialog"
                sx={{
                  maxHeight: "200px",
                  overflow: "auto",
                  textAlign: "justify",
                  paddingRight: "10px",
                  paddingLeft: "5px",
                  borderLeft: "3px solid #0054ae",
                }}
              >
                {params.row.problem}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="overline">
                <b>SOLUTION & BENEFITS</b>
              </Typography>
              <Typography
                variant="body2"
                className="details-dialog"
                sx={{
                  maxHeight: "200px",
                  overflow: "auto",
                  textAlign: "justify",
                  paddingRight: "10px",
                  paddingLeft: "5px",
                  borderLeft: "3px solid #0054ae",
                }}
              >
                {params.row.snb}
              </Typography>
            </Grid>
            <Grid size={4}>
              <Divider textAlign="left">
                <Typography
                  variant="overline"
                  sx={{
                    color:
                      theme.palette.mode === "dark" ? "#039be5" : "#0054ae",
                  }}
                >
                  ORIGIN
                </Typography>
              </Divider>

              <Stack
                spacing={2}
                sx={{
                  borderLeft: "3px solid #0054ae",
                  borderRight: "1px",
                  borderBottom: "1px",
                  paddingLeft: "5px",
                }}
              >
                <Box key="site">
                  <Typography variant="caption">Site</Typography>
                  {params.row.site.map((item) => (
                    <Typography key={item} variant="body2">
                      {item}
                    </Typography>
                  ))}
                </Box>
                <Box key="domain">
                  <Typography variant="caption">Domain</Typography>
                  {params.row.domain.map((item) => (
                    <Typography key={item} variant="body2">
                      {item}
                    </Typography>
                  ))}
                </Box>
                <Box key="ea">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="caption" sx={{ paddingTop: "2px" }}>
                      EA
                    </Typography>
                    {params.row.ea ? (
                      <VerifiedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <CancelIcon fontSize="small" />
                    )}
                  </Box>
                  <Typography variant="body2">
                    {params.row.sr === undefined ? "None" : params.row.sr}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={4}>
              <Divider textAlign="left">
                <Typography
                  variant="overline"
                  sx={{
                    color:
                      theme.palette.mode === "dark" ? "#039be5" : "#0054ae",
                  }}
                >
                  SUBMISSION DETAILS
                </Typography>
              </Divider>
              <Stack
                spacing={2}
                sx={{
                  borderLeft: "3px solid #0054ae",
                  borderRight: "1px",
                  borderBottom: "1px",
                  paddingLeft: "5px",
                }}
              >
                <Box key="status">
                  <Typography variant="caption">Status</Typography>
                  <Typography variant="body2">{params.row.status}</Typography>
                </Box>
                <Box key="platform">
                  <Typography variant="caption">Submitted Platform</Typography>
                  <Typography variant="body2">{params.row.platform}</Typography>
                </Box>
                <Box key="platform-id">
                  <Typography variant="caption">
                    Submitted Platform's ID
                  </Typography>
                  <Typography variant="body2">
                    {params.row.platformid === undefined
                      ? "Unknown"
                      : params.row.platformid}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={4}>
              <Divider textAlign="left">
                <Typography
                  variant="overline"
                  sx={{
                    color:
                      theme.palette.mode === "dark" ? "#039be5" : "#0054ae",
                  }}
                >
                  AUTHOR DETAILS
                </Typography>
              </Divider>
              <Stack
                spacing={2}
                sx={{
                  borderLeft: "3px solid #0054ae",
                  borderRight: "1px",
                  borderBottom: "1px",
                  paddingLeft: "5px",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="caption">Primary Author</Typography>
                  <Chip
                    avatar={
                      <Avatar
                        alt={
                          member.find(
                            (item) => item.lookupid === params.row.author1
                          )?.name || "Unknown"
                        }
                        src={author1Pic}
                      />
                    }
                    label={
                      member.find(
                        (item) => item.lookupid === params.row.author1
                      )?.name || "Unknown"
                    }
                    variant="outlined"
                    sx={{ width: "fit-content" }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="caption">Secondary Authors</Typography>
                  {Array.isArray(params.row.author2) &&
                    params.row.author2.map((author) => (
                      <Chip
                        key={author.LookupId}
                        avatar={
                          <Avatar
                            alt={author.LookupValue}
                            src={author2Pic[author.LookupId]}
                          />
                        }
                        label={author.LookupValue}
                        variant="outlined"
                        sx={{ width: "fit-content" }}
                      />
                    ))}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      <SubmissionForm
        open={openUpdate}
        setOpen={setOpenUpdate}
        data={params.row}
        year={params.row.year}
      />
    </Box>
  );
}

export default function CustomizedDataGrid({ data, rows }) {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.1,
      minwidth: 10,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1.6,
      minwidth: 250,
      hideable: false,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0.6,
      minwidth: 100,
      hideable: false,
    },
    {
      field: "site",
      headerName: "Site",
      flex: 0.5,
      minwidth: 80,
      hideable: false,
    },
    {
      field: "domain",
      headerName: "Domain",
      flex: 0.5,
      minwidth: 80,
      hideable: false,
    },
    {
      field: "quarter",
      headerName: "Quarter",
      flex: 0.3,
      width: 80,
      hideable: false,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => renderStatus(params.value),
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      renderCell: renderActions,
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
          paginationModel: { pageSize: rows ? rows[0] : 20 },
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
