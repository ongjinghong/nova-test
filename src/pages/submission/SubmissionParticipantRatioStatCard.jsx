import { useEffect } from "react";

import StatCard from "../../shared/StatCard";
import useSubmissionStore from "../../stores/SubmissionStore";
import useMemberStore from "../../stores/MemberStore";
import { getLast30Days } from "../../utils/Helpers";

export default function ParticipantRatioCard() {
  const data = useSubmissionStore((state) => state.filteredSubmissions);
  const members = useMemberStore((state) => state.filteredMembers);
  const heatParticipants = useMemberStore((state) => state.heatParticipants);
  const last30Days = getLast30Days(false);

  useEffect(() => {
    const dailyCounts = new Array(30).fill(0);
    const submittersSet = new Set();

    last30Days.forEach((date, index) => {
      const filteredSubmission = data.filter(
        (submission) => new Date(submission.Created) < new Date(date)
      );
      filteredSubmission.forEach((submit) => {
        if (
          members.some(
            (entry) => entry.Name === submit.PrimaryAuthor && entry.Active
          )
        ) {
          submittersSet.add(submit.PrimaryAuthor);
        }
        Array.isArray(submit.SecondaryAuthors) &&
          submit.SecondaryAuthors.forEach((author) => {
            if (
              members.some((entry) => entry.Name === author && entry.Active)
            ) {
              submittersSet.add(author);
            }
          });
      });

      dailyCounts[index] = submittersSet.size;
    });

    const participantRatio =
      (dailyCounts[29] / members.filter((item) => item.Active).length) * 100;

    const monthlyDiff = dailyCounts[29] - dailyCounts[0];
    if (monthlyDiff > 0) {
      useMemberStore.getState().setHeatParticipants({
        value: `${participantRatio.toFixed(2)}%`,
        trend: "up",
        trend_value: `+${monthlyDiff}`,
        data: dailyCounts,
        not_participated: members.filter(
          (item) => !submittersSet.has(item.Name) && item.Active
        ),
      });
    } else if (monthlyDiff < 0) {
      useMemberStore.getState().setHeatParticipants({
        value: `${participantRatio.toFixed(2)}%`,
        trend: "down",
        trend_value: `-${monthlyDiff}`,
        data: dailyCounts,
        not_participated: members.filter(
          (item) => !submittersSet.has(item.Name) && item.Active
        ),
      });
    } else if (monthlyDiff == 0) {
      useMemberStore.getState().setHeatParticipants({
        value: `${participantRatio.toFixed(2)}%`,
        trend: "neutral",
        trend_value: `${monthlyDiff}`,
        data: dailyCounts,
        not_participated: members.filter(
          (item) => !submittersSet.has(item.Name) && item.Active
        ),
      });
    }
  }, [data, members]);

  return <StatCard {...heatParticipants} />;
}
