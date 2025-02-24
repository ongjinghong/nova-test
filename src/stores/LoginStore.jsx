import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import useAzureStore from "./AzureStore";

const useLoginStore = create((set) => ({
  accessToken: null,
  loginProfile: null,
  loginPicture: null,
  loginProfileManager: {},
  loginProfileDirectReports: [],

  setAccessToken: (token) => {
    set({ accessToken: token });
  },

  getMSProfile: async () => {
    const response = await invoke("get_ms_profile", {
      token: useLoginStore.getState().accessToken,
    });
    console.debug("MS Profile:", response);
    set({ loginProfile: response });
  },

  getMSProfilePic: async () => {
    const response = await invoke("get_ms_profile_pic", {
      token: useLoginStore.getState().accessToken,
    });
    if (response) {
      console.debug("MS Profile Picture Found");
      set({ loginPicture: `data:image/png;base64,${response}` });
    } else {
      console.debug("No profile picture found.");
      set({ loginPicture: null });
    }
  },

  getMSProfileManager: async () => {
    const response = await invoke("get_manager", {
      token: useLoginStore.getState().accessToken,
    });
    set({ loginProfileManager: response });
  },

  getMSProfileDirectReports: async () => {
    const response = await invoke("get_direct_reports", {
      token: useLoginStore.getState().accessToken,
    });
    set({ loginProfileDirectReports: response.value });
  },
}));

export default useLoginStore;
