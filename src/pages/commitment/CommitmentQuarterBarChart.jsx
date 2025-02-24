import { useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";

import useAppStore from "../../stores/AppStore";
import useCommitmentStore from "../../stores/CommitmentStore";

export default function CommitmentQuarterBarChart({ type = "Primary" }) {
  const data = useCommitmentStore((state) => state.filteredCommitments);
  const quarterCommitments = useCommitmentStore(
    (state) => state.quarterCommitments
  );
  const { quarters } = useAppStore((state) => state.constants);

  useEffect(() => {
    const quarterData = quarters.map((quarter) => {
      const quarterDict = {
        Quarter: quarter,
        Sum_Primary: 0,
        Sum_Secondary: 0,
        Conferences_Primary: 0,
        IDF_Primary: 0,
        Initiatives_Primary: 0,
        MicroInnovation_Primary: 0,
        OpenSource_Primary: 0,
        Conferences_Secondary: 0,
        IDF_Secondary: 0,
        Initiatives_Secondary: 0,
        MicroInnovation_Secondary: 0,
        OpenSource_Secondary: 0,
      };

      data.forEach((item) => {
        if (item.Quarter === quarter) {
          quarterDict.Sum_Primary +=
            item.Conferences_Primary +
            item.IDF_Primary +
            item.Initiatives_Primary +
            item.MicroInnovation_Primary +
            item.OpenSource_Primary;
          quarterDict.Conferences_Primary += item.Conferences_Primary;
          quarterDict.IDF_Primary += item.IDF_Primary;
          quarterDict.Initiatives_Primary += item.Initiatives_Primary;
          quarterDict.MicroInnovation_Primary += item.MicroInnovation_Primary;
          quarterDict.OpenSource_Primary += item.OpenSource_Primary;

          quarterDict.Sum_Secondary +=
            item.Conferences_Secondary +
            item.IDF_Secondary +
            item.Initiatives_Secondary +
            item.MicroInnovation_Secondary +
            item.OpenSource_Secondary;
          quarterDict.Conferences_Secondary += item.Conferences_Secondary;
          quarterDict.IDF_Secondary += item.IDF_Secondary;
          quarterDict.Initiatives_Secondary += item.Initiatives_Secondary;
          quarterDict.MicroInnovation_Secondary +=
            item.MicroInnovation_Secondary;
          quarterDict.OpenSource_Secondary += item.OpenSource_Secondary;
        }
      });

      return quarterDict;
    });

    useCommitmentStore.getState().setQuarterCommitments(quarterData);
  }, [data]);

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

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography component="h2" variant="body2" gutterBottom>
          Total {type} Commitment Chart
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
                const totalSum =
                  type === "Primary"
                    ? quarterCommitments.find((q) => q.Quarter === code)
                        ?.Sum_Primary
                    : quarterCommitments.find((q) => q.Quarter === code)
                        ?.Sum_Secondary || 0;
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
              data: quarterCommitments?.map((q) =>
                type === "Primary"
                  ? q.Conferences_Primary
                  : q.Conferences_Secondary
              ),
            },
            {
              id: "idf",
              label: "IDF",
              data: quarterCommitments?.map((q) =>
                type === "Primary" ? q.IDF_Primary : q.IDF_Secondary
              ),
            },
            {
              id: "initiative",
              label: "Initiative",
              data: quarterCommitments?.map((q) =>
                type === "Primary"
                  ? q.Initiatives_Primary
                  : q.Initiatives_Secondary
              ),
            },
            {
              id: "microinnovation",
              label: "Micro Innovation",
              data: quarterCommitments?.map((q) =>
                type === "Primary"
                  ? q.MicroInnovation_Primary
                  : q.MicroInnovation_Secondary
              ),
            },
            {
              id: "opensource",
              label: "Open Source",
              data: quarterCommitments?.map((q) =>
                type === "Primary"
                  ? q.OpenSource_Primary
                  : q.OpenSource_Secondary
              ),
            },
          ]}
          height={300}
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
