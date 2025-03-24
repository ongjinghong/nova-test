import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { getVersion } from "@tauri-apps/api/app";
import { getCurrentYear } from "../utils/Helpers";

const useAppStore = create((set) => ({
  themeMode: localStorage.getItem("themeMode") || "light",
  appMode: "Member",
  appVersion: "0.0.0",
  currentYear: getCurrentYear(),
  greetings: "Good Day",
  currentPage: "Overview",
  statusOpen: false,
  statusMessage: "",
  appReady: false,
  appSettings: {
    theme: "light",
    hideAnnouncementUntil: null,
  },

  constants: {
    pages: [
      "Overview",
      "Commitment",
      "Submission",
      "Target",
      "Stars",
      // "FullSpectrum",
      "Members",
      "Hall of Fames",
      "Tools",
      // "Fun Activities",
    ],
    years: [2024, 2025],
    quarters: ["Q1", "Q2", "Q3", "Q4"],
    sites: [
      "Arizona",
      "Beijing",
      "California",
      "Costa Rica",
      "India",
      "Israel",
      "Malaysia",
      "Oregon",
      "Poland",
      "Shanghai",
    ],
    domains: ["Engineering", "TFM", "OMS", "FC"],
    categories: [
      "Conferences",
      "IDF",
      "Initiatives",
      "Micro-Innovation",
      "Open Source",
      "Knowledge Sharing",
    ],
    statuses: ["NEW", "WIP", "Submitted", "Accepted", "Rejected", "Cancelled"],
    eas: [true, false],
  },

  portalLinks: [
    {
      name: "Portal",
      url: "https://goto.intel.com/intelflexinnovation",
    },
    {
      name: "Conferences",
      url: "https://intel.sharepoint.com/sites/intelflexinnovation/SitePages/Conference.aspx",
    },
    {
      name: "IDF",
      url: "https://intel.sharepoint.com/sites/intelflexinnovation/SitePages/IDF.aspx",
    },
    {
      name: "Initiatives",
      url: "https://intel.sharepoint.com/sites/intelflexinnovation/SitePages/Initiatives.aspx",
    },
    {
      name: "Micro Innovation",
      url: "https://intel.sharepoint.com/sites/intelflexinnovation/SitePages/Micro-Innovation.aspx",
    },
    {
      name: "Open Source",
      url: "https://intel.sharepoint.com/sites/intelflexinnovation/SitePages/Open-Source.aspx",
    },
  ],

  profileMenuAnchor: null,
  setProfileMenuAnchor: (anchor) => {
    set({ profileMenuAnchor: anchor });
  },

  toggleTheme: () => {
    const newMode =
      useAppStore.getState().themeMode === "light" ? "dark" : "light";
    set({ themeMode: newMode });
    localStorage.setItem("themeMode", newMode);
  },

  setGreetings: async () => {
    try {
      const response = await invoke("get_greeting");
      set({ greetings: response });
    } catch (error) {
      console.error("Failed to fetch greeting:", error);
    }
  },

  getAppVersion: async () => {
    getVersion()
      .then((version) => {
        set({ appVersion: version });
      })
      .catch((error) => {
        console.error("Error fetching version:", error);
      });
  },

  setAppMode: (mode) => {
    set({ appMode: mode });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  openStatus: () => set({ statusOpen: true }),
  closeStatus: () => set({ statusOpen: false }),

  setStatusMessage: (status) => {
    set({
      statusMessage: status,
    });
  },

  clearStatusMessage: () => {
    set({
      statusMessage: "",
    });
  },

  setAppReady: () => {
    set({ appReady: true });
  },

  clearAppReady: () => {
    set({ appReady: false });
  },
}));

export default useAppStore;
