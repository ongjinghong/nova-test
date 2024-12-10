import { useState, useEffect } from "react";

import StatCard from "../../components/card/StatCard";
import { getLast30Days } from "../../utils/GeneralUtils";

export default function TotalCommitmentCard({ data, type, last30Days }) {
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
        const entryDate = new Date(entry.created);
        return entryDate < date;
      });
      if (type === "Primary") {
        dailyCounts[index] = filteredData.reduce(
          (sum, item) =>
            sum +
            (item.conf || 0) +
            (item.idf || 0) +
            (item.init || 0) +
            (item.uinvt || 0) +
            (item.opensrc || 0),
          0
        );
      } else if (type === "Secondary") {
        dailyCounts[index] = filteredData.reduce(
          (sum, item) =>
            sum +
            (item.conf2 || 0) +
            (item.idf2 || 0) +
            (item.init2 || 0) +
            (item.uinvt2 || 0) +
            (item.opensrc2 || 0),
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
  }, [data, last30Days]);

  return <StatCard {...totalDict} />;
}
