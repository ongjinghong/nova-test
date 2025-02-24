import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import useLoginStore from "./LoginStore";
import useAppStore from "./AppStore";

const useCommitmentStore = create((set) => ({
  lists: [
    {
      year: 2024,
      id: "%7Bd0330bf3-293b-475f-8662-ddecbbc678d8%7D",
      data: [],
    },
    {
      year: 2025,
      id: "%7B2286bf29-fba0-401e-9fae-1f74f22f60a2%7D",
      data: [],
    },
  ],
  commitments: [],

  // filters
  filters: {
    Year: [2025],
    Quarter: [],
    Site: [],
    Domain: [],
    Manager: "",
    Member: "",
  },
  filteredCommitments: [],
  quarterCommitments: [],

  // add/update
  commitmentFormOpen: false,
  commitmentFormType: "Add",
  commitmentFormPage: 0,
  commitmentInputTemplate: {
    Quarter: "",
    Email: "",
    Conferences_Primary: 0,
    Conferences_Secondary: 0,
    IDF_Primary: 0,
    IDF_Secondary: 0,
    Initiatives_Primary: 0,
    Initiatives_Secondary: 0,
    MicroInnovation_Primary: 0,
    MicroInnovation_Secondary: 0,
    OpenSource_Primary: 0,
    OpenSource_Secondary: 0,
    Domain: "",
    Site: "",
  },
  commitmentsInput: [],
  submitStatusOpen: false,
  submitStatusMessage: "",

  getCommitments: async (year) => {
    try {
      const response = await invoke("fetch_sharepoint_list_item", {
        token: useLoginStore.getState().accessToken,
        siteId: "16465dda-288d-4a9b-8851-afa9989a20e7",
        listId: useCommitmentStore.getState().lists.find((x) => x.year === year)
          .id,
        listType: "data",
        maxItem: 500,
      });
      console.debug(`${year} Commitment response:`, response.value);
      const parsedItems = response.value.map((item) => {
        if (item.fields) {
          const commonItem = {
            id: `${year}.${item.id}`,
            Year: year,
            ListID: item.id,
            Name: item.fields.Name,
            Domain: item.fields.Domain,
            Site: item.fields.Site,

            Conferences_Secondary: item.fields.Conferences_Secondary,
            IDF_Secondary: item.fields.IDF_Secondary,
            MicroInnovation_Secondary: item.fields.MicroInnovation_Secondary,
            OpenSource_Secondary: item.fields.OpenSource_Secondary,
            Created: item.fields.Created,
            Modified: item.fields.Modified,
          };

          if (year === 2024) {
            return {
              ...commonItem,
              Quarter: `Q${item.fields.Quarter}`,
              Email: item.fields.Title,
              Conferences_Primary: item.fields.Conferences,
              IDF_Primary: item.fields.IDF,
              Initiatives_Primary: item.fields.POC_x002f_Pitching,
              Initiatives_Secondary: item.fields.POC_x002f_Pitching0,
              MicroInnovation_Primary: item.fields.Micro_x002d_Innovation,
              OpenSource_Primary: item.fields.OpenSource,
            };
          } else {
            return {
              ...commonItem,
              Quarter: item.fields.Quarter,
              Email: item.fields.Email,
              Conferences_Primary: item.fields.Conferences_Primary,
              IDF_Primary: item.fields.IDF_Primary,
              Initiatives_Primary: item.fields.Initiatives_Primary,
              Initiatives_Secondary: item.fields.Initiatives_Secondary,
              MicroInnovation_Primary: item.fields.MicroInnovation_Primary,
              OpenSource_Primary: item.fields.OpenSource_Primary,
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
          commitments: allLists,
        };
      });
    } catch (error) {
      console.error("Error fetching commitments:", error);
    }
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
        Site: [],
        Domain: [],
        Manager: "",
        Member: "",
      },
    });
  },

  setFilteredCommitments: (data) => {
    set({ filteredCommitments: data });
  },

  getQuarterCommitments: (data) => {
    const { quarters } = useAppStore.getState().constants;
    const quarterData = quarters.map((quarter) => {
      const quarterDict = {
        Quarter: quarter,
        Sum_Primary: 0,
        Sum_Secondary: 0,
        Conferences_Primary: 0,
        IDF_Primary: 0,
        Initiatives_Primary: 0,
        MicroInnovation_Primary: 0,
        OpenSource_Primary: 0,
        Conferences_Secondary: 0,
        IDF_Secondary: 0,
        Initiatives_Secondary: 0,
        MicroInnovation_Secondary: 0,
        OpenSource_Secondary: 0,
      };

      data.forEach((item) => {
        if (item.Quarter === quarter) {
          quarterDict.Sum_Primary +=
            item.Conferences_Primary +
            item.IDF_Primary +
            item.Initiatives_Primary +
            item.MicroInnovation_Primary +
            item.OpenSource_Primary;
          quarterDict.Conferences_Primary += item.Conferences_Primary;
          quarterDict.IDF_Primary += item.IDF_Primary;
          quarterDict.Initiatives_Primary += item.Initiatives_Primary;
          quarterDict.MicroInnovation_Primary += item.MicroInnovation_Primary;
          quarterDict.OpenSource_Primary += item.OpenSource_Primary;

          quarterDict.Sum_Secondary +=
            item.Conferences_Secondary +
            item.IDF_Secondary +
            item.Initiatives_Secondary +
            item.MicroInnovation_Secondary +
            item.OpenSource_Secondary;
          quarterDict.Conferences_Secondary += item.Conferences_Secondary;
          quarterDict.IDF_Secondary += item.IDF_Secondary;
          quarterDict.Initiatives_Secondary += item.Initiatives_Secondary;
          quarterDict.MicroInnovation_Secondary +=
            item.MicroInnovation_Secondary;
          quarterDict.OpenSource_Secondary += item.OpenSource_Secondary;
        }
      });

      return quarterDict;
    });

    return quarterData;
  },

  setQuarterCommitments: (data) => {
    set({ quarterCommitments: data });
  },

  getTotalCommitments: (data) => {
    const totalDict = {
      Sum_Primary: 0,
      Sum_Secondary: 0,
      Conferences_Primary: 0,
      IDF_Primary: 0,
      Initiatives_Primary: 0,
      MicroInnovation_Primary: 0,
      OpenSource_Primary: 0,
      Conferences_Secondary: 0,
      IDF_Secondary: 0,
      Initiatives_Secondary: 0,
      MicroInnovation_Secondary: 0,
      OpenSource_Secondary: 0,
    };

    data.forEach((item) => {
      totalDict.Sum_Primary +=
        item.Conferences_Primary +
        item.IDF_Primary +
        item.Initiatives_Primary +
        item.MicroInnovation_Primary +
        item.OpenSource_Primary;
      totalDict.Conferences_Primary += item.Conferences_Primary;
      totalDict.IDF_Primary += item.IDF_Primary;
      totalDict.Initiatives_Primary += item.Initiatives_Primary;
      totalDict.MicroInnovation_Primary += item.MicroInnovation_Primary;
      totalDict.OpenSource_Primary += item.OpenSource_Primary;

      totalDict.Sum_Secondary +=
        item.Conferences_Secondary +
        item.IDF_Secondary +
        item.Initiatives_Secondary +
        item.MicroInnovation_Secondary +
        item.OpenSource_Secondary;
      totalDict.Conferences_Secondary += item.Conferences_Secondary;
      totalDict.IDF_Secondary += item.IDF_Secondary;
      totalDict.Initiatives_Secondary += item.Initiatives_Secondary;
      totalDict.MicroInnovation_Secondary += item.MicroInnovation_Secondary;
      totalDict.OpenSource_Secondary += item.OpenSource_Secondary;
    });

    return totalDict;
  },

  openCommitmentForm: () => set({ commitmentFormOpen: true }),
  closeCommitmentForm: () => set({ commitmentFormOpen: false }),

  setCommitmentFormType: (data) => {
    set({ commitmentFormType: data });
  },

  setCommitmentInputTemplate: (data) => {
    set({ commitmentInputTemplate: data });
  },

  addCommitmentInput: (data) => {
    set((state) => {
      const updatedInput = [...state.commitmentsInput, data];
      return { commitmentsInput: updatedInput };
    });
  },

  updateCommitmentInput: (index, key, value) => {
    set((state) => {
      const updatedInput = [...state.commitmentsInput];
      updatedInput[index][key] = parseInt(value);
      return { commitmentsInput: updatedInput };
    });
  },

  clearCommitmentInput: () => {
    set({ commitmentsInput: [] });
  },

  addCommitment: async () => {
    try {
      const input = useCommitmentStore.getState().commitmentsInput;
      const responses = await Promise.all(
        input.map(async (item) => {
          const response = await invoke("add_sharepoint_list_item", {
            token: useLoginStore.getState().accessToken,
            siteId: "16465dda-288d-4a9b-8851-afa9989a20e7",
            listId: useCommitmentStore
              .getState()
              .lists.find((x) => x.year === 2025).id,
            fields: item,
          });
          return response;
        })
      );
      if (
        responses.every((response) => response === "Item updated successfully")
      ) {
        useAppStore.getState().openStatus();
        useAppStore
          .getState()
          .setStatusMessage("Commitment added successfully!");
        useCommitmentStore.getState().getCommitments(2025);
      } else {
        useAppStore.getState().setStatusMessage("Some items failed to update.");
      }
    } catch (error) {
      console.error("Error submitting commitment input:", error);
    }
  },

  updateCommitment: async () => {
    try {
      const input = useCommitmentStore.getState().commitmentsInput;
      const responses = await Promise.all(
        input.map(async (item) => {
          const { id, ...fields } = item;
          const response = await invoke("update_sharepoint_list_item", {
            token: useLoginStore.getState().accessToken,
            siteId: "16465dda-288d-4a9b-8851-afa9989a20e7",
            listId: useCommitmentStore
              .getState()
              .lists.find((x) => x.year === 2025).id,
            itemId: item.id,
            fields: fields,
          });
          return response;
        })
      );
      if (
        responses.every((response) => response === "Item updated successfully")
      ) {
        useAppStore.getState().openStatus();
        useAppStore.getState().setStatusMessage("Commitment updated!");
        useCommitmentStore.getState().getCommitments(2025);
      } else {
        useAppStore.getState().setStatusMessage("Some items failed to update.");
      }
    } catch (error) {
      console.error("Error updating commitment input:", error);
    }
  },

  nextCommitmentFormPage: () => {
    set((state) => {
      const nextPage = state.commitmentFormPage + 1;
      return { commitmentFormPage: nextPage };
    });
  },

  previousCommitmentFormPage: () => {
    set((state) => {
      const previousPage = state.commitmentFormPage - 1;
      return { commitmentFormPage: previousPage };
    });
  },

  resetCommitmentFormPage: () => {
    set({ commitmentFormPage: 0 });
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
}));

export default useCommitmentStore;
