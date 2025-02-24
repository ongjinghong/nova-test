import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Typography,
  Select,
} from "@mui/material";

import useAppStore from "../../stores/AppStore";
import useTargetStore from "../../stores/TargetStore";

function TargetFilter() {
  const data = useTargetStore((state) => state.targets);
  const filters = useTargetStore((state) => state.filters);
  const filteredData = useTargetStore((state) => state.filteredTargets);

  const constants = useAppStore((state) => state.constants);
  const { years, quarters, domains } = constants;
  const sites = [...new Set(data.flatMap((item) => item.Site))];

  useEffect(() => {
    const { Year, Quarter, Site, Domain } = filters;

    const filtered = data.filter((item) => {
      const matchesYear = Year.length === 0 || Year.includes(item.Year);
      const matchesQuarter =
        Quarter.length === 0 || Quarter.includes(item.Quarter);
      const matchesSite = Site.length === 0 || Site.includes(item.Site);
      const matchesDomain = Domain.length === 0 || Domain.includes(item.Domain);

      return matchesYear && matchesQuarter && matchesSite && matchesDomain;
    });
    useTargetStore.getState().setFilteredTargets(filtered);
  }, [filters, data]);

  const handleFilterChange = (key) => (event) => {
    console.log(key, event.target.value);
    useTargetStore.getState().setFilters(key, event.target.value);
  };

  const handleResetFilterClick = () => {
    useTargetStore.getState().resetFilters();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        flexGrow: 1,
        paddingY: "4px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          rowGap: "8px",
        }}
      >
        <FormControl size="small">
          <InputLabel sx={{ ml: 1 }}>Year</InputLabel>
          <Select
            size="small"
            multiple
            value={filters.Year}
            input={<OutlinedInput label="Year" />}
            onChange={handleFilterChange("Year")}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            sx={{ width: "fit-content", marginLeft: "10px" }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel sx={{ ml: 1 }}>Quarter</InputLabel>
          <Select
            size="small"
            multiple
            value={filters.Quarter}
            input={<OutlinedInput label="Quarter" />}
            onChange={handleFilterChange("Quarter")}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            sx={{ width: "fit-content", minWidth: "100px", marginLeft: "10px" }}
          >
            {quarters.map((quarter) => (
              <MenuItem key={quarter} value={quarter}>
                {quarter}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel sx={{ ml: 1 }}>Site</InputLabel>
          <Select
            size="small"
            multiple
            value={filters.Site}
            input={<OutlinedInput label="Site" />}
            onChange={handleFilterChange("Site")}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            sx={{ width: "fit-content", minWidth: "100px", marginLeft: "10px" }}
          >
            {sites.map((site) => (
              <MenuItem key={site} value={site}>
                {site}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel sx={{ ml: 1 }}>Domain</InputLabel>
          <Select
            size="small"
            multiple
            value={filters.Domain}
            input={<OutlinedInput label="Domain" />}
            onChange={handleFilterChange("Domain")}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            sx={{ width: "fit-content", minWidth: "100px", marginLeft: "10px" }}
          >
            {domains.map((domain) => (
              <MenuItem key={domain} value={domain}>
                {domain}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {filters !== useTargetStore.getInitialState().filters && (
        <Button
          variant="contained"
          sx={{ marginRight: 1 }}
          onClick={handleResetFilterClick}
        >
          Reset Filters
        </Button>
      )}
    </Box>
  );
}

export default TargetFilter;
