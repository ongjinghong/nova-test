import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import useLoginStore from "./LoginStore";
import { getLast30Days } from "../utils/Helpers";

const useMemberStore = create((set) => ({
  ListID: "%7B795efc76-5bbe-4940-92b5-f4e172d7f687%7D",
  members: [],
  loginMember: null,
  filteredMembers: [],
  filters: {
    Site: [],
    Domain: [],
    Manager: [],
  },
  heatParticipants: {
    title: "Participant Ratio",
    value: "0",
    interval: "Last 30 days",
    interval_date: getLast30Days(true),
    trend: "neutral",
    trend_value: "0",
    data: [],
    not_participated: [],
  },

  getFlexMemberList: async () => {
    const response = await invoke("fetch_sharepoint_list_item", {
      token: useLoginStore.getState().accessToken,
      siteId: "16465dda-288d-4a9b-8851-afa9989a20e7",
      listId: useMemberStore.getState().ListID,
      listType: "data",
      maxItem: 750,
    });

    const filterFlexMembers = response.value.map((item) => {
      const basicItem = {
        id: item.id,
        LookupId: item.fields.LookupId,
        Name: item.fields.Name,
        Email: item.fields.Email,
        Department: item.fields.Department,
        Manager: item.fields.Manager,
        Site: "",
        Domain: item.fields.Domain,
        Picture: item.fields.Picture,
        Active: item.fields.Active,
        Role: item.fields.Role,
        Reports: [],
      };

      if (
        item.fields.Country === "United States" ||
        item.fields.Country === "China"
      ) {
        switch (item.fields.City) {
          case "BJ":
            basicItem.Site = "Beijing";
            break;
          case "SH":
            basicItem.Site = "Shanghai";
            break;
          case "AZ":
          case "A1":
            basicItem.Site = "Arizona";
            break;
          case "CA":
            basicItem.Site = "California";
            break;
          case "OR":
            basicItem.Site = "Oregon";
            break;
          default:
            break;
        }
      } else if (item.fields.Country === "Australia") {
        basicItem.Site = "Malaysia";
      } else {
        basicItem.Site = item.fields.Country;
      }

      return basicItem;
    });

    // Append Name to Manager's Reports array
    filterFlexMembers.forEach((member) => {
      const manager = filterFlexMembers.find((m) => m.Name === member.Manager);
      if (manager) {
        manager.Reports.push(member.Name);
      }
    });
    console.debug("Flex members response:", filterFlexMembers);

    set((state) => {
      const azureLogin = useLoginStore.getState().loginProfile;
      const loginMember = filterFlexMembers.find(
        (member) => member.Email === azureLogin.mail
      );
      console.debug("Login Flex Member:", loginMember);

      return {
        members: filterFlexMembers,
        loginMember: loginMember,
      };
    });
  },

  setFilteredMembers: (data) => {
    set((state) => ({
      filteredMembers: data,
    }));
  },

  getLookupID: async (email) => {
    const response = await invoke("get_lookup_id", {
      email: email,
    });
    console.log("Lookup ID response:", response);
    return response.toString();
  },

  getIntelEmpoyeeNames: async (input) => {
    const response = await invoke("get_intel_employee_name", {
      token: useLoginStore.getState().accessToken,
      input: input,
    });
    return response.value.map((item) => item.displayName);
  },

  setHeatParticipants: (data) => {
    set((state) => ({
      heatParticipants: {
        ...state.heatParticipants,
        value: data.value,
        trend: data.trend,
        trend_value: data.trend_value,
        data: data.data,
        not_participated: data.not_participated,
      },
    }));
  },
}));

export default useMemberStore;
