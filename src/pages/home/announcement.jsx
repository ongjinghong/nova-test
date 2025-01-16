import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Pagination,
  Button,
  PaginationItem,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Grid from "@mui/material/Grid2";
import { invoke } from "@tauri-apps/api/core";
import * as shell from "@tauri-apps/plugin-shell";
import { Fade } from "@mui/material";

import { useSharePointData } from "../../data/sharepointData";

function Announcement() {
  const { listData, token } = useSharePointData();
  const { announcement } = listData;
  const [page, setPage] = useState(1);
  const cardsPerPage = 1;
  const [checked, setChecked] = useState(true);

  // Calculate the cards to display for the current page
  const indexOfLastCard = page * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = announcement.slice(indexOfFirstCard, indexOfLastCard);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const openURL = async (page_url) => {
    const url = page_url;
    await shell.open(url);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setChecked(false);
      setTimeout(() => {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          return nextPage > Math.ceil(announcement.length / cardsPerPage)
            ? 1
            : nextPage;
        });
        setChecked(true);
      }, 500); // Duration of the slide transition
    }, 10000); // 10000 milliseconds = 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [announcement.length, cardsPerPage]);

  return (
    <>
      {currentCards.map((card) => (
        <Card
          key={card.id}
          sx={{
            display: "flex",
            height: "20vh",
            borderRadius: "10px",
            p: 2,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
            transition: "box-shadow 0.3s ease",
            "&:hover": { boxShadow: "0px 6px 25px rgba(0,0,0,0.2)" },
            "@media screen and (min-width: 1100px)": {
                  height: "25vh",
              },
          }}
        >
          <Fade in={checked}>
            <CardMedia
              component="img"
              sx={{ width: "30%" }}
              image={card.banner}
            />
          </Fade>
          <Fade in={checked}>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "67%" }}
            >
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography component="div" variant="h5">
                  {card.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{ color: "text.secondary", marginBottom: "1%" }}
                >
                  {card.description}
                </Typography>
                {card.starttime !== "NA" && card.endtime != "NA" && (
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ color: "text.secondary", marginBottom: "3%" }}
                >
                  <b>From: </b>
                  {card.starttime} <b>To: </b>
                  {card.endtime}
                </Typography>
                )}
                {card.link1 && (
                  <Button
                    variant="contained"
                    endIcon={<OpenInNewIcon />}
                    key={card.link1}
                    onClick={() => {
                      openURL(card.link1_url);
                    }}
                    sx={{ marginRight: "7px", minWidth: "100px", marginTop:"3%" }}
                  >
                    {card.link1}
                  </Button>
                )}
                {card.link2 && (
                  <Button
                    variant="contained"
                    endIcon={<OpenInNewIcon />}
                    key={card.link2}
                    onClick={() => {
                      openURL(card.link2_url);
                    }}
                    sx={{ marginRight: "7px", minWidth: "100px", marginTop:"3%" }}
                  >
                    {card.link2}
                  </Button>
                )}
              </CardContent>
            </Box>
          </Fade>
          <Pagination
            count={Math.ceil(announcement.length / cardsPerPage)}
            page={page}
            onChange={handleChange}
            variant="outlined"
            color="primary"
            size="small"
            hideNextButton
            hidePrevButton
            sx={{ alignSelf: "center", width: "5px" }}
          />
        </Card>
      ))}
    </>
  );
}

export default Announcement;
