import { useState, useEffect } from "react";

import StatCard from "./StatCard";

export default function CompletedStatCard({
  data,
  intervalDay,
  intervalDayString,
}) {
  const [last30Days, setLast30Days] = useState(intervalDay);
  const [last30DaysStr, setLast30DaysStr] = useState(intervalDayString);
  const [completionDict, setCompletionDict] = useState({
    title: "Completed Submission",
    value: "0",
    interval: "Last 30 days",
    interval_date: last30DaysStr,
    trend: "neutral",
    trend_value: "0",
    data: [],
  });

  useEffect(() => {
    const dailyCounts = new Array(30).fill(0);
    last30Days.forEach((date, index) => {
      const filteredSubmission = data.filter(
        (submission) =>
          new Date(submission.modified) < date &&
          (submission.status === "Submitted" ||
            submission.status === "Accepted" ||
            submission.status === "Rejected")
      );
      dailyCounts[index] = filteredSubmission.length;
    });

    const monthlyDiff = dailyCounts[29] - dailyCounts[0];
    if (monthlyDiff > 0) {
      setCompletionDict((prevDict) => ({
        ...prevDict,
        trend: "up",
        trend_value: `+${monthlyDiff}`,
        value: `${dailyCounts[29]}`,
        data: dailyCounts,
      }));
    } else if (monthlyDiff < 0) {
      setCompletionDict((prevDict) => ({
        ...prevDict,
        trend: "down",
        trend_value: `-${monthlyDiff}`,
        value: `${dailyCounts[29]}`,
        data: dailyCounts,
      }));
    }
  }, [data, last30Days]);

  return <StatCard {...completionDict} />;
}
