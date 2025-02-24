import { useState, useEffect } from "react";

import StatCard from "./StatCard";
import { getLast30Days } from "../utils/Helpers";

export default function PerformanceCard({
  data,
  dataType,
  secondData,
  secondDataType,
}) {
  const last30Days = getLast30Days(false);
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
      const filteredData = data?.filter(
        (entry) => new Date(entry.Created) < date
      );
      if (dataType === "Commitment") {
        dataCount = filteredData?.reduce(
          (sum, item) =>
            sum +
            (item.Conferences_Primary || 0) +
            (item.IDF_Primary || 0) +
            (item.Initiatives_Primary || 0) +
            (item.MicroInnovation_Primary || 0) +
            (item.OpenSource_Primary || 0),
          0
        );
      } else if (dataType === "Target") {
        dataCount = filteredData?.reduce(
          (sum, item) =>
            sum +
            (item.Conference || 0) +
            (item.IDF || 0) +
            (item.POC_x002f_Pitching || 0) +
            (item.Micro_x002d_Innovation || 0) +
            (item.OpenSource || 0),
          0
        );
      }

      console.log(dataCount);

      const filteredSecondData = secondData?.filter(
        (entry) => new Date(entry.Created) < date
      );

      const secondDataCount =
        secondDataType === "Submission"
          ? filteredSecondData.length
          : secondDataType === "Target"
          ? filteredSecondData?.reduce(
              (sum, item) =>
                sum +
                (item.Conference || 0) +
                (item.IDF || 0) +
                (item.POC_x002f_Pitching || 0) +
                (item.Micro_x002d_Innovation || 0) +
                (item.OpenSource || 0),
              0
            )
          : filteredSecondData?.reduce(
              (sum, item) =>
                sum +
                (item.Conferences_Primary || 0) +
                (item.IDF_Primary || 0) +
                (item.Initiatives_Primary || 0) +
                (item.MicroInnovation_Primary || 0) +
                (item.OpenSource_Primary || 0),
              0
            );

      console.log(secondDataCount);
      dailyCounts[index] =
        dataCount !== 0
          ? parseFloat((dataCount / secondDataCount) * 100).toFixed(2)
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
  }, [data, secondData]);

  return <StatCard {...totalDict} />;
}
