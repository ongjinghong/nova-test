import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";

import useSubmissionStore from "../../stores/SubmissionStore";

export default function SubmissionMonthlyBarChart() {
  const data = useSubmissionStore((state) => state.filteredSubmissions);
  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];
  const [monthlyCounts, setMonthlyCounts] = useState(Array(12).fill(0));
  const [percentageChange, setPercentageChange] = useState("0%");
  const [performance, setPerformance] = useState("default");
  const [totalYearCount, setTotalYearCount] = useState(0);

  useEffect(() => {
    const counts = Array(12).fill(0);

    data
      .filter((item) => item.ListID !== "1")
      .forEach((item) => {
        const date = new Date(item.Created);
        const month = date.getUTCMonth();
        counts[month]++;
      });

    setMonthlyCounts(counts);

    const totalCount = counts.reduce((total, count) => total + count, 0);
    setTotalYearCount(totalCount);

    // Get the current month (0 = January, 11 = December)
    const currentDate = new Date();
    const currentMonth = currentDate.getUTCMonth();
    const previousMonth = currentMonth - 1;

    const currentMonthCount = counts[currentMonth];
    const previousMonthCount = currentMonth === 1 ? 0 : counts[previousMonth];

    let change;
    if (previousMonthCount === 0) {
      change = currentMonthCount > 0 ? 100 : 0;
    } else {
      change =
        ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
    }
    if (change > 0) {
      setPerformance("success");
      setPercentageChange(`+${change.toFixed(2)}%`);
    } else if (change < 0) {
      setPerformance("error");
      setPercentageChange(`-${change.toFixed(2)}%`);
    }
  }, [data]);

  return (
    <Card variant="outlined">
      <CardContent sx={{ padding: 1 }}>
        <Stack direction="row" sx={{ gap: 1 }}>
          <Typography component="h2" variant="subtitle2" gutterBottom>
            Monthly Submission Chart
          </Typography>
          {/* <Chip size="small" color={performance} label={percentageChange} /> */}
        </Stack>

        {/* <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {to}
            </Typography>
            
          </Stack>
        </Stack> */}
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "band",
              categoryGapRatio: 0.5,
              data: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
            },
          ]}
          series={[
            {
              id: "submission",
              label: "Submission",
              data: monthlyCounts,
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
