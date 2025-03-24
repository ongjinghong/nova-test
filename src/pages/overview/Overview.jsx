import React, { useEffect } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { Button, Box, Stack, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import HomeIcon from "@mui/icons-material/Home";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SpatialAudioOffIcon from "@mui/icons-material/SpatialAudioOff";
import ConstructionIcon from "@mui/icons-material/Construction";
import GitHubIcon from "@mui/icons-material/GitHub";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";

import "./Overview.css";
import News from "./OverviewNews";

import useAppStore from "../../stores/AppStore";
import useLoginStore from "../../stores/LoginStore";
import useAnnouncementStore from "../../stores/AnnouncementStore";
import useNewsStore from "../../stores/NewsStore";
import useMemberStore from "../../stores/MemberStore";
import useCommitmentStore from "../../stores/CommitmentStore";
import useSubmissionStore from "../../stores/SubmissionStore";
import useTargetStore from "../../stores/TargetStore";
import OverviewPerformance from "./OverviewPerformance";

function Overview() {
  const token = useLoginStore((state) => state.accessToken);
  const currentYear = useAppStore((state) => state.currentYear);
  const appReady = useAppStore((state) => state.appReady);
  const portalLink = useAppStore((state) => state.portalLinks);
  const members = useMemberStore((state) => state.members);
  const commitments = useCommitmentStore(
    (state) => state.lists.find((x) => x.year === 2025).data
  );
  const submissions = useSubmissionStore((state) => state.submissions);
  const targets = useTargetStore((state) => state.targets);
  const announcements = useAnnouncementStore((state) => state.announcements);
  const news = useNewsStore((state) => state.news);

  useEffect(() => {
    const fetchData = async () => {
      useAppStore.getState().openStatus();
      useAppStore
        .getState()
        .setStatusMessage("Fetching Required Data from Sharepoint...");

      if (announcements.length === 0) {
        await useAnnouncementStore.getState().getAnnouncement();
      }

      if (news.length === 0) await useNewsStore.getState().getNews();

      if (members.length === 0) {
        await useMemberStore.getState().getFlexMemberList();
        const loginMember = useMemberStore.getState().loginMember;
        if (loginMember && loginMember.Role) {
          if (loginMember.Role.includes("Innovation")) {
            await useAppStore.getState().setAppMode("Innovation");
          } else if (loginMember.Role.includes("Manager")) {
            await useAppStore.getState().setAppMode("Manager");
          }
        }
        console.debug("App Mode Activated:", useAppStore.getState().appMode);
      }

      if (commitments.length === 0) {
        await useCommitmentStore.getState().getCommitments(currentYear);
      }

      if (submissions.length === 0) {
        await useSubmissionStore.getState().getSubmissions(currentYear);
      }

      if (targets.length === 0) {
        await useTargetStore.getState().getTargets(currentYear);
      }
      useAppStore.getState().openStatus();
      useAppStore.getState().setStatusMessage("All Data Fetched Successfully");
      useAppStore.getState().setAppReady();
    };

    if (token && !appReady) {
      useAppStore.getState().clearAppReady();
      fetchData();
    }
  }, [token]);

  return (
    <Box className="overview-container">
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ justifyContent: "center" }}
      >
        {portalLink.map((link) => (
          <Grid size={2} key={link.name}>
            <Button
              variant="outlined"
              startIcon={
                link.name === "Portal" ? (
                  <HomeIcon />
                ) : link.name === "Conferences" ? (
                  <SpatialAudioOffIcon />
                ) : link.name === "IDF" ? (
                  <InsertDriveFileIcon />
                ) : link.name === "Initiatives" ? (
                  <FlagCircleIcon />
                ) : link.name === "Micro Innovation" ? (
                  <ConstructionIcon />
                ) : link.name === "Open Source" ? (
                  <GitHubIcon />
                ) : null
              }
              size="medium"
              fullWidth
              onClick={() => {
                openUrl(link.url);
              }}
            >
              {link.name}
            </Button>
          </Grid>
        ))}

        <Grid size={12}>
          <News />
        </Grid>

        <Divider sx={{ width: "100%" }} />
        <Grid size={12} sx={{ mt: 1 }}>
          <OverviewPerformance />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Overview;
