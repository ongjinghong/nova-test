import React, { useState } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Card,
  CardContent,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import HomeIcon from "@mui/icons-material/Home";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SpatialAudioOffIcon from "@mui/icons-material/SpatialAudioOff";
import ConstructionIcon from "@mui/icons-material/Construction";
import GitHubIcon from "@mui/icons-material/GitHub";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import "./profile.css";
import { useProfileData } from "../../data/profileData";
import { useSharePointData } from "../../data/sharepointData";
import CustomizedDataGrid from "../submission/SubmissionDetailsWindow";
import MyCommitmentCard from "../commitment/MyCommitmentCard";
import CommitmentForm from "../commitment/CommitmentForm";
import * as shell from "@tauri-apps/plugin-shell";

const ProfileCard = () => {
  const { profile, picture } = useProfileData();
  const { listData } = useSharePointData();
  const { myinfo, stars, mycommitment, submission } = listData;
  const currentYear = new Date().getFullYear();

  const mystars = stars.filter((item) => item.lookupid === myinfo[0].lookupid);
  const mysubmission = submission.filter(
    (item) =>
      item.year === currentYear &&
      (item.author1 === myinfo[0].lookupid ||
        (Array.isArray(item.author2) &&
          item.author2.some(
            (author) => author.LookupId.toString() === myinfo[0].lookupid
          )))
  );
  const mycommitmentCurrentYear = mycommitment.filter(
    (item) => item.year === currentYear
  );
  const [openUpdate, setOpenUpdate] = useState(false);

  const handleFormOpen = () => {
    setOpenUpdate(true);
  };

  const links = [
    {
      name: "Portal Home Page",
      url: "https://goto.intel.com/intelflexinnovation",
      icon: <HomeIcon />,
    },
    {
      name: "Conferences",
      url: "https://intel.sharepoint.com/:u:/r/sites/intelflexinnovation/SitePages/Innovation%20Conference.aspx",
      icon: <SpatialAudioOffIcon />,
    },
    {
      name: "IDF",
      url: "https://intel.sharepoint.com/:u:/r/sites/intelflexinnovation/SitePages/Innovation%20IDF.aspx",
      icon: <InsertDriveFileIcon />,
    },
    {
      name: "Initiatives",
      url: "https://intel.sharepoint.com/:u:/r/sites/intelflexinnovation/SitePages/Innovation%20POC_Pitching.aspx",
      icon: <FlagCircleIcon />,
    },
    {
      name: "Micro Innovation",
      url: "https://intel.sharepoint.com/:u:/r/sites/intelflexinnovation/SitePages/Innovation%20Micro-Innovation.aspx",
      icon: <ConstructionIcon />,
    },
    {
      name: "Open Source",
      url: "https://intel.sharepoint.com/:u:/r/sites/intelflexinnovation/SitePages/Innovation%20Open%20Source.aspx",
      icon: <GitHubIcon />,
    },
  ];

  return (
    <Card className="profile-card" variant="outlined">
      <CardContent>
        <Grid container spacing={2} columns={12}>
          <Grid size={4}>
            <Stack
              direction="column"
              spacing={0.5}
              sx={{
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Stack direction="row">
                <Avatar
                  alt={myinfo[0].name}
                  src={
                    picture
                      ? picture
                      : myinfo[0].pic
                      ? myinfo[0].pic
                      : "/icon.png"
                  }
                  sx={{ width: 140, height: 140 }}
                />
                <Stack
                  direction="column"
                  spacing={1}
                  sx={{ paddingTop: "25px" }}
                >
                  {mystars.map((star) => (
                    <Tooltip
                      key={star.id}
                      title={`${star.year} Q${star.quarter} ${star.site} ${star.type} Innovator`}
                      placement="right"
                    >
                      <StarIcon sx={{ fontSize: "20px", color: "#FFD700" }} />
                    </Tooltip>
                  ))}
                </Stack>
              </Stack>

              <Typography variant="h6">
                {myinfo[0].name}{" "}
                <Typography variant="body2">({myinfo[0].email})</Typography>
              </Typography>
              <Stack direction="row" spacing={0.5}>
                {myinfo[0].role.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    size="small"
                    color={
                      item === "Member"
                        ? "primary"
                        : item === "Manager"
                        ? "secondary"
                        : item === "Innovation"
                        ? "success"
                        : "disabled"
                    }
                  />
                ))}
              </Stack>
              <Stack direction="row" spacing={0.5} sx={{ paddingTop: "10px" }}>
                <Typography variant="h3">0</Typography>
                <Typography variant="h5">pts</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={5}>
            {mycommitmentCurrentYear.length > 0 && (
              <MyCommitmentCard year={currentYear} expand={false} />
            )}
            {mycommitmentCurrentYear.length == 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography>No Commitment Found for {currentYear}.</Typography>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  endIcon={
                    <ChevronRightRoundedIcon
                      sx={{ marginLeft: "-7px", marginRight: "-7px" }}
                    />
                  }
                  sx={{
                    fontSize: "12px",
                    height: "40px",
                    width: "fit-content",
                  }}
                  onClick={() => handleFormOpen(2025)}
                >
                  Add {currentYear} Commitment
                </Button>
                <CommitmentForm
                  open={openUpdate}
                  setOpen={setOpenUpdate}
                  data={null}
                  year={currentYear}
                />
              </Box>
            )}
          </Grid>
          <Grid size={3}>
            <Typography variant="h6" mb="15px">
              Portal Links
            </Typography>
            <Stack direction="column" spacing={1}>
              {links.map((link) => (
                <Button
                  variant="outlined"
                  startIcon={link.icon}
                  size="medium"
                  fullWidth
                  key={link.name}
                  onClick={() => {
                    openUrl(link.url);
                  }}
                >
                  {link.name}
                </Button>
              ))}
            </Stack>
          </Grid>
          <Grid size={12}>
            <CustomizedDataGrid data={mysubmission} rows={[5, 10, 20]} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
