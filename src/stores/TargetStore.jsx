import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import useLoginStore from "./LoginStore";
import useAppStore from "./AppStore";

const useTargetStore = create((set) => ({
  lists: [
    {
      year: 2024,
      id: "%7Be22a23f1-9b93-4930-a273-8821d6676643%7D",
      data: [],
    },
    {
      year: 2025,
      id: "%7B2d019bfd-2980-4a8f-b236-488c5eb1a9e5%7D",
      data: [],
    },
  ],
  targets: [],

  // filters
  filters: {
    Year: [2025],
    Quarter: [],
    Site: [],
    Domain: [],
  },
  filteredTargets: [],
  quarterTargets: [],

  // add/update
  targetFormOpen: false,
  targetFormType: "Add",
  targetFormPage: 0,
  targetInputTemplate: {
    Domain: "",
    Site: "",
    Quarter: "",
    Conference: 0,
    IDF: 0,
    POC_x002f_Pitching: 0,
    Micro_x002d_Innovation: 0,
    OpenSource: 0,
  },
  targetsInput: [],

  getTargets: async (year) => {
    try {
      const response = await invoke("fetch_sharepoint_list_item", {
        token: useLoginStore.getState().accessToken,
        siteId: "16465dda-288d-4a9b-8851-afa9989a20e7",
        listId: useTargetStore.getState().lists.find((x) => x.year === year).id,
        listType: "data",
        maxItem: 100,
      });
      console.debug("Targets response:", response.value);
      const parsedItems = response.value.map((item) => {
        if (item.fields) {
          const commonItem = {
            id: `${year}.${item.id}`,
            Year: year,
            ListID: item.id,
            Domain: item.fields.Domain,
            Site: item.fields.Site,
            Conference: item.fields.Conference,
            IDF: item.fields.IDF,
            POC_x002f_Pitching: item.fields.POC_x002f_Pitching,
            Micro_x002d_Innovation: item.fields.Micro_x002d_Innovation,
            OpenSource: item.fields.OpenSource,
            Created: item.fields.Created,
            Modified: item.fields.Modified,
          };
          if (year === 2024) {
            return {
              ...commonItem,
              Quarter: `Q${item.fields.Quarter}`,
            };
          } else {
            return {
              ...commonItem,
              Quarter: item.fields.Quarter,
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
          targets: allLists,
        };
      });
    } catch (error) {
      console.error("Error fetching targets:", error);
    }
  },

  getQuarterTargets: (data) => {
    const { quarters } = useAppStore.getState().constants;
    const quarterData = quarters.map((quarter) => {
      const quarterDict = {
        Quarter: quarter,
        Sum: 0,
        Conference: 0,
        IDF: 0,
        POC_x002f_Pitching: 0,
        Micro_x002d_Innovation: 0,
        OpenSource: 0,
      };

      data.forEach((item) => {
        if (item.Quarter === quarter) {
          quarterDict.Sum +=
            item.Conference +
            item.IDF +
            item.POC_x002f_Pitching +
            item.Micro_x002d_Innovation +
            item.OpenSource;
          quarterDict.Conference += item.Conference;
          quarterDict.IDF += item.IDF;
          quarterDict.POC_x002f_Pitching += item.POC_x002f_Pitching;
          quarterDict.Micro_x002d_Innovation += item.Micro_x002d_Innovation;
          quarterDict.OpenSource += item.OpenSource;
        }
      });

      return quarterDict;
    });

    return quarterData;
  },

  getTotalTargets: (data) => {
    const totalDict = {
      Sum: 0,
      Conference: 0,
      IDF: 0,
      POC_x002f_Pitching: 0,
      Micro_x002d_Innovation: 0,
      OpenSource: 0,
    };

    data.forEach((item) => {
      totalDict.Sum +=
        item.Conference +
        item.IDF +
        item.POC_x002f_Pitching +
        item.Micro_x002d_Innovation +
        item.OpenSource;
      totalDict.Conference += item.Conference;
      totalDict.IDF += item.IDF;
      totalDict.POC_x002f_Pitching += item.POC_x002f_Pitching;
      totalDict.Micro_x002d_Innovation += item.Micro_x002d_Innovation;
      totalDict.OpenSource += item.OpenSource;
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
        Site: [],
        Domain: [],
      },
    });
  },

  setFilteredTargets: (data) => {
    set({ filteredTargets: data });
  },

  setQuarterTargets: (data) => {
    set({ quarterTargets: data });
  },

  openTargetForm: () => set({ targetFormOpen: true }),
  closeTargetForm: () => set({ targetFormOpen: false }),

  setTargetFormType: (data) => {
    set({ targetFormType: data });
  },

  setTargetInputTemplate: (data) => {
    set({ targetInputTemplate: data });
  },

  addTargetInput: (data) => {
    set((state) => {
      const updatedInput = [...state.targetsInput, data];
      return { targetsInput: updatedInput };
    });
  },

  updateTargetInput: (index, key, value) => {
    set((state) => {
      const updatedInput = [...state.targetsInput];
      updatedInput[index][key] = parseInt(value);
      return { targetsInput: updatedInput };
    });
  },

  clearTargetInput: () => {
    set({ targetsInput: [] });
  },

  addTarget: async () => {
    try {
      const input = useTargetStore.getState().targetsInput;
      const responses = await Promise.all(
        input.map(async (item) => {
          const response = await invoke("add_sharepoint_list_item", {
            token: useLoginStore.getState().accessToken,
            siteId: "16465dda-288d-4a9b-8851-afa9989a20e7",
            listId: useTargetStore.getState().lists.find((x) => x.year === 2025)
              .id,
            fields: item,
          });
          return response;
        })
      );
      if (
        responses.every((response) => response === "Item updated successfully")
      ) {
        useAppStore.getState().openStatus();
        useAppStore.getState().setStatusMessage("Targets added successfully!");
        useTargetStore.getState().getTargets(2025);
      } else {
        useAppStore.getState().setStatusMessage("Some items failed to update.");
      }
    } catch (error) {
      console.error("Error submitting commitment input:", error);
    }
  },

  updateTarget: async () => {
    try {
      const input = useTargetStore.getState().targetsInput;
      const responses = await Promise.all(
        input.map(async (item) => {
          const { id, ...fields } = item;
          const response = await invoke("update_sharepoint_list_item", {
            token: useLoginStore.getState().accessToken,
            siteId: "16465dda-288d-4a9b-8851-afa9989a20e7",
            listId: useTargetStore.getState().lists.find((x) => x.year === 2025)
              .id,
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
        useAppStore.getState().setStatusMessage("Targets updated succesfully!");
        useTargetStore.getState().getTargets(2025);
      } else {
        useAppStore.getState().setStatusMessage("Some items failed to update.");
      }
    } catch (error) {
      console.error("Error updating commitment input:", error);
    }
  },

  nextTargetFormPage: () => {
    set((state) => {
      const nextPage = state.targetFormPage + 1;
      return { targetFormPage: nextPage };
    });
  },

  previousTargetFormPage: () => {
    set((state) => {
      const previousPage = state.targetFormPage - 1;
      return { targetFormPage: previousPage };
    });
  },

  resetTargetFormPage: () => {
    set({ targetFormPage: 0 });
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

export default useTargetStore;
