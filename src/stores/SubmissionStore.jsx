import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import useLoginStore from "./LoginStore";
import useAppStore from "./AppStore";

const useSubmissionStore = create((set) => ({
  lists: [
    {
      year: 2024,
      id: "%7B2b2358bd-d94d-4a86-9227-ddf21be12c00%7D",
      data: [],
    },
    {
      year: 2025,
      id: "%7Bff87f8d6-1657-4d3a-9443-9d0bd25912e8%7D",
      data: [],
    },
  ],
  submissions: [],
  filteredSubmissions: [],
  filters: {
    Year: [2025],
    Quarter: [],
    Status: [],
    Category: [],
    Site: [],
    Domain: [],
    EA: [],
    Manager: "",
    Member: "",
  },
  heatSubmissions: {
    title: "Total Submission",
    value: "0",
    interval: "Last 30 days",
    interval_date: [],
    trend: "neutral",
    trend_value: "0",
    data: [],
  },
  acceptedSubmissions: {
    Conferences: 0,
    IDF: 0,
    Initiatives: 0,
    "Micro-Innovation": 0,
    "Open Source": 0,
    "Knowledge Sharing": 0,
  },
  totalSubmissions: {
    Conferences: 0,
    IDF: 0,
    Initiatives: 0,
    "Micro-Innovation": 0,
    "Open Source": 0,
    "Knowledge Sharing": 0,
  },
  statusCategorySubmissions: {},

  // details
  submissionDetailsOpen: false,
  submissionDetailsID: 0,

  // add/update
  submissionFormOpen: false,
  submissionFormType: "Add",
  submissionUpdateID: 0,
  submissionFormPage: 0,
  submissionInputTemplate: {
    Title: "",
    ProblemStatement: "",
    SolutionandBenefits: "",
    Site: [],
    Domain: [],
    Quarter: "",
    Duration: 0,
    Category: "",
    Status: "",
    EA: false,
    SRNumber: "",
    SubmissionPlatform: "",
    SubmissionPlatformID: "",
    PrimaryAuthor: "",
    SecondaryAuthors: [],
  },
  submissionInputError: {
    Title: false,
    ProblemStatement: false,
    SolutionandBenefits: false,
    Site: false,
    Domain: false,
    Quarter: false,
    Duration: false,
    Category: false,
    Status: false,
    EA: false,
    SRNumber: false,
    SubmissionPlatform: false,
    SubmissionPlatformID: false,
    PrimaryAuthor: false,
  },
  submissionsInput: {},
  primaryAuthorNameSearch: "",
  secondaryAuthorNameSearch: "",
  primaryAuthorNameSearchResults: [],
  secondaryAuthorNameSearchResults: [],

  getSubmissions: async (year) => {
    try {
      const response = await invoke("fetch_sharepoint_list_item", {
        token: useLoginStore.getState().accessToken,
        siteId: "16465dda-288d-4a9b-8851-afa9989a20e7",
        listId: useSubmissionStore.getState().lists.find((x) => x.year === year)
          .id,
        listType: year === 2024 ? "24submission" : "25submission",
        maxItem: 750,
      });
      console.debug(`${year} Submissions raw response:`, response.value);
      const parsedItems = response.value.map((item) => {
        if (item.fields) {
          const commonItem = {
            id: `${year}.${item.id}`,
            Year: year,
            ListID: item.id,
            Title: item.fields.Title,
            ProblemStatement: item.fields.ProblemStatement,
            SolutionandBenefits: item.fields.SolutionandBenefits,
            Site: item.fields.Site,
            Domain: item.fields.Domain,
            Quarter: item.fields.Quarter,
            Category: item.fields.Category,
            Status: item.fields.Status,
            EA: item.fields.EA,
            SRNumber: item.fields.SRNumber,
            SubmissionPlatform: item.fields.SubmissionPlatform,
            PrimaryAuthor: item.fields.PrimaryAuthor,
            Created: item.fields.Created,
            Modified: item.fields.Modified,
          };

          if (year === 2024) {
            return {
              ...commonItem,
              Duration: null,
              SubmissionPlatformID: item.fields.SubmissionID,
              SecondaryAuthors: item.fields.SecondaryAuthor?.map(
                (author) => author.LookupValue
              ),
            };
          } else {
            return {
              ...commonItem,
              Duration: item.fields.Duration,
              SubmissionPlatformID: item.fields.SubmissionPlatformID,
              SecondaryAuthors: item.fields.SecondaryAuthors?.map(
                (author) => author.LookupValue
              ),
            };
          }
        }
      });
      set((state) => {
        const updatedLists = state.lists.map((list) => ({
          ...list,
          data: list.year === year ? parsedItems : list.data,
        }));

        const allLists = updatedLists.flatMap((list) => list.data);

        return {
          lists: updatedLists,
          submissions: allLists,
        };
      });
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  },

  getQuarterSubmissions: (data, sharing = true) => {
    const { quarters } = useAppStore.getState().constants;
    const quarterData = quarters.map((quarter) => {
      const quarterDict = {
        Quarter: quarter,
        Sum: 0,
        Conferences: 0,
        IDF: 0,
        Initiatives: 0,
        "Micro-Innovation": 0,
        "Open Source": 0,
        "Knowledge Sharing": 0,
      };

      data
        .filter((item) => item.ListID !== "1")
        .forEach((item) => {
          if (item.Quarter === quarter) {
            quarterDict.Sum +=
              item.Category === "Knowledge Sharing" ? (sharing ? 1 : 0) : 1;
            quarterDict.Conferences += item.Category === "Conferences" ? 1 : 0;
            quarterDict.IDF += item.Category === "IDF" ? 1 : 0;
            quarterDict.Initiatives += item.Category === "Initiatives" ? 1 : 0;
            quarterDict["Micro-Innovation"] +=
              item.Category === "Micro-Innovation" ? 1 : 0;
            quarterDict["Open Source"] +=
              item.Category === "Open Source" ? 1 : 0;
            quarterDict["Knowledge Sharing"] +=
              item.Category === "Knowledge Sharing" ? 1 : 0;
          }
        });

      return quarterDict;
    });

    return quarterData;
  },

  getTotalSubmissions: (data, sharing = true) => {
    const totalDict = {
      Sum: 0,
      Conferences: 0,
      IDF: 0,
      Initiatives: 0,
      "Micro-Innovation": 0,
      "Open Source": 0,
      "Knowledge Sharing": 0,
    };

    data
      .filter((item) => item.ListID !== "1")
      .forEach((item) => {
        totalDict.Sum +=
          item.Category === "Knowledge Sharing" ? (sharing ? 1 : 0) : 1;
        totalDict.Conferences += item.Category === "Conferences" ? 1 : 0;
        totalDict.IDF += item.Category === "IDF" ? 1 : 0;
        totalDict.Initiatives += item.Category === "Initiatives" ? 1 : 0;
        totalDict["Micro-Innovation"] +=
          item.Category === "Micro-Innovation" ? 1 : 0;
        totalDict["Open Source"] += item.Category === "Open Source" ? 1 : 0;
        totalDict["Knowledge Sharing"] +=
          item.Category === "Knowledge Sharing" ? 1 : 0;
      });

    return totalDict;
  },

  setFilters: (key, value) => {
    set((state) => {
      const updatedFilters = { ...state.filters };
      updatedFilters[key] = value;
      return { filters: updatedFilters };
    });
  },

  resetFilters: () => {
    set({
      filters: {
        Year: [2025],
        Quarter: [],
        Status: [],
        Category: [],
        Site: [],
        Domain: [],
        EA: [],
        Manager: "",
        Member: "",
      },
    });
  },

  setFilteredSubmissions: (data) => {
    set({ filteredSubmissions: data });
  },

  setHeatSubmissions: (data) => {
    set((state) => ({
      heatSubmissions: {
        ...state.heatSubmissions,
        value: data.value,
        interval_date: data.interval_date,
        trend: data.trend,
        trend_value: data.trend_value,
        data: data.data,
      },
    }));
  },

  openSubmissionDetailsWindow: () => set({ submissionDetailsOpen: true }),
  closeSubmissionDetailsWindow: () => set({ submissionDetailsOpen: false }),
  setSubmissionDetailsWindowID: (id) => {
    set({ submissionDetailsID: id });
  },

  openSubmissionForm: () => set({ submissionFormOpen: true }),
  closeSubmissionForm: () => set({ submissionFormOpen: false }),

  setSubmissionUpdateID: (id) => {
    set({ submissionUpdateID: id });
  },

  setSubmissionFormType: (data) => {
    set({ submissionFormType: data });
  },

  setSubmissionInputTemplate: (data) => {
    set({ submissionInputTemplate: data });
  },

  addSubmissionInput: (newSubmission) =>
    set((state) => ({
      submissionsInput: { ...state.submissionsInput, ...newSubmission },
    })),

  setSubmissionInput: (newSubmission) =>
    set({ submissionsInput: newSubmission }),

  updateSubmissionInput: (key, value) =>
    set((state) => ({
      submissionsInput: {
        ...state.submissionsInput,
        [key]: value,
      },
    })),

  clearSubmissionInput: () => set({ submissionsInput: {} }),

  setSubmissionInputError: (key, value) =>
    set((state) => ({
      submissionInputError: {
        ...state.submissionInputError,
        [key]: value,
      },
    })),
  clearSubmissionInputError: () =>
    set({
      submissionInputError: {
        Title: false,
        ProblemStatement: false,
        SolutionandBenefits: false,
        Site: false,
        Domain: false,
        Quarter: false,
        Duration: false,
        Category: false,
        Status: false,
        EA: false,
        SRNumber: false,
        SubmissionPlatform: false,
        PrimaryAuthor: false,
      },
    }),

  addSubmission: async (input) => {
    try {
      const response = await invoke("add_sharepoint_list_item", {
        token: useLoginStore.getState().accessToken,
        siteId: "16465dda-288d-4a9b-8851-afa9989a20e7",
        listId: useSubmissionStore.getState().lists.find((x) => x.year === 2025)
          .id,
        fields: input,
      });
      if (response === "Item updated successfully") {
        useAppStore.getState().openStatus();
        useAppStore
          .getState()
          .setStatusMessage("Submission added successfully!");
        useSubmissionStore.getState().getSubmissions(2025);
      } else {
        useAppStore.getState().setStatusMessage("Submission failed to add.");
      }
    } catch (error) {
      console.error("Error submitting submission input:", error);
    }
  },

  updateSubmission: async (input) => {
    try {
      const response = await invoke("update_sharepoint_list_item", {
        token: useLoginStore.getState().accessToken,
        siteId: "16465dda-288d-4a9b-8851-afa9989a20e7",
        listId: useSubmissionStore.getState().lists.find((x) => x.year === 2025)
          .id,
        itemId: useSubmissionStore.getState().submissionUpdateID,
        fields: input,
      });
      if (response === "Item updated successfully") {
        useAppStore.getState().openStatus();
        useAppStore
          .getState()
          .setStatusMessage("Submission updated successfully!");
        useSubmissionStore.getState().getSubmissions(2025);
      } else {
        useAppStore.getState().setStatusMessage("Submission failed to update.");
      }
    } catch (error) {
      console.error("Error updating submission input:", error);
    }
  },

  nextSubmissionFormPage: () => {
    set((state) => {
      const nextPage = state.submissionFormPage + 1;
      return { submissionFormPage: nextPage };
    });
  },

  previousSubmissionFormPage: () => {
    set((state) => {
      const previousPage = state.submissionFormPage - 1;
      return { submissionFormPage: previousPage };
    });
  },

  resetSubmissionFormPage: () => {
    set({ submissionFormPage: 0 });
  },

  openSubmitStatus: () => set({ submitStatusOpen: true }),
  closeSubmitStatus: () => set({ submitStatusOpen: false }),

  setSubmitStatus: (status) => {
    set({
      submitStatusMessage: status,
    });
  },

  clearSubmitStatus: () => {
    set({
      submitStatusMessage: "",
    });
  },

  setPrimaryAuthorNameSearch: (input) => {
    set({ primaryAuthorNameSearch: input });
  },

  clearPrimaryAuthorNameSearch: () => {
    set({ primaryAuthorNameSearch: "" });
  },

  setSecondaryAuthorNameSearch: (input) => {
    set({ secondaryAuthorNameSearch: input });
  },

  clearSecondaryAuthorNameSearch: () => {
    set({ secondaryAuthorNameSearch: "" });
  },

  setPrimaryAuthorNameSearchResults: (data) => {
    set({ primaryAuthorNameSearchResults: data });
  },

  clearPrimaryAuthorNameSearchResults: () => {
    set({ primaryAuthorNameSearchResults: [] });
  },

  setSecondaryAuthorNameSearchResults: (data) => {
    set({ secondaryAuthorNameSearchResults: data });
  },

  clearSecondaryAuthorNameSearchResults: () => {
    set({ secondaryAuthorNameSearchResults: [] });
  },

  getAcceptedSubmissions: () => {
    const data = useSubmissionStore.getState().filteredSubmissions;
    const acceptedSubmissions = {
      Conferences: 0,
      IDF: 0,
      Initiatives: 0,
      "Micro-Innovation": 0,
      "Open Source": 0,
      "Knowledge Sharing": 0,
    };
    const totalSubmissions = {
      Conferences: 0,
      IDF: 0,
      Initiatives: 0,
      "Micro-Innovation": 0,
      "Open Source": 0,
      "Knowledge Sharing": 0,
    };

    data
      .filter((item) => item.Status !== "Cancelled")
      .forEach((submission) => {
        if (submission.Status === "Accepted") {
          acceptedSubmissions[submission.Category] += 1;
        }
        totalSubmissions[submission.Category] += 1;
      });

    // const result = {};
    // for (const category in acceptedSubmissions) {
    //   result[category] =
    //     totalSubmissions[category] > 0
    //       ? (acceptedSubmissions[category] / totalSubmissions[category]) * 100
    //       : 0;
    // }

    set({
      acceptedSubmissions: acceptedSubmissions,
      totalSubmissions: totalSubmissions,
    });
  },

  setStatusCategorySubmissions: (newResult) =>
    set({ statusCategorySubmissions: newResult }),
}));

export default useSubmissionStore;
