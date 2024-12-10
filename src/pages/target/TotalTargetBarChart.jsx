import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import useColorConfig from "../../config/colorConfig";

export default function TotalTargetBarChart({ data }) {
  const { quarterColors } = useColorConfig();
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const categories = [
    "Conferences",
    "IDF",
    "Initiatives",
    "Microinnovation",
    "Open Source",
    "Knowlege Sharing",
  ];

  const result = data.reduce((acc, curr) => {
    if (!acc[`Q${curr.quarter}`]) {
      acc[`Q${curr.quarter}`] = [0, 0, 0, 0, 0, 0]; // Initialize [totalCommitment, totalSubmission, totalTarget]
    }

    acc[`Q${curr.quarter}`][0] += curr.conferences;
    acc[`Q${curr.quarter}`][1] += curr.idf;
    acc[`Q${curr.quarter}`][2] += curr.initiatives;
    acc[`Q${curr.quarter}`][3] += curr.microinnovation;
    acc[`Q${curr.quarter}`][4] += curr.opensource;
    acc[`Q${curr.quarter}`][5] += curr.sharing || 0;

    return acc;
  }, {});

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Total Target Chart
        </Typography>
        <BarChart
          borderRadius={8}
          colors={Object.values(quarterColors)}
          xAxis={[
            {
              scaleType: "band",
              categoryGapRatio: 0.5,
              data: categories,
              tickFontSize: 10,
              valueFormatter: (code, context) =>
                context.location === "tick" ? code : `${code}`,
            },
          ]}
          series={[
            {
              id: "q1",
              label: "Q1",
              data: result["Q1"],
              stack: "A",
            },
            {
              id: "q2",
              label: "Q2",
              data: result["Q2"],
              stack: "A",
            },
            {
              id: "q3",
              label: "Q3",
              data: result["Q3"],
              stack: "A",
            },
            {
              id: "q4",
              label: "Q4",
              data: result["Q4"],
              stack: "A",
            },
          ]}
          height={400}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
