import { useState, useEffect } from "react";

import StatCard from "../../shared/StatCard";
import useSubmissionStore from "../../stores/SubmissionStore";
import { getLast30Days } from "../../utils/Helpers";

export default function SubmissionTotalStatCard() {
  const data = useSubmissionStore((state) => state.filteredSubmissions);
  const heatSubmissions = useSubmissionStore((state) => state.heatSubmissions);
  const last30Days = getLast30Days(true);

  useEffect(() => {
    const filteredData = data.filter((item) => item.ListID !== "1");
    const dailyCounts = new Array(30).fill(0);
    filteredData.forEach((submission) => {
      const entryDate = new Date(submission.Created);
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
      useSubmissionStore.getState().setHeatSubmissions({
        value: filteredData.length.toString(),
        interval_date: last30Days,
        trend: "up",
        trend_value: `+${monthlyAccu}`,
        data: dailyCounts,
      });
    } else if (monthlyAccu < 0) {
      useSubmissionStore.getState().setHeatSubmissions({
        value: filteredData.length.toString(),
        interval_date: last30Days,
        trend: "down",
        trend_value: `-${monthlyAccu}`,
        data: dailyCounts,
      });
    } else if (monthlyAccu == 0) {
      useSubmissionStore.getState().setHeatSubmissions({
        value: filteredData.length.toString(),
        interval_date: last30Days,
        trend: "neutral",
        trend_value: `${monthlyAccu}`,
        data: dailyCounts,
      });
    }
  }, [data]);

  return <StatCard {...heatSubmissions} />;
}
