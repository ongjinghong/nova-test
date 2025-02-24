import React, { useEffect } from "react";
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import "./Commitment.css";
import useAppStore from "../../stores/AppStore";
import useMemberStore from "../../stores/MemberStore";
import useCommitmentStore from "../../stores/CommitmentStore";

import CommitmentFilter from "./CommitmentFilter";
import CategoryCard from "../../shared/CategoryCard";
import CommitmentQuarterBarChart from "./CommitmentQuarterBarChart";
import CommitmentTotalStatCard from "./CommitmentTotalStatCard";
import CommitmentForm from "./CommitmentForm";

const Commitment = () => {
  const commitmentType = ["Primary", "Secondary"];
  const currentYear = useAppStore((state) => state.currentYear);
  const { categories } = useAppStore((state) => state.constants);
  const loginMember = useMemberStore((state) => state.loginMember);
  const commitments = useCommitmentStore((state) => state.commitments);
  const quarterCommitments = useCommitmentStore(
    (state) => state.quarterCommitments
  );
  const lists = useCommitmentStore((state) => state.lists);

  useEffect(() => {
    lists.forEach(async (item) => {
      if (item.year !== currentYear && item.data.length === 0) {
        await useCommitmentStore.getState().getCommitments(item.year);
      }
    });
  }, []);

  const handleAddClick = () => {
    useCommitmentStore.getState().openCommitmentForm();
    useCommitmentStore.getState().resetCommitmentFormPage();
    useCommitmentStore.getState().setCommitmentFormType("Add");
  };

  const handleUpdateClick = () => {
    useCommitmentStore.getState().openCommitmentForm();
    useCommitmentStore.getState().resetCommitmentFormPage();
    useCommitmentStore.getState().setCommitmentFormType("Update");
  };

  const getCategorySum = (type, category) => {
    switch (category) {
      case "Conferences":
        return quarterCommitments.reduce(
          (sum, commitment) =>
            sum +
            (type === "Primary"
              ? commitment.Conferences_Primary
              : commitment.Conferences_Secondary),
          0
        );
      case "IDF":
        return quarterCommitments.reduce(
          (sum, commitment) =>
            sum +
            (type === "Primary"
              ? commitment.IDF_Primary
              : commitment.IDF_Secondary),
          0
        );
      case "Initiatives":
        return quarterCommitments.reduce(
          (sum, commitment) =>
            sum +
            (type === "Primary"
              ? commitment.Initiatives_Primary
              : commitment.Initiatives_Secondary),
          0
        );
      case "Micro-Innovation":
        return quarterCommitments.reduce(
          (sum, commitment) =>
            sum +
            (type === "Primary"
              ? commitment.MicroInnovation_Primary
              : commitment.MicroInnovation_Secondary),
          0
        );
      case "Open Source":
        return quarterCommitments.reduce(
          (sum, commitment) =>
            sum +
            (type === "Primary"
              ? commitment.OpenSource_Primary
              : commitment.OpenSource_Secondary),
          0
        );
      default:
        return 0;
    }
  };

  return (
    <Box className="commitment-container">
      <Box className="commitment-filter">
        <FilterAltIcon />
        <CommitmentFilter />
        {commitments.filter(
          (item) =>
            item.Year === currentYear && item.Email === loginMember.Email
        ).length === 4 ? (
          <Button
            className="header-button"
            variant="contained"
            startIcon={<AutoFixHighIcon />}
            onClick={handleUpdateClick}
          >
            Update {currentYear} Commitment
          </Button>
        ) : (
          <Button
            className="header-button"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add {currentYear} Commitment
          </Button>
        )}
      </Box>
      <Box className="commitment-content">
        <Grid container spacing={4} columns={12}>
          {commitmentType.map((type) => (
            <Grid key={type} size={6}>
              <Grid container spacing={1} columns={12}>
                <Grid size={12}>
                  <CommitmentTotalStatCard type={type} />
                </Grid>

                {categories.map((category) => (
                  <Grid key={category} size={4}>
                    <CategoryCard
                      category={category}
                      sum={getCategorySum(type, category)}
                    />
                  </Grid>
                ))}

                <Grid size={12}>
                  <CommitmentQuarterBarChart type={type} />
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>

      <CommitmentForm />
    </Box>
  );
};

export default Commitment;
