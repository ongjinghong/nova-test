import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const StyledText = styled("text", {
  shouldForwardProp: (prop) => prop !== "variant",
})(({ theme }) => ({
  textAnchor: "middle",
  dominantBaseline: "central",
  fill: (theme.vars || theme).palette.text.secondary,
  variants: [
    {
      props: {
        variant: "primary",
      },
      style: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    {
      props: ({ variant }) => variant !== "primary",
      style: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    {
      props: {
        variant: "primary",
      },
      style: {
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: ({ variant }) => variant !== "primary",
      style: {
        fontWeight: theme.typography.body2.fontWeight,
      },
    },
  ],
}));

function PieCenterLabel({ primaryText, secondaryText }) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
    <React.Fragment>
      <StyledText variant="primary" x={left + width / 2} y={primaryY}>
        {primaryText}
      </StyledText>
      <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
        {secondaryText}
      </StyledText>
    </React.Fragment>
  );
}

PieCenterLabel.propTypes = {
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
};

const colors = [
  "#001e50",
  "#00377c",
  "#0054ae",
  "#0099ec",
  "#6cc4f5",
  "#005b85",
  "#0095ca",
  "#00c7fd",
  "#6ddcff",
  "#a0ebff",
];

export default function SitePieChart({ data }) {
  const [siteData, setSiteData] = useState([]);

  useEffect(() => {
    const siteCounts = {};
    const total = data.length;

    // Loop through each submission
    data.forEach((submission) => {
      // Loop through each site in the submission
      submission.site.forEach((site) => {
        // If the site is already in the object, increment its count
        if (siteCounts[site]) {
          siteCounts[site]++;
        } else {
          // Otherwise, set it to 1
          siteCounts[site] = 1;
        }
      });
    });

    const result = Object.keys(siteCounts)
      .map((site) => ({
        label: site,
        value: siteCounts[site],
        percent: Number(((siteCounts[site] / total) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.percent - a.percent);

    setSiteData(result);
  }, [data]);

  return (
    <Card
      variant="outlined"
      sx={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          Submission by Site
        </Typography>
        {siteData.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PieChart
              colors={colors}
              margin={{
                left: 80,
                right: 80,
                top: 80,
                bottom: 80,
              }}
              series={[
                {
                  data: siteData,
                  innerRadius: 75,
                  outerRadius: 100,
                  paddingAngle: 0,
                  highlightScope: { faded: "global", highlighted: "item" },
                },
              ]}
              height={260}
              width={260}
              slotProps={{
                legend: { hidden: true },
              }}
            >
              <PieCenterLabel
                primaryText={data.length.toString()}
                secondaryText="Total"
              />
            </PieChart>
          </Box>
        )}
        <Box sx={{ height: "182px", overflowY: "auto" }}>
          {siteData.map((item, index) => (
            <Stack
              key={index}
              direction="row"
              sx={{ alignItems: "center", gap: 2, pb: 2 }}
            >
              <Stack sx={{ gap: 1, flexGrow: 1 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "500" }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.percent}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  aria-label="Number of submission by site"
                  value={item.percent}
                  sx={{
                    [`& .${linearProgressClasses.bar}`]: {
                      backgroundColor: "hsl(220, 25%, 45%)",
                    },
                  }}
                />
              </Stack>
            </Stack>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
