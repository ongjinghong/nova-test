import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import useColorConfig from "../../config/colorConfig";

export default function SubmissionCategoryBarChart({ data }) {
  const { statusColors } = useColorConfig();
  const categories = [
    "Conferences",
    "IDF",
    "Initiatives",
    "Micro-Innovation",
    "Open Source",
    "Knowledge Sharing",
  ];
  const statuses = [
    "NEW",
    "WIP",
    "Submitted",
    "Accepted",
    "Rejected",
    "Cancelled",
  ];
  const statusCategoryCount = {};

  statuses.forEach((status) => {
    statusCategoryCount[status] = categories.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {});
  });

  data.forEach((item) => {
    if (
      statusCategoryCount.hasOwnProperty(item.status) &&
      statusCategoryCount[item.status].hasOwnProperty(item.category)
    ) {
      statusCategoryCount[item.status][item.category]++;
    }
  });

  const result = {};
  statuses.forEach((status) => {
    result[status] = categories.map(
      (category) => statusCategoryCount[status][category]
    );
  });

  const totalSum = Object.values(result)
    .flat() // Flatten the arrays for each status
    .reduce((sum, num) => sum + num, 0); // Sum all the numbers

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Category Submission Chart
        </Typography>
        <BarChart
          borderRadius={8}
          colors={Object.values(statusColors)}
          xAxis={[
            {
              scaleType: "band",
              categoryGapRatio: 0.5,
              data: categories,
              tickFontSize: 10,
              valueFormatter: (code, context) =>
                context.location === "tick"
                  ? `${code}(${
                      data.filter((item) => item.category === code).length
                    })`
                  : `${code} (Total: ${
                      data.filter((item) => item.category === code).length
                    })`,
            },
          ]}
          series={[
            {
              id: "new",
              label: "New",
              data: result["NEW"],
              stack: "A",
            },
            {
              id: "wip",
              label: "WIP",
              data: result["WIP"],
              stack: "A",
            },
            {
              id: "submitted",
              label: "Submitted",
              data: result["Submitted"],
              stack: "A",
            },
            {
              id: "accepted",
              label: "Accepted",
              data: result["Accepted"],
              stack: "A",
            },
            {
              id: "rejected",
              label: "Rejected",
              data: result["Rejected"],
              stack: "A",
            },
            {
              id: "cancelled",
              label: "Cancelled",
              data: result["Cancelled"],
              stack: "A",
            },
          ]}
          height={250}
          margin={{ left: 30, right: 0, top: 20, bottom: 20 }}
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
