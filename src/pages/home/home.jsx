import React, { useState, useEffect } from "react";
import { Button, Box, Typography, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import {} from "@tauri-apps/api";

import "./home.css";
import ProfileCard from "./profile";
import News from "./news";
import Announcement from "./announcement";

function Home() {
  return (
    <Box className="home-container">
      <Grid container spacing={2} columns={12}>
        <Grid size={9}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              <Stack direction="row" spacing={0.5}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Announcement
                </Typography>
              </Stack>
            </Grid>
            <Grid size={12}>
              <Announcement />
            </Grid>
            <Grid
              size={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></Grid>
          </Grid>
          <Grid size={12}>
            <ProfileCard />
          </Grid>
        </Grid>
        <Grid size={3}>
          <News />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
