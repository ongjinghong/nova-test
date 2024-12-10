import { useState, useEffect } from "react";

import StatCard from "./StatCard";
import { getLast30Days } from "../../utils/GeneralUtils";

export default function PerformanceCard({
  data,
  dataType,
  secondData,
  secondDataType,
  last30Days,
}) {
  const last30daysShort = getLast30Days(true);
  const [totalDict, setTotalDict] = useState({
    title: `${secondDataType}/${dataType} Ratio`,
    value: "0",
    interval: "Last 30 days",
    interval_date: [],
    trend: "neutral",
    trend_value: "0",
    data: [],
  });

  useEffect(() => {
    const dailyCounts = new Array(30).fill(0);
    let dataCount = 0;

    last30Days.forEach((date, index) => {
      const filteredData = data.filter(
        (entry) => new Date(entry.created) < date
      );
      if (dataType === "Commitment") {
        dataCount = filteredData.reduce(
          (sum, item) =>
            sum +
            (item.conf || 0) +
            (item.idf || 0) +
            (item.init || 0) +
            (item.uinvt || 0) +
            (item.opensrc || 0),
          0
        );
      } else if (dataType === "Target") {
        dataCount = filteredData.reduce(
          (sum, item) =>
            sum +
            (item.conferences || 0) +
            (item.idf || 0) +
            (item.initiatives || 0) +
            (item.microinnovation || 0) +
            (item.opensource || 0),
          0
        );
      }
      const filteredSecondData = secondData.filter(
        (entry) => new Date(entry.created) < date
      );

      dailyCounts[index] =
        dataCount !== 0
          ? parseFloat(
              (
                ((secondDataType === "Submission"
                  ? filteredSecondData.length
                  : filteredSecondData.reduce(
                      (sum, item) =>
                        sum +
                        (item.conf || 0) +
                        (item.idf || 0) +
                        (item.init || 0) +
                        (item.uinvt || 0) +
                        (item.opensrc || 0),
                      0
                    )) /
                  dataCount) *
                100
              ).toFixed(2)
            )
          : 0;
    });

    const monthlyDiff = parseFloat(
      (dailyCounts[29] - dailyCounts[0]).toFixed(2)
    );

    if (monthlyDiff > 0) {
      setTotalDict((prevDict) => ({
        ...prevDict,
        value: `${dailyCounts[29]}%`,
        interval_date: last30daysShort,
        trend: "up",
        trend_value: `+${monthlyDiff}%`,
        data: dailyCounts,
      }));
    } else if (monthlyDiff < 0) {
      setTotalDict((prevDict) => ({
        ...prevDict,
        value: `${dailyCounts[29]}%`,
        interval_date: last30daysShort,
        trend: "down",
        trend_value: `-${monthlyDiff}%`,
        data: dailyCounts,
      }));
    } else if (monthlyDiff == 0) {
      setTotalDict((prevDict) => ({
        ...prevDict,
        value: `${dailyCounts[29]}%`,
        interval_date: last30daysShort,
        trend: "neutral",
        trend_value: `${monthlyDiff}%`,
        data: dailyCounts,
      }));
    }
  }, [data, secondData, last30Days]);

  return <StatCard {...totalDict} />;
}
