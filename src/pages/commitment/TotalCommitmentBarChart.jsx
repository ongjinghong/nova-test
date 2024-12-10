import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";

export default function TotalCommitmentBarChart({ data }) {
  const colorPalette = [
    "#016FC4",
    "#3DC6C3",
    "#F09C23",
    "#BC5090",
    "#003F5C",
    "#5A8BB0",
    "#7AC1C0",
    "#D89A4A",
    "#A96A8A",
    "#4D5A6A",
  ];
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const primaryStatuses = [
    "Conference",
    "IDF",
    "Initiatives",
    "Micro-Innovation",
    "Open Source",
  ];
  const secondaryStatuses = [
    "Conference 2nd.",
    "IDF 2nd.",
    "Initiatives 2nd.",
    "Micro-Innovation 2nd.",
    "Open Source 2nd.",
  ];
  const commitCategoryMap = {
    conf: "Conference",
    conf2: "Conference 2nd.",
    idf: "IDF",
    idf2: "IDF 2nd.",
    init: "Initiatives",
    init2: "Initiatives 2nd.",
    uinvt: "Micro-Innovation",
    uinvt2: "Micro-Innovation 2nd.",
    opensrc: "Open Source",
    opensrc2: "Open Source 2nd.",
  };
  const quarterCommitCount = {};

  [...primaryStatuses, ...secondaryStatuses].forEach((status) => {
    quarterCommitCount[status] = quarters.reduce((acc, quarter) => {
      acc[quarter] = 0;
      return acc;
    }, {});
  });

  data.forEach((item) => {
    [...primaryStatuses, ...secondaryStatuses].forEach((category) => {
      Object.keys(commitCategoryMap).forEach((key) => {
        if (commitCategoryMap[key] === category && item[key] > 0) {
          quarterCommitCount[category][`Q${item.quarter}`] += 1;
        }
      });
    });
  });

  const result = {};
  [...primaryStatuses, ...secondaryStatuses].forEach((status) => {
    result[status] = quarters.map((quarter) => {
      return quarterCommitCount[status][quarter];
    });
  });

  const totalSum = Object.values(result)
    .flat() // Flatten the arrays for each status
    .reduce((sum, num) => sum + num, 0); // Sum all the numbers

  const sumCategoryByQuarter = (data) => {
    return data.reduce((acc, item) => {
      const quarter = `Q${item.quarter}`;
      const totalSum =
        item.conf +
        item.conf2 +
        item.idf +
        item.idf2 +
        item.init +
        item.init2 +
        item.uinvt +
        item.uinvt2 +
        item.opensrc +
        item.opensrc2;

      if (!acc[quarter]) {
        acc[quarter] = 0;
      }

      acc[quarter] += totalSum;

      return acc;
    }, {});
  };

  const totalSumsByQuarter = sumCategoryByQuarter(data);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Total Commitment Chart
        </Typography>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "band",
              categoryGapRatio: 0.5,
              data: quarters,
              tickFontSize: 10,
              valueFormatter: (code, context) => {
                const totalSum = totalSumsByQuarter[code];
                return context.location === "tick"
                  ? code
                  : `${code} (Total: ${totalSum})`;
              },
            },
          ]}
          series={[
            {
              id: "conference",
              label: "Conference",
              data: result["Conference"],
              stack: "primary",
            },
            {
              id: "idf",
              label: "IDF",
              data: result["IDF"],
              stack: "primary",
            },
            {
              id: "initiative",
              label: "Initiative",
              data: result["Initiatives"],
              stack: "primary",
            },
            {
              id: "microinno",
              label: "Micro Innovation",
              data: result["Micro-Innovation"],
              stack: "primary",
            },
            {
              id: "opensource",
              label: "Open Source",
              data: result["Open Source"],
              stack: "primary",
            },
            {
              id: "conference2",
              label: "Conference 2nd.",
              data: result["Conference 2nd."],
              stack: "secondary",
            },
            {
              id: "idf2",
              label: "IDF 2nd.",
              data: result["IDF 2nd."],
              stack: "secondary",
            },
            {
              id: "initiative2",
              label: "Initiatives 2nd.",
              data: result["Initiatives 2nd."],
              stack: "secondary",
            },
            {
              id: "microinno2",
              label: "Micro Innovation 2nd.",
              data: result["Micro-Innovation 2nd."],
              stack: "secondary",
            },
            {
              id: "opensource2",
              label: "Open Source 2nd.",
              data: result["Open Source 2nd."],
              stack: "secondary",
            },
          ]}
          height={400}
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
