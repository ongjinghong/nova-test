import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  Chip,
  CardActionArea,
  Pagination,
  Box,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import {} from "@tauri-apps/api";

import "./news.css";
import { useSharePointData } from "../../data/sharepointData";
import * as shell from "@tauri-apps/plugin-shell";

function News() {
  const { listData } = useSharePointData();
  const { news } = listData;
  const [page, setPage] = useState(1);
  const cardsPerPage = 4;

  // Calculate the cards to display for the current page
  const indexOfLastCard = page * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = news.slice(indexOfFirstCard, indexOfLastCard);

  const openBrowser = async (news_url) => {
    const url = news_url;
    // Use Tauri's shell API to open the URL in the default browser
    await shell.open(url);
  };

  // Handle page change
  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Grid container spacing={1} columns={12}>
      <Grid size={5}>
        <Typography variant="h6">Tech News</Typography>
      </Grid>
      <Grid size="grow"></Grid>
      {/* <Grid size={3}>
        <Chip icon={<AddIcon fontSize="small" />} label="Add" />
      </Grid> */}
      <Grid size={12}>
        {currentCards.map((card) => (
          <Grid size={12} key={card.id}>
            <Card className="news-card" onClick={() => openBrowser(card.url)}>
              <CardActionArea>
                <CardMedia
                  className="news-pic"
                  image={
                    card.imageurl
                      ? card.imageurl
                      : "https://store.outrightcrm.com/wp-content/uploads/2024/07/unnamed-12.png"
                  }
                  title={card.title}
                />
                <Typography className="news-title" variant="body2">
                  {card.title}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid size={12} className="newspage-box">
        <Pagination
          count={Math.ceil(news.length / cardsPerPage)}
          page={page}
          onChange={handleChange}
          variant="outlined"
          color="primary"
          size="small"
        />
      </Grid>
    </Grid>
  );
}

export default News;
