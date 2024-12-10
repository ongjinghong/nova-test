import { useState, useEffect } from "react";

import StatCard from "../../components/card/StatCard";
import { getLast30Days } from "../../utils/GeneralUtils";

export default function TotalStatCard({ data }) {
  const [last30Days, setLast30Days] = useState(getLast30Days(true));
  const [totalDict, setTotalDict] = useState({
    title: "Total Submission",
    value: "0",
    interval: "Last 30 days",
    interval_date: [],
    trend: "neutral",
    trend_value: "0",
    data: [],
  });

  useEffect(() => {
    const dailyCounts = new Array(30).fill(0);
    data.forEach((submit) => {
      const entryDate = new Date(submit.created);
      const formattedEntryDate = entryDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const index = last30Days.indexOf(formattedEntryDate);
      if (index !== -1) {
        dailyCounts[index] += 1;
      }
    });

    const monthlyAccu = dailyCounts.reduce((acc, curr) => acc + curr, 0);
    if (monthlyAccu > 0) {
      setTotalDict((prevDict) => ({
        ...prevDict,
        value: data.length.toString(),
        interval_date: last30Days,
        trend: "up",
        trend_value: `+${monthlyAccu}`,
        data: dailyCounts,
      }));
    } else if (monthlyAccu < 0) {
      setTotalDict((prevDict) => ({
        ...prevDict,
        value: data.length.toString(),
        interval_date: intervalDay,
        trend: "down",
        trend_value: `-${monthlyAccu}`,
        data: dailyCounts,
      }));
    } else if (monthlyAccu == 0) {
      setTotalDict((prevDict) => ({
        ...prevDict,
        value: data.length.toString(),
        interval_date: last30Days,
        trend: "neutral",
        trend_value: `${monthlyAccu}`,
        data: dailyCounts,
      }));
    }
  }, [data, last30Days]);

  return <StatCard {...totalDict} />;
}
