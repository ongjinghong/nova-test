import { useState, useEffect } from "react";

import StatCard from "../../shared/StatCard";
import useCommitmentStore from "../../stores/CommitmentStore";
import { getLast30Days } from "../../utils/Helpers";

export default function CommitmentTotalStatCard({ type }) {
  const data = useCommitmentStore((state) => state.filteredCommitments);
  const last30Days = getLast30Days(false);
  const last30daysShort = getLast30Days(true);
  const [totalDict, setTotalDict] = useState({
    title: `Total ${type} Commitment`,
    value: "0",
    interval: "Last 30 days",
    interval_date: [],
    trend: "neutral",
    trend_value: "0",
    data: [],
  });

  useEffect(() => {
    const dailyCounts = new Array(30).fill(0);

    last30Days.forEach((date, index) => {
      const filteredData = data.filter((entry) => {
        const entryDate = new Date(entry.Created);
        return entryDate < date;
      });
      if (type === "Primary") {
        dailyCounts[index] = filteredData.reduce(
          (sum, item) =>
            sum +
            (item.Conferences_Primary || 0) +
            (item.IDF_Primary || 0) +
            (item.Initiatives_Primary || 0) +
            (item.MicroInnovation_Primary || 0) +
            (item.OpenSource_Primary || 0),
          0
        );
      } else if (type === "Secondary") {
        dailyCounts[index] = filteredData.reduce(
          (sum, item) =>
            sum +
            (item.Conferences_Secondary || 0) +
            (item.IDF_Secondary || 0) +
            (item.Initiatives_Secondary || 0) +
            (item.Microinnovation_Secondary || 0) +
            (item.OpenSource_Secondary || 0),
          0
        );
      }
    });

    const monthlyDiff = dailyCounts[29] - dailyCounts[0];

    if (monthlyDiff > 0) {
      setTotalDict((prevDict) => ({
        ...prevDict,
        value: dailyCounts[29].toString(),
        interval_date: last30daysShort,
        trend: "up",
        trend_value: `+${monthlyDiff}`,
        data: dailyCounts,
      }));
    } else if (monthlyDiff < 0) {
      setTotalDict((prevDict) => ({
        ...prevDict,
        value: dailyCounts[29].toString(),
        interval_date: last30daysShort,
        trend: "down",
        trend_value: `-${monthlyDiff}`,
        data: dailyCounts,
      }));
    } else if (monthlyDiff == 0) {
      setTotalDict((prevDict) => ({
        ...prevDict,
        value: dailyCounts[29].toString(),
        interval_date: last30daysShort,
        trend: "neutral",
        trend_value: `${monthlyDiff}`,
        data: dailyCounts,
      }));
    }
  }, [data]);

  return <StatCard {...totalDict} />;
}
