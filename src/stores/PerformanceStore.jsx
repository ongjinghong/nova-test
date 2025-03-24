import { create } from "zustand";
import useAppStore from "./AppStore";
import useCommitmentStore from "./CommitmentStore";
import useSubmissionStore from "./SubmissionStore";
import useMemberStore from "./MemberStore";

const usePerformanceStore = create((set) => ({
  data: [],
  column_headers: [
    "Indicators",
    "AMR Engineering",
    "GEAR Engineering",
    "MY Engineering",
    "PRC Engineering",
    "TFM",
    "OMS",
    "FC",
  ],
  filters: [],
  commitmentData: {
    quarter: [],
    total: [],
  },
  submissionData: {
    quarter: [],
    total: [],
  },
  targetData: {
    quarter: [],
    total: [],
  },
  counts: {
    amr_engineering: 0,
    gear_engineering: 0,
    my_engineering: 0,
    prc_engineering: 0,
    tfm: 0,
    oms: 0,
    fc: 0,
    total: 0,
    unique_total: 0,
  },

  setFilters: (filters) => {
    set({ filters });
  },

  getIDFPerformance: (quarter) => {
    const data = useSubmissionStore.getState().submissions;
    const filteredData = data.filter(
      (submission) =>
        submission.Year === 2025 &&
        submission.Category === "IDF" &&
        submission.Status !== "Cancelled" &&
        (quarter.length === 0 ||
          quarter.length === 4 ||
          quarter.includes(submission.Quarter))
    );
    const submission_counts = {
      id: 1,
      indicator: "IDF Submissions",
      ...usePerformanceStore.getState().counts,
    };
    const filing_counts = {
      id: 2,
      indicator: "Filings",
      ...usePerformanceStore.getState().counts,
    };
    const approval_counts = {
      id: 3,
      indicator: "Approvals Ratio",
      ...usePerformanceStore.getState().counts,
    };

    filteredData.forEach((submission) => {
      const { Site, Domain } = submission;

      if (
        ["Arizona", "California", "Oregon"].some((site) =>
          Site.includes(site)
        ) &&
        Domain.includes("Engineering")
      ) {
        submission_counts.amr_engineering += 1;
        if (submission.Status === "Accepted") {
          filing_counts.amr_engineering += 1;
          approval_counts.amr_engineering = parseFloat(
            (
              (filing_counts.amr_engineering /
                submission_counts.amr_engineering) *
              100
            ).toFixed(2)
          );
        }
      }

      if (
        ["Costa Rica", "Israel", "Poland", "India"].some((site) =>
          Site.includes(site)
        ) &&
        Domain.includes("Engineering")
      ) {
        submission_counts.gear_engineering += 1;
        if (submission.Status === "Accepted") {
          filing_counts.gear_engineering += 1;
          approval_counts.gear_engineering = parseFloat(
            (filing_counts.gear_engineering /
              submission_counts.gear_engineering) *
              100
          ).toFixed(2);
        }
      }

      if (Site.includes("Malaysia") && Domain.includes("Engineering")) {
        submission_counts.my_engineering += 1;
        if (submission.Status === "Accepted") {
          filing_counts.my_engineering += 1;
          approval_counts.my_engineering = parseFloat(
            (
              (filing_counts.my_engineering /
                submission_counts.my_engineering) *
              100
            ).toFixed(2)
          );
        }
      }

      if (
        ["Beijing", "Shanghai"].some((site) => Site.includes(site)) &&
        Domain.includes("Engineering")
      ) {
        submission_counts.prc_engineering += 1;
        if (submission.Status === "Accepted") {
          filing_counts.prc_engineering += 1;
          approval_counts.prc_engineering = parseFloat(
            (
              (filing_counts.prc_engineering /
                submission_counts.prc_engineering) *
              100
            ).toFixed(2)
          );
        }
      }

      if (Domain.includes("TFM")) {
        submission_counts.tfm += 1;
        if (submission.Status === "Accepted") {
          filing_counts.tfm += 1;
          approval_counts.tfm = parseFloat(
            ((filing_counts.tfm / submission_counts.tfm) * 100).toFixed(2)
          );
        }
      }

      if (Domain.includes("OMS")) {
        submission_counts.oms += 1;
        if (submission.Status === "Accepted") {
          filing_counts.oms += 1;
          approval_counts.oms = parseFloat(
            ((filing_counts.oms / submission_counts.oms) * 100).toFixed(2)
          );
        }
      }

      if (Domain.includes("FC")) {
        submission_counts.fc += 1;
        if (submission.Status === "Accepted") {
          filing_counts.fc += 1;
          approval_counts.fc = parseFloat(
            ((filing_counts.fc / submission_counts.fc) * 100).toFixed(2)
          );
        }
      }

      submission_counts.unique_total += 1;
      if (submission.Status === "Accepted") {
        filing_counts.unique_total += 1;
        approval_counts.unique_total = parseFloat(
          (
            (filing_counts.unique_total / submission_counts.unique_total) *
            100
          ).toFixed(2)
        );
      }

      submission_counts.total =
        submission_counts.amr_engineering +
        submission_counts.gear_engineering +
        submission_counts.my_engineering +
        submission_counts.prc_engineering +
        submission_counts.tfm +
        submission_counts.oms +
        submission_counts.fc;
      filing_counts.total =
        filing_counts.amr_engineering +
        filing_counts.gear_engineering +
        filing_counts.my_engineering +
        filing_counts.prc_engineering +
        filing_counts.tfm +
        filing_counts.oms +
        filing_counts.fc;
      approval_counts.total =
        (filing_counts.total / submission_counts.total) * 100;
    });

    return [submission_counts, filing_counts, approval_counts];
  },

  getConferencePerformance: (quarter) => {
    const data = useSubmissionStore.getState().submissions;
    const filteredData = data.filter(
      (submission) =>
        submission.Year === 2025 &&
        submission.Category === "Conferences" &&
        submission.Status !== "Cancelled" &&
        (quarter.length === 0 ||
          quarter.length === 4 ||
          quarter.includes(submission.Quarter))
    );
    const submission_counts = {
      id: 4,
      indicator: "Conferences Submissions",
      ...usePerformanceStore.getState().counts,
    };
    const filing_counts = {
      id: 5,
      indicator: "Conferences Accepted",
      ...usePerformanceStore.getState().counts,
    };
    const approval_counts = {
      id: 6,
      indicator: "Conferences Acceptance Ratio",
      ...usePerformanceStore.getState().counts,
    };

    filteredData.forEach((submission) => {
      const { Site, Domain } = submission;

      if (
        ["Arizona", "California", "Oregon"].some((site) =>
          Site.includes(site)
        ) &&
        Domain.includes("Engineering")
      ) {
        submission_counts.amr_engineering += 1;
        if (submission.Status === "Accepted") {
          filing_counts.amr_engineering += 1;
          approval_counts.amr_engineering = parseFloat(
            (
              (filing_counts.amr_engineering /
                submission_counts.amr_engineering) *
              100
            ).toFixed(2)
          );
        }
      }

      if (
        ["Costa Rica", "Israel", "Poland", "India"].some((site) =>
          Site.includes(site)
        ) &&
        Domain.includes("Engineering")
      ) {
        submission_counts.gear_engineering += 1;
        if (submission.Status === "Accepted") {
          filing_counts.gear_engineering += 1;
          approval_counts.gear_engineering = parseFloat(
            (
              (filing_counts.gear_engineering /
                submission_counts.gear_engineering) *
              100
            ).toFixed(2)
          );
        }
      }

      if (Site.includes("Malaysia") && Domain.includes("Engineering")) {
        submission_counts.my_engineering += 1;
        if (submission.Status === "Accepted") {
          filing_counts.my_engineering += 1;
          approval_counts.my_engineering = parseFloat(
            (
              (filing_counts.my_engineering /
                submission_counts.my_engineering) *
              100
            ).toFixed(2)
          );
        }
      }

      if (
        ["Beijing", "Shanghai"].some((site) => Site.includes(site)) &&
        Domain.includes("Engineering")
      ) {
        submission_counts.prc_engineering += 1;
        if (submission.Status === "Accepted") {
          filing_counts.prc_engineering += 1;
          approval_counts.prc_engineering = parseFloat(
            (
              (filing_counts.prc_engineering /
                submission_counts.prc_engineering) *
              100
            ).toFixed(2)
          );
        }
      }

      if (Domain.includes("TFM")) {
        submission_counts.tfm += 1;
        if (submission.Status === "Accepted") {
          filing_counts.tfm += 1;
          approval_counts.tfm = parseFloat(
            ((filing_counts.tfm / submission_counts.tfm) * 100).toFixed(2)
          );
        }
      }

      if (Domain.includes("OMS")) {
        submission_counts.oms += 1;
        if (submission.Status === "Accepted") {
          filing_counts.oms += 1;
          approval_counts.oms = parseFloat(
            ((filing_counts.oms / submission_counts.oms) * 100).toFixed(2)
          );
        }
      }

      if (Domain.includes("FC")) {
        submission_counts.fc += 1;
        if (submission.Status === "Accepted") {
          filing_counts.fc += 1;
          approval_counts.fc = parseFloat(
            ((filing_counts.fc / submission_counts.fc) * 100).toFixed(2)
          );
        }
      }

      submission_counts.unique_total += 1;
      if (submission.Status === "Accepted") {
        filing_counts.unique_total += 1;
        approval_counts.unique_total = parseFloat(
          (
            (filing_counts.unique_total / submission_counts.unique_total) *
            100
          ).toFixed(2)
        );
      }

      submission_counts.total =
        submission_counts.amr_engineering +
        submission_counts.gear_engineering +
        submission_counts.my_engineering +
        submission_counts.prc_engineering +
        submission_counts.tfm +
        submission_counts.oms +
        submission_counts.fc;
      filing_counts.total =
        filing_counts.amr_engineering +
        filing_counts.gear_engineering +
        filing_counts.my_engineering +
        filing_counts.prc_engineering +
        filing_counts.tfm +
        filing_counts.oms +
        filing_counts.fc;
      approval_counts.total = parseFloat(
        ((filing_counts.total / submission_counts.total) * 100).toFixed(2)
      );
    });

    return [submission_counts, filing_counts, approval_counts];
  },

  getOtherPerformance: (quarter) => {
    const data = useSubmissionStore.getState().submissions;
    const filteredData = data.filter(
      (submission) =>
        submission.Year === 2025 &&
        submission.Status !== "Cancelled" &&
        (quarter.length === 0 ||
          quarter.length === 4 ||
          quarter.includes(submission.Quarter))
    );
    const initiatives_counts = {
      id: 7,
      indicator: "Initiatives (POC+Pitches)",
      ...usePerformanceStore.getState().counts,
    };
    const opensource_counts = {
      id: 8,
      indicator: "Open Source",
      ...usePerformanceStore.getState().counts,
    };
    const microinnovation_counts = {
      id: 9,
      indicator: "Micro-Innovations",
      ...usePerformanceStore.getState().counts,
    };

    filteredData.forEach((submission) => {
      const { Site, Domain, Category } = submission;

      if (
        ["Arizona", "California", "Oregon"].some((site) =>
          Site.includes(site)
        ) &&
        Domain.includes("Engineering")
      ) {
        if (Category === "Initiatives") {
          initiatives_counts.amr_engineering += 1;
        } else if (Category === "Open Source") {
          opensource_counts.amr_engineering += 1;
        } else if (Category === "Micro-Innovation") {
          microinnovation_counts.amr_engineering += 1;
        }
      }

      if (
        ["Costa Rica", "Israel", "Poland", "India"].some((site) =>
          Site.includes(site)
        ) &&
        Domain.includes("Engineering")
      ) {
        if (Category === "Initiatives") {
          initiatives_counts.gear_engineering += 1;
        } else if (Category === "Open Source") {
          opensource_counts.gear_engineering += 1;
        } else if (Category === "Micro-Innovation") {
          microinnovation_counts.gear_engineering += 1;
        }
      }

      if (Site.includes("Malaysia") && Domain.includes("Engineering")) {
        if (Category === "Initiatives") {
          initiatives_counts.my_engineering += 1;
        } else if (Category === "Open Source") {
          opensource_counts.my_engineering += 1;
        } else if (Category === "Micro-Innovation") {
          microinnovation_counts.my_engineering += 1;
        }
      }

      if (
        ["Beijing", "Shanghai"].some((site) => Site.includes(site)) &&
        Domain.includes("Engineering")
      ) {
        if (Category === "Initiatives") {
          initiatives_counts.prc_engineering += 1;
        } else if (Category === "Open Source") {
          opensource_counts.prc_engineering += 1;
        } else if (Category === "Micro-Innovation") {
          microinnovation_counts.prc_engineering += 1;
        }
      }

      if (Domain.includes("TFM")) {
        if (Category === "Initiatives") {
          initiatives_counts.tfm += 1;
        } else if (Category === "Open Source") {
          opensource_counts.tfm += 1;
        } else if (Category === "Micro-Innovation") {
          microinnovation_counts.tfm += 1;
        }
      }

      if (Domain.includes("OMS")) {
        if (Category === "Initiatives") {
          initiatives_counts.oms += 1;
        } else if (Category === "Open Source") {
          opensource_counts.oms += 1;
        } else if (Category === "Micro-Innovation") {
          microinnovation_counts.oms += 1;
        }
      }

      if (Domain.includes("FC")) {
        if (Category === "Initiatives") {
          initiatives_counts.fc += 1;
        } else if (Category === "Open Source") {
          opensource_counts.fc += 1;
        } else if (Category === "Micro-Innovation") {
          microinnovation_counts.fc += 1;
        }
      }

      if (Category === "Initiatives") {
        initiatives_counts.unique_total += 1;
      } else if (Category === "Open Source") {
        opensource_counts.unique_total += 1;
      } else if (Category === "Micro-Innovation") {
        microinnovation_counts.unique_total += 1;
      }

      initiatives_counts.total =
        initiatives_counts.amr_engineering +
        initiatives_counts.gear_engineering +
        initiatives_counts.my_engineering +
        initiatives_counts.prc_engineering +
        initiatives_counts.tfm +
        initiatives_counts.oms +
        initiatives_counts.fc;
      opensource_counts.total =
        opensource_counts.amr_engineering +
        opensource_counts.gear_engineering +
        opensource_counts.my_engineering +
        opensource_counts.prc_engineering +
        opensource_counts.tfm +
        opensource_counts.oms +
        opensource_counts.fc;
      microinnovation_counts.total =
        microinnovation_counts.amr_engineering +
        microinnovation_counts.gear_engineering +
        microinnovation_counts.my_engineering +
        microinnovation_counts.prc_engineering +
        microinnovation_counts.tfm +
        microinnovation_counts.oms +
        microinnovation_counts.fc;
    });

    return [initiatives_counts, opensource_counts, microinnovation_counts];
  },

  getMembers: (quarter) => {
    const member = useMemberStore.getState().members;
    const filteredMember = member.filter((member) => member.Active === true);
    const submission = useSubmissionStore.getState().submissions;
    const filteredSubmission = submission.filter(
      (submission) =>
        submission.Status !== "Cancelled" &&
        (quarter.length === 0 ||
          quarter.length === 4 ||
          quarter.includes(submission.Quarter))
    );
    const bluebadge_counts = {
      id: 10,
      indicator: "# of Blue Badges",
      amr_engineering: filteredMember.filter(
        (member) =>
          (member.Site === "Arizona" ||
            member.Site === "California" ||
            member.Site === "Oregon") &&
          member.Domain === "Engineering"
      ).length,
      gear_engineering: filteredMember.filter(
        (member) =>
          (member.Site === "Costa Rica" ||
            member.Site === "Israel" ||
            member.Site === "Poland" ||
            member.Site === "India") &&
          member.Domain === "Engineering"
      ).length,
      my_engineering: filteredMember.filter(
        (member) =>
          member.Site === "Malaysia" && member.Domain === "Engineering"
      ).length,
      prc_engineering: filteredMember.filter(
        (member) =>
          (member.Site === "Beijing" || member.Site === "Shanghai") &&
          member.Domain === "Engineering"
      ).length,
      tfm: filteredMember.filter((member) => member.Domain === "TFM").length,
      oms: filteredMember.filter((member) => member.Domain === "OMS").length,
      fc: filteredMember.filter((member) => member.Domain === "FC").length,
      total: filteredMember.length,
      unique_total: filteredMember.length,
    };
    const participant_counts = {
      id: 11,
      indicator: "# of Participants",
      ...usePerformanceStore.getState().counts,
    };
    const participant_ratio = {
      id: 12,
      indicator: "Participation Ratio",
      ...usePerformanceStore.getState().counts,
    };

    filteredSubmission.forEach((submission) => {
      const { Site, Domain, Category } = submission;

      if (
        ["Arizona", "California", "Oregon"].some((site) =>
          Site.includes(site)
        ) &&
        Domain.includes("Engineering")
      ) {
        const submittersSet = new Set();
        filteredSubmission.forEach((submit) => {
          if (
            filteredMember.some(
              (entry) =>
                entry.Name === submit.PrimaryAuthor &&
                entry.Active &&
                (entry.Site === "Arizona" ||
                  entry.Site === "California" ||
                  entry.Site === "Oregon") &&
                entry.Domain === "Engineering"
            )
          ) {
            submittersSet.add(submit.PrimaryAuthor);
          }
          Array.isArray(submit.SecondaryAuthors) &&
            submit.SecondaryAuthors.forEach((author) => {
              if (
                filteredMember.some(
                  (entry) =>
                    entry.Name === author &&
                    entry.Active &&
                    (entry.Site === "Arizona" ||
                      entry.Site === "California" ||
                      entry.Site === "Oregon") &&
                    entry.Domain === "Engineering"
                )
              ) {
                submittersSet.add(author);
              }
            });
        });
        participant_counts.amr_engineering = submittersSet.size;
        participant_ratio.amr_engineering = parseFloat(
          (
            (submittersSet.size / bluebadge_counts.amr_engineering) *
            100
          ).toFixed(2)
        );
      }

      if (
        ["Costa Rica", "Israel", "Poland", "India"].some((site) =>
          Site.includes(site)
        ) &&
        Domain.includes("Engineering")
      ) {
        const submittersSet = new Set();
        filteredSubmission.forEach((submit) => {
          if (
            filteredMember.some(
              (entry) =>
                entry.Name === submit.PrimaryAuthor &&
                entry.Active &&
                entry.Domain === "Engineering" &&
                (entry.Site === "Costa Rica" ||
                  entry.Site === "Israel" ||
                  entry.Site === "Poland" ||
                  entry.Site === "India")
            )
          ) {
            submittersSet.add(submit.PrimaryAuthor);
          }
          Array.isArray(submit.SecondaryAuthors) &&
            submit.SecondaryAuthors.forEach((author) => {
              if (
                filteredMember.some(
                  (entry) =>
                    entry.Name === author &&
                    entry.Active &&
                    entry.Domain === "Engineering" &&
                    (entry.Site === "Costa Rica" ||
                      entry.Site === "Israel" ||
                      entry.Site === "Poland" ||
                      entry.Site === "India")
                )
              ) {
                submittersSet.add(author);
              }
            });
        });
        participant_counts.gear_engineering = submittersSet.size;
        participant_ratio.gear_engineering = parseFloat(
          (
            (submittersSet.size / bluebadge_counts.gear_engineering) *
            100
          ).toFixed(2)
        );
      }

      if (Site.includes("Malaysia") && Domain.includes("Engineering")) {
        const submittersSet = new Set();
        filteredSubmission.forEach((submit) => {
          if (
            filteredMember.some(
              (entry) =>
                entry.Name === submit.PrimaryAuthor &&
                entry.Active &&
                entry.Domain === "Engineering" &&
                entry.Site === "Malaysia"
            )
          ) {
            submittersSet.add(submit.PrimaryAuthor);
          }
          Array.isArray(submit.SecondaryAuthors) &&
            submit.SecondaryAuthors.forEach((author) => {
              if (
                filteredMember.some(
                  (entry) =>
                    entry.Name === author &&
                    entry.Active &&
                    entry.Domain === "Engineering" &&
                    entry.Site === "Malaysia"
                )
              ) {
                submittersSet.add(author);
              }
            });
        });
        participant_counts.my_engineering = submittersSet.size;
        participant_ratio.my_engineering = parseFloat(
          (
            (submittersSet.size / bluebadge_counts.my_engineering) *
            100
          ).toFixed(2)
        );
      }

      if (
        ["Beijing", "Shanghai"].some((site) => Site.includes(site)) &&
        Domain.includes("Engineering")
      ) {
        const submittersSet = new Set();
        filteredSubmission.forEach((submit) => {
          if (
            filteredMember.some(
              (entry) =>
                entry.Name === submit.PrimaryAuthor &&
                entry.Active &&
                entry.Domain === "Engineering" &&
                (entry.Site === "Beijing" || entry.Site === "Shanghai")
            )
          ) {
            submittersSet.add(submit.PrimaryAuthor);
          }
          Array.isArray(submit.SecondaryAuthors) &&
            submit.SecondaryAuthors.forEach((author) => {
              if (
                filteredMember.some(
                  (entry) =>
                    entry.Name === author &&
                    entry.Active &&
                    entry.Domain === "Engineering" &&
                    (entry.Site === "Beijing" || entry.Site === "Shanghai")
                )
              ) {
                submittersSet.add(author);
              }
            });
        });
        participant_counts.prc_engineering = submittersSet.size;
        participant_ratio.prc_engineering = parseFloat(
          (
            (submittersSet.size / bluebadge_counts.prc_engineering) *
            100
          ).toFixed(2)
        );
      }

      if (Domain.includes("TFM")) {
        const submittersSet = new Set();
        filteredSubmission.forEach((submit) => {
          if (
            filteredMember.some(
              (entry) =>
                entry.Name === submit.PrimaryAuthor &&
                entry.Active &&
                entry.Domain === "TFM"
            )
          ) {
            submittersSet.add(submit.PrimaryAuthor);
          }
          Array.isArray(submit.SecondaryAuthors) &&
            submit.SecondaryAuthors.forEach((author) => {
              if (
                filteredMember.some(
                  (entry) =>
                    entry.Name === author &&
                    entry.Active &&
                    entry.Domain === "TFM"
                )
              ) {
                submittersSet.add(author);
              }
            });
        });
        participant_counts.tfm = submittersSet.size;
        participant_ratio.tfm = parseFloat(
          ((submittersSet.size / bluebadge_counts.tfm) * 100).toFixed(2)
        );
      }

      if (Domain.includes("OMS")) {
        const submittersSet = new Set();
        filteredSubmission.forEach((submit) => {
          if (
            filteredMember.some(
              (entry) =>
                entry.Name === submit.PrimaryAuthor &&
                entry.Active &&
                entry.Domain === "OMS"
            )
          ) {
            submittersSet.add(submit.PrimaryAuthor);
          }
          Array.isArray(submit.SecondaryAuthors) &&
            submit.SecondaryAuthors.forEach((author) => {
              if (
                filteredMember.some(
                  (entry) =>
                    entry.Name === author &&
                    entry.Active &&
                    entry.Domain === "OMS"
                )
              ) {
                submittersSet.add(author);
              }
            });
        });
        participant_counts.oms = submittersSet.size;
        participant_ratio.oms = parseFloat(
          ((submittersSet.size / bluebadge_counts.oms) * 100).toFixed(2)
        );
      }

      if (Domain.includes("FC")) {
        const submittersSet = new Set();
        filteredSubmission.forEach((submit) => {
          if (
            filteredMember.some(
              (entry) =>
                entry.Name === submit.PrimaryAuthor &&
                entry.Active &&
                entry.Domain === "FC"
            )
          ) {
            submittersSet.add(submit.PrimaryAuthor);
          }
          Array.isArray(submit.SecondaryAuthors) &&
            submit.SecondaryAuthors.forEach((author) => {
              if (
                filteredMember.some(
                  (entry) =>
                    entry.Name === author &&
                    entry.Active &&
                    entry.Domain === "FC"
                )
              ) {
                submittersSet.add(author);
              }
            });
        });
        participant_counts.fc = submittersSet.size;
        participant_ratio.fc = parseFloat(
          ((submittersSet.size / bluebadge_counts.fc) * 100).toFixed(2)
        );
      }

      const submittersSet = new Set();
      filteredSubmission.forEach((submit) => {
        if (
          filteredMember.some(
            (entry) => entry.Name === submit.PrimaryAuthor && entry.Active
          )
        ) {
          submittersSet.add(submit.PrimaryAuthor);
        }
        Array.isArray(submit.SecondaryAuthors) &&
          submit.SecondaryAuthors.forEach((author) => {
            if (
              filteredMember.some(
                (entry) => entry.Name === author && entry.Active
              )
            ) {
              submittersSet.add(author);
            }
          });
      });
      participant_counts.total = submittersSet.size;
      participant_counts.unique_total = submittersSet.size;
      participant_ratio.total = parseFloat(
        ((submittersSet.size / bluebadge_counts.total) * 100).toFixed(2)
      );
      participant_ratio.unique_total = parseFloat(
        ((submittersSet.size / bluebadge_counts.unique_total) * 100).toFixed(2)
      );
    });

    return [bluebadge_counts, participant_counts, participant_ratio];
  },

  calculateCombinedData: (quarter) => {
    const idfPerformance = usePerformanceStore
      .getState()
      .getIDFPerformance(quarter);
    const confPerformance = usePerformanceStore
      .getState()
      .getConferencePerformance(quarter);
    const otherPerformance = usePerformanceStore
      .getState()
      .getOtherPerformance(quarter);
    const memberPerformance = usePerformanceStore
      .getState()
      .getMembers(quarter);

    const totalAmrEngineering =
      idfPerformance[0].amr_engineering +
      confPerformance[0].amr_engineering +
      otherPerformance.reduce((sum, item) => sum + item.amr_engineering, 0);

    const totalGearEngineering =
      idfPerformance[0].gear_engineering +
      confPerformance[0].gear_engineering +
      otherPerformance.reduce((sum, item) => sum + item.gear_engineering, 0);

    const totalMyEngineering =
      idfPerformance[0].my_engineering +
      confPerformance[0].my_engineering +
      otherPerformance.reduce((sum, item) => sum + item.my_engineering, 0);

    const totalPrcEngineering =
      idfPerformance[0].prc_engineering +
      confPerformance[0].prc_engineering +
      otherPerformance.reduce((sum, item) => sum + item.prc_engineering, 0);

    const totalTfm =
      idfPerformance[0].tfm +
      confPerformance[0].tfm +
      otherPerformance.reduce((sum, item) => sum + item.tfm, 0);

    const totalOms =
      idfPerformance[0].oms +
      confPerformance[0].oms +
      otherPerformance.reduce((sum, item) => sum + item.oms, 0);

    const totalFc =
      idfPerformance[0].fc +
      confPerformance[0].fc +
      otherPerformance.reduce((sum, item) => sum + item.fc, 0);

    const totalTotal =
      idfPerformance[0].total +
      confPerformance[0].total +
      otherPerformance.reduce((sum, item) => sum + item.total, 0);

    const totalUniqueTotal =
      idfPerformance[0].unique_total +
      confPerformance[0].unique_total +
      otherPerformance.reduce((sum, item) => sum + item.unique_total, 0);

    const additionalData = [
      {
        id: 13,
        indicator: "Number of EAs",
        amr_engineering: 0,
        gear_engineering: 0,
        my_engineering: 0,
        prc_engineering: 0,
        tfm: 0,
        oms: 0,
        fc: 0,
        total: 0,
        unique_total: 0,
      },
      {
        id: 14,
        indicator: "Number of EAs w/ Innovation",
        amr_engineering: 0,
        gear_engineering: 0,
        my_engineering: 0,
        prc_engineering: 0,
        tfm: 0,
        oms: 0,
        fc: 0,
        total: 0,
        unique_total: 0,
      },
      {
        id: 15,
        indicator: "EA/Innovation Ratio",
        amr_engineering: 0,
        gear_engineering: 0,
        my_engineering: 0,
        prc_engineering: 0,
        tfm: 0,
        oms: 0,
        fc: 0,
        total: 0,
        unique_total: 0,
      },
      {
        id: 16,
        indicator: "Total Contribution",
        amr_engineering: totalAmrEngineering,
        gear_engineering: totalGearEngineering,
        my_engineering: totalMyEngineering,
        prc_engineering: totalPrcEngineering,
        tfm: totalTfm,
        oms: totalOms,
        fc: totalFc,
        total: totalTotal,
        unique_total: totalUniqueTotal,
      },
    ];

    const combinedData = [
      ...idfPerformance,
      ...confPerformance,
      ...otherPerformance,
      ...memberPerformance,
      ...additionalData,
    ];

    console.debug("All Performance Data: ", combinedData);
    return combinedData;
  },

  setData: (filters) => {
    const combinedData = usePerformanceStore
      .getState()
      .calculateCombinedData(filters);
    set({ data: combinedData });
  },

  getCombinedData: (quarter) => {
    return usePerformanceStore.getState().calculateCombinedData(quarter);
  },

  setCommitmentQuarterData: async (data) => {
    set((state) => ({
      commitmentData: {
        ...state.commitmentData,
        quarter: data,
      },
    }));
  },

  setCommitmentTotalData: async (data) => {
    set((state) => ({
      commitmentData: {
        ...state.commitmentData,
        total: data,
      },
    }));
  },

  setSubmissionQuarterData: async (data) => {
    set((state) => ({
      submissionData: {
        ...state.submissionData,
        quarter: data,
      },
    }));
  },

  setSubmissionTotalData: async (data) => {
    set((state) => ({
      submissionData: {
        ...state.submissionData,
        total: data,
      },
    }));
  },

  setTargetQuarterData: async (data) => {
    set((state) => ({
      targetData: {
        ...state.targetData,
        quarter: data,
      },
    }));
  },

  setTargetTotalData: async (data) => {
    set((state) => ({
      targetData: {
        ...state.targetData,
        total: data,
      },
    }));
  },
}));

export default usePerformanceStore;
