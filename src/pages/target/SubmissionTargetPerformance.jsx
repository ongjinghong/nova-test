import { useState, useEffect } from "react";

import TargetRatioStatCard from "./TargetRatioStatCard";

export default function SubmissionCommitmentPerformance({ data, data2, intervalDay }) {
  const [last30Days, setLast30Days] = useState(intervalDay);
  const [totalDict, setTotalDict] = useState({
    title: "Submission / Target Ratio",
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

    const calculateSubmissionVsTargetRatio = (data.length / data2) * 100;

    const monthlyAccu = dailyCounts.reduce((acc, curr) => acc + curr, 0);
    if (monthlyAccu > 0) {
      setTotalDict((prevDict) => ({
        ...prevDict,
        value: `${calculateSubmissionVsTargetRatio.toFixed(2)}%`,
        interval_date: intervalDay,
        trend: "up",
        trend_value: `+${monthlyAccu}`,
        data: dailyCounts,
      }));
    } else if (monthlyAccu < 0) {
      setTotalDict((prevDict) => ({
        ...prevDict,
        value: `${calculateSubmissionVsTargetRatio.toFixed(2)}%`,
        interval_date: intervalDay,
        trend: "down",
        trend_value: `-${monthlyAccu}`,
        data: dailyCounts,
      }));
    } else if (monthlyAccu == 0) {
      setTotalDict((prevDict) => ({
        ...prevDict,
        value: `${calculateSubmissionVsTargetRatio.toFixed(2)}%`,
        interval_date: intervalDay,
        trend: "neutral",
        trend_value: `${monthlyAccu}`,
        data: dailyCounts,
      }));
    }
  }, [data, last30Days]);

  return <TargetRatioStatCard {...totalDict} />;
}