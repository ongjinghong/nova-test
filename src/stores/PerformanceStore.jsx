import { create } from "zustand";
import useAppStore from "./AppStore";
import useCommitmentStore from "./CommitmentStore";
import useSubmissionStore from "./SubmissionStore";
import useTargetStore from "./TargetStore";

const usePerformanceStore = create((set) => ({
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
