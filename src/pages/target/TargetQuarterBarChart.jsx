import { useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import useColorConfig from "../../config/colorConfig";

import useAppStore from "../../stores/AppStore";
import useTargetStore from "../../stores/TargetStore";

export default function TargetQuarterBarChart() {
  const data = useTargetStore((state) => state.filteredTargets);
  const quarterTargets = useTargetStore((state) => state.quarterTargets);
  const { quarters } = useAppStore((state) => state.constants);
  const { categoryColors } = useColorConfig();

  useEffect(() => {
    const quarterData = quarters.map((quarter) => {
      const quarterDict = {
        Quarter: quarter,
        Sum: 0,
        Conference: 0,
        IDF: 0,
        POC_x002f_Pitching: 0,
        Micro_x002d_Innovation: 0,
        OpenSource: 0,
      };

      data.forEach((item) => {
        if (item.Quarter === quarter) {
          quarterDict.Sum +=
            item.Conference +
            item.IDF +
            item.POC_x002f_Pitching +
            item.Micro_x002d_Innovation +
            item.OpenSource;
          quarterDict.Conference += item.Conference;
          quarterDict.IDF += item.IDF;
          quarterDict.POC_x002f_Pitching += item.POC_x002f_Pitching;
          quarterDict.Micro_x002d_Innovation += item.Micro_x002d_Innovation;
          quarterDict.OpenSource += item.OpenSource;
        }
      });

      return quarterDict;
    });
    useTargetStore.getState().setQuarterTargets(quarterData);
  }, [data]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Total Target Chart
        </Typography>
        <BarChart
          borderRadius={8}
          colors={Object.values(categoryColors)}
          xAxis={[
            {
              scaleType: "band",
              categoryGapRatio: 0.5,
              data: quarters,
              tickFontSize: 10,
              valueFormatter: (code, context) =>
                context.location === "tick" ? code : `${code}`,
            },
          ]}
          series={[
            {
              id: "conferences",
              label: "Conferences",
              data: quarterTargets?.map((q) => q.Conference),
            },
            {
              id: "idf",
              label: "IDF",
              data: quarterTargets?.map((q) => q.IDF),
            },
            {
              id: "initiatives",
              label: "Initiatives",
              data: quarterTargets?.map((q) => q.POC_x002f_Pitching),
            },
            {
              id: "microinnovation",
              label: "MicroInnovation",
              data: quarterTargets?.map((q) => q.Micro_x002d_Innovation),
            },
            {
              id: "opensource",
              label: "OpenSource",
              data: quarterTargets?.map((q) => q.OpenSource),
            },
          ]}
          height={250}
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
