import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const StatCard = ({
  title,
  data,
  icon_color,
  diff = 0,
  completion = false,
  icon: Icon,
}) => {
  return (
    <Card variant="outlined" sx={{ flexGrow: 1 }}>
      <Stack direction={"column"}>
        <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
          <CardContent>
            <Icon
              sx={{
                width: 36,
                height: 36,
                padding: 1,
                borderRadius: 20,
                bgcolor: icon_color,
                color: "white",
              }}
            />
            <Stack
              direction="column"
              sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
            >
              <Stack sx={{ justifyContent: "space-between" }}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                  <Typography
                    variant="h4"
                    component="p"
                    sx={{ fontWeight: "medium" }}
                  >
                    {data}
                  </Typography>
                  <Stack direction="column"></Stack>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
          <CardContent sx={{ flex: 1 }}>
            <Stack direction={"column"} alignItems={"end"}>
              {completion ? (
                <>
                  <Typography variant="caption" align="right">
                    Completed
                  </Typography>
                  <TaskAltIcon
                    sx={{
                      width: 36,
                      height: 36,
                      marginTop: 1,
                      color: "green",
                    }}
                  />
                </>
              ) : (
                <>
                  <Typography variant="caption" align="right">
                    {diff} {title} required
                  </Typography>
                </>
              )}
            </Stack>
          </CardContent>
        </Stack>
        <Typography
          component="h2"
          variant="subtitle2"
          gutterBottom
          sx={{ paddingLeft: "16px", paddingBottom: "8px" }}
        >
          {title}
        </Typography>
      </Stack>
    </Card>
  );
};

export default StatCard;
