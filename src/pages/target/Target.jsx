import React, { useEffect } from "react";
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import "./Target.css";
import useAppStore from "../../stores/AppStore";
import useMemberStore from "../../stores/MemberStore";
import useTargetStore from "../../stores/TargetStore";

import TargetFilter from "./TargetFilter";
import TargetTotalStatCard from "./TargetTotalStatCard";
import CategoryCard from "../../shared/CategoryCard";
import TargetQuarterBarChart from "./TargetQuarterBarChart";
import TargetDetailsTable from "./TargetDetailsTable";
import TargetForm from "./TargetForm";

const Target = () => {
  const currentYear = useAppStore((state) => state.currentYear);
  const { categories } = useAppStore((state) => state.constants);
  const appMode = useAppStore((state) => state.appMode);
  const loginMember = useMemberStore((state) => state.loginMember);
  const lists = useTargetStore((state) => state.lists);
  const targets = useTargetStore((state) => state.targets);
  const quarterTargets = useTargetStore((state) => state.quarterTargets);
  const getTargets = useTargetStore((state) => state.getTargets);

  useEffect(() => {
    lists.forEach(async (item) => {
      if (item.year !== currentYear && item.data.length === 0) {
        await getTargets(item.year);
      }
    });
  }, []);

  const getCategorySum = (category) => {
    switch (category) {
      case "Conferences":
        return quarterTargets.reduce(
          (sum, target) => sum + target.Conference,
          0
        );
      case "IDF":
        return quarterTargets.reduce((sum, target) => sum + target.IDF, 0);
      case "Initiatives":
        return quarterTargets.reduce(
          (sum, target) => sum + target.POC_x002f_Pitching,
          0
        );
      case "Micro-Innovation":
        return quarterTargets.reduce(
          (sum, target) => sum + target.Micro_x002d_Innovation,
          0
        );
      case "Open Source":
        return quarterTargets.reduce(
          (sum, target) => sum + target.OpenSource,
          0
        );
      default:
        return 0;
    }
  };

  const handleAddClick = () => {
    useTargetStore.getState().openTargetForm();
    useTargetStore.getState().resetTargetFormPage();
    useTargetStore.getState().setTargetFormType("Add");
  };

  const handleUpdateClick = () => {
    useTargetStore.getState().openTargetForm();
    useTargetStore.getState().resetTargetFormPage();
    useTargetStore.getState().setTargetFormType("Update");
  };

  return (
    <Box className="target-container">
      <Box className="target-filter">
        <FilterAltIcon />
        <TargetFilter />
        {(appMode === "Innovation" || appMode === "Manager") && (
          <>
            {targets.some(
              (target) =>
                target.Site === loginMember.Site &&
                target.Domain === loginMember.Domain
            ) ? (
              <Button
                className="header-button"
                variant="contained"
                startIcon={<AutoFixHighIcon />}
                onClick={handleUpdateClick}
              >
                Update {currentYear} Target
              </Button>
            ) : (
              <Button
                className="header-button"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
              >
                Add {currentYear} Target
              </Button>
            )}
          </>
        )}
      </Box>

      <Box className="target-content">
        <Grid container spacing={2} columns={12}>
          {/* First row */}
          <Grid size={4}>
            <TargetTotalStatCard />
          </Grid>

          <Grid size={8}>
            <Grid container spacing={1} columns={12}>
              {categories.map((category) => (
                <Grid key={category} size={4}>
                  <CategoryCard
                    category={category}
                    sum={getCategorySum(category)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid size={12}>
            <TargetQuarterBarChart />
          </Grid>
          <Grid size={12}>
            <TargetDetailsTable />
          </Grid>
        </Grid>
      </Box>

      <TargetForm />
    </Box>
  );
};

export default Target;
