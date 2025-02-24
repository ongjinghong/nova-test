import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  DialogContent,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";

import useAppStore from "../stores/AppStore";
import useMemberStore from "../stores/MemberStore";

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

function StatCard({
  title,
  value,
  interval,
  interval_date,
  trend,
  trend_value,
  data,
  not_participated = [],
}) {
  const appMode = useAppStore((state) => state.appMode);
  const loginMember = useMemberStore((state) => state.loginMember);
  const theme = useTheme();
  const [openList, setOpenList] = useState(false);

  const trendColors = {
    up:
      theme.palette.mode === "light"
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === "light"
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === "light"
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: "success",
    down: "error",
    neutral: "default",
  };

  const color = labelColors[trend];
  const chartColor = trendColors[trend];

  const handleOpenList = () => {
    setOpenList(true);
  };

  const handleCloseList = () => {
    setOpenList(false);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{ height: "15vh", minHeight: 175, flexGrow: 1 }}
      >
        <CardContent sx={{ paddingBottom: "10px" }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
          >
            <Stack direction="column">
              <Typography component="h2" variant="subtitle2">
                {title}
              </Typography>
              <Typography variant="h4" component="p">
                {value}
              </Typography>
            </Stack>

            <Stack direction="column">
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {interval}
              </Typography>
              <Chip size="small" color={color} label={trend_value} />
              {not_participated.length > 0 &&
                (appMode === "Innovation" || appMode === "Manager") && (
                  <Chip
                    size="small"
                    icon={<VisibilityIcon sx={{ fontSize: "10px" }} />}
                    label="View"
                    onClick={handleOpenList}
                    color="primary"
                    sx={{ mt: 0.5, fontSize: "10px" }}
                  />
                )}
            </Stack>
          </Stack>

          <Box sx={{ width: "100%" }}>
            <SparkLineChart
              colors={[chartColor]}
              data={data}
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: "band",
                data: interval_date,
              }}
              height={80}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${value})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={`area-gradient-${value}`} />
            </SparkLineChart>
          </Box>
        </CardContent>
      </Card>
      <Dialog
        onClose={handleCloseList}
        open={openList}
        maxWidth="xs"
        fullWidth // ensures dialog takes full width within maxWidth
        PaperProps={{
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50%",
          },
        }}
      >
        <DialogTitle>
          Not Participate List({not_participated.length})
        </DialogTitle>
        <DialogContent sx={{ width: "85%" }}>
          <List component="a">
            {not_participated.map((member) => (
              <ListItem
                key={member.LookupId}
                disableGutters
                secondaryAction={
                  <Chip
                    aria-label="comment"
                    size="small"
                    label={
                      member.Role.includes("Manager") ? "Manager" : "Member"
                    }
                    color={
                      member.Role.includes("Manager") ? "primary" : "default"
                    }
                  ></Chip>
                }
              >
                <ListItemText primary={`${member.Name}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseList} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

StatCard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  interval: PropTypes.string.isRequired,
  interval_date: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(["down", "neutral", "up"]).isRequired,
  trend_value: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default StatCard;
