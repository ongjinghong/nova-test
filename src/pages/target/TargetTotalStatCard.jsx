import { useState, useEffect } from "react";

import StatCard from "../../shared/StatCard";
import useTargetStore from "../../stores/TargetStore";
import { getLast30Days } from "../../utils/Helpers";

export default function TargetTotalStatCard() {
  const data = useTargetStore((state) => state.filteredTargets);
  const last30Days = getLast30Days(false);
  const last30daysShort = getLast30Days(true);
  const [totalDict, setTotalDict] = useState({
    title: `Total Target`,
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
      dailyCounts[index] = filteredData.reduce(
        (sum, item) =>
          sum +
          (item.Conference || 0) +
          (item.IDF || 0) +
          (item.POC_x002f_Pitching || 0) +
          (item.Micro_x002d_Innovation || 0) +
          (item.OpenSource || 0),
        0
      );
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
