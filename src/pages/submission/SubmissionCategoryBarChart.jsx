import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";

import useAppStore from "../../stores/AppStore";
import useSubmissionStore from "../../stores/SubmissionStore";
import useColorConfig from "../../config/colorConfig";

export default function SubmissionCategoryBarChart() {
  const data = useSubmissionStore((state) => state.filteredSubmissions);
  const constants = useAppStore((state) => state.constants);
  const { categories, statuses } = constants;
  const { statusColors } = useColorConfig();
  const statusCategorySubmissions = useSubmissionStore(
    (state) => state.statusCategorySubmissions
  );

  useEffect(() => {
    const statusCategoryCount = {};

    statuses.forEach((status) => {
      statusCategoryCount[status] = categories.reduce((acc, category) => {
        acc[category] = 0;
        return acc;
      }, {});
    });

    data.forEach((item) => {
      if (
        statusCategoryCount.hasOwnProperty(item.Status) &&
        statusCategoryCount[item.Status].hasOwnProperty(item.Category)
      ) {
        statusCategoryCount[item.Status][item.Category]++;
      }
    });

    const newResult = {};
    statuses.forEach((status) => {
      newResult[status] = categories.map(
        (category) => statusCategoryCount[status][category]
      );
    });

    useSubmissionStore.getState().setStatusCategorySubmissions(newResult);
  }, [data, categories, statuses]);

  return (
    <Card variant="outlined">
      <CardContent sx={{ padding: 1 }}>
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
                      data.filter((item) => item.Category === code).length
                    })`
                  : `${code} (Total: ${
                      data.filter((item) => item.Category === code).length
                    })`,
            },
          ]}
          series={[
            {
              id: "new",
              label: "New",
              data: statusCategorySubmissions["NEW"],
              stack: "A",
            },
            {
              id: "wip",
              label: "WIP",
              data: statusCategorySubmissions["WIP"],
              stack: "A",
            },
            {
              id: "submitted",
              label: "Submitted",
              data: statusCategorySubmissions["Submitted"],
              stack: "B",
            },
            {
              id: "accepted",
              label: "Accepted",
              data: statusCategorySubmissions["Accepted"],
              stack: "B",
            },
            {
              id: "rejected",
              label: "Rejected",
              data: statusCategorySubmissions["Rejected"],
              stack: "B",
            },
            {
              id: "cancelled",
              label: "Cancelled",
              data: statusCategorySubmissions["Cancelled"],
              stack: "C",
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
