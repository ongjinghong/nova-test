import React, { useEffect } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import {
  Box,
  Dialog,
  DialogContent,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import useAnnouncementStore from "../../stores/AnnouncementStore";

function Announcement() {
  const announcements = useAnnouncementStore((state) => state.announcements);

  const handleCloseAnnouncement = (id) => {
    useAnnouncementStore.getState().closeAnnouncement(id);
  };

  const handleMuteChange = (event, id) => {
    if (event.target.checked) {
      // Perform actions when the checkbox is checked
      useAnnouncementStore.getState().muteAnnouncement(id);
    } else {
      // Perform actions when the checkbox is unchecked
      useAnnouncementStore.getState().unmuteAnnouncement(id);
    }
  };

  return (
    <>
      {announcements.map((announcement) => (
        <Dialog
          key={announcement.id}
          onClose={() => handleCloseAnnouncement(announcement.id)}
          open={announcement.Open}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "15px",
            },
          }}
        >
          <IconButton
            onClick={() => handleCloseAnnouncement(announcement.id)}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent
            sx={{
              padding: "0",
            }}
          >
            <Card
              sx={{
                height: 500,
                width: 500,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                height="250"
                image={announcement.Banner}
                alt={announcement.Title}
              />

              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h5">{announcement.Title}</Typography>

                {announcement.StartTime !== "NA" &&
                  announcement.EndTime !== "NA" && (
                    <Box
                      display="flex"
                      flexDirection="row"
                      columnGap={1}
                      mb={1}
                    >
                      <CalendarMonthIcon fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {announcement.StartTime} - {announcement.EndTime}
                      </Typography>
                    </Box>
                  )}

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    whiteSpace: "pre-line",
                    mt: 2,
                    overflow: "auto",
                    maxHeight: 110,
                  }}
                >
                  {announcement.Description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between" }}>
                <Box justifyContent="flex-end" display="flex" mt={0}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        sx={{ pr: 0.5 }}
                        onChange={(e) => handleMuteChange(e, announcement.id)}
                      />
                    }
                    label="Mute until next Monday"
                    labelPlacement="end"
                    sx={{
                      backgroundColor: "transparent",
                      backdropFilter: "blur(50px)",
                      "& .MuiFormControlLabel-label": {
                        fontSize: "12px",
                        color: "text.secondary",
                      },
                    }}
                  />
                </Box>
                <Box>
                  {announcement.Link1Title && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => openUrl(announcement.Link1URL)}
                    >
                      {announcement.Link1Title}
                    </Button>
                  )}
                  {announcement.Link2Title && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => openUrl(announcement.Link2URL)}
                    >
                      {announcement.Link2Title}
                    </Button>
                  )}
                  {announcement.Link3Title && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => openUrl(announcement.Link3URL)}
                    >
                      {announcement.Link3Title}
                    </Button>
                  )}
                </Box>
              </CardActions>
            </Card>
          </DialogContent>
        </Dialog>
      ))}
    </>

    // <>
    //   {currentCards.map((card) => (
    //     <Card
    //       key={card.id}
    //       sx={{
    //         display: "flex",
    //         height: "20vh",
    //         borderRadius: "10px",
    //         p: 2,
    //         boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
    //         transition: "box-shadow 0.3s ease",
    //         "&:hover": { boxShadow: "0px 6px 25px rgba(0,0,0,0.2)" },
    //         "@media screen and (min-width: 1100px)": {
    //           height: "25vh",
    //         },
    //       }}
    //     >
    //       <Fade in={checked}>
    //         <CardMedia
    //           component="img"
    //           sx={{ width: "30%" }}
    //           image={card.banner}
    //         />
    //       </Fade>
    //       <Fade in={checked}>
    //         <Box
    //           sx={{ display: "flex", flexDirection: "column", width: "67%" }}
    //         >
    //           <CardContent sx={{ flex: "1 0 auto" }}>
    //             <Typography component="div" variant="h5">
    //               {card.title}
    //             </Typography>
    //             <Typography
    //               variant="subtitle1"
    //               component="div"
    //               sx={{ color: "text.secondary", marginBottom: "1%" }}
    //             >
    //               {card.description}
    //             </Typography>
    //             {card.starttime !== "NA" && card.endtime != "NA" && (
    //               <Typography
    //                 variant="body1"
    //                 component="div"
    //                 sx={{ color: "text.secondary", marginBottom: "3%" }}
    //               >
    //                 <b>From: </b>
    //                 {card.starttime} <b>To: </b>
    //                 {card.endtime}
    //               </Typography>
    //             )}
    //             {card.link1 && (
    //               <Button
    //                 variant="contained"
    //                 endIcon={<OpenInNewIcon />}
    //                 key={card.link1}
    //                 onClick={() => {
    //                   openUrl(card.link1_url);
    //                 }}
    //                 sx={{
    //                   marginRight: "7px",
    //                   minWidth: "100px",
    //                   marginTop: "3%",
    //                 }}
    //               >
    //                 {card.link1}
    //               </Button>
    //             )}
    //             {card.link2 && (
    //               <Button
    //                 variant="contained"
    //                 endIcon={<OpenInNewIcon />}
    //                 key={card.link2}
    //                 onClick={() => {
    //                   openUrl(card.link2_url);
    //                 }}
    //                 sx={{
    //                   marginRight: "7px",
    //                   minWidth: "100px",
    //                   marginTop: "3%",
    //                 }}
    //               >
    //                 {card.link2}
    //               </Button>
    //             )}
    //           </CardContent>
    //         </Box>
    //       </Fade>
    //       <Pagination
    //         count={Math.ceil(announcement.length / cardsPerPage)}
    //         page={page}
    //         onChange={handleChange}
    //         variant="outlined"
    //         color="primary"
    //         size="small"
    //         hideNextButton
    //         hidePrevButton
    //         sx={{ alignSelf: "center", width: "5px" }}
    //       />
    //     </Card>
    //   ))}
    // </>
  );
}

export default Announcement;
