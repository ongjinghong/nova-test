import { useState, useEffect } from "react";

import StatCard from "../../components/card/StatCard";
import { getLast30Days } from "../../utils/GeneralUtils";

export default function RatioStatCard({ data, member }) {
  const [last30Days, setLast30Days] = useState(getLast30Days(false));
  const [last30DaysStr, setLast30DaysStr] = useState(getLast30Days(true));
  const [ratioDict, setRatioDict] = useState({
    title: "Participant Ratio",
    value: "0",
    interval: "Last 30 days",
    interval_date: last30DaysStr,
    trend: "neutral",
    trend_value: "0",
    data: [],
    not_participated: [],
  });

  useEffect(() => {
    const dailyCounts = new Array(30).fill(0);
    const submittersSet = new Set();

    last30Days.forEach((date, index) => {
      const filteredSubmission = data.filter(
        (submission) => new Date(submission.created) < new Date(date)
      );
      filteredSubmission.forEach((submit) => {
        if (
          member.some(
            (entry) => entry.lookupid === submit.author1 && entry.flex
          )
        ) {
          submittersSet.add(submit.author1);
        }
        Array.isArray(submit.author2) &&
          submit.author2.forEach((author) => {
            if (
              member.some(
                (entry) =>
                  entry.lookupid === String(author.LookupId) && entry.flex
              )
            ) {
              submittersSet.add(String(author.LookupId));
            }
          });
      });
      dailyCounts[index] = submittersSet.size;
    });

    const participantRatio =
      (dailyCounts[29] / member.filter((item) => item.flex).length) * 100;

    const monthlyDiff = dailyCounts[29] - dailyCounts[0];
    if (monthlyDiff > 0) {
      setRatioDict((prevDict) => ({
        ...prevDict,
        trend: "up",
        trend_value: `+${monthlyDiff}`,
        value: `${participantRatio.toFixed(2)}%`,
        data: dailyCounts,
        not_participated: member.filter(
          (item) => !submittersSet.has(item.lookupid) && item.flex
        ),
      }));
    } else if (monthlyDiff < 0) {
      setRatioDict((prevDict) => ({
        ...prevDict,
        trend: "down",
        trend_value: `-${monthlyDiff}`,
        value: `${participantRatio.toFixed(2)}%`,
        data: dailyCounts,
        not_participated: member.filter(
          (item) => !submittersSet.has(item.lookupid) && item.flex
        ),
      }));
    } else if (monthlyDiff == 0) {
      setRatioDict((prevDict) => ({
        ...prevDict,
        trend: "neutral",
        trend_value: `${monthlyDiff}`,
        value: `${participantRatio.toFixed(2)}%`,
        data: dailyCounts,
        not_participated: member.filter(
          (item) => !submittersSet.has(item.lookupid) && item.flex
        ),
      }));
    }
  }, [data, member, last30Days]);

  return <StatCard {...ratioDict} />;
}
