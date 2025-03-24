import React, { useEffect } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import {
  Card,
  CardMedia,
  Chip,
  CardActionArea,
  Pagination,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";

import "./Overview.css";
import useNewsStore from "../../stores/NewsStore";

function News() {
  const news = useNewsStore((state) => state.news);
  const currentPage = useNewsStore((state) => state.currentPage);
  const newsPerPage = useNewsStore((state) => state.newsPerPage);
  const currentNews = useNewsStore((state) => state.currentNews);

  useEffect(() => {
    useNewsStore.getState().setCurrentNews();
  }, [currentPage, news]);

  // Handle page change
  const handleChange = (event, value) => {
    useNewsStore.getState().setCurrentPage(value);
  };

  return (
    <Grid container spacing={1} columns={12}>
      {/* <Grid size={12} className="news-header">
        <Typography variant="h6">Tech News</Typography>
        <Chip icon={<AddIcon fontSize="small" />} label="Add" disabled />
      </Grid> */}
      {currentNews.map((card) => (
        <Grid size={3} key={card.id}>
          <Card className="news-card" onClick={() => openUrl(card.URL)}>
            <CardActionArea>
              <CardMedia
                className="news-pic"
                image={
                  card.ImageURL
                    ? card.ImageURL
                    : "https://store.outrightcrm.com/wp-content/uploads/2024/07/unnamed-12.png"
                }
                title={card.Title}
              />
              <Typography className="news-title" variant="body2">
                {card.Title}
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      ))}

      <Grid size={12} className="newspage-box">
        <Pagination
          count={Math.ceil(news.length / newsPerPage)}
          page={currentPage}
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
