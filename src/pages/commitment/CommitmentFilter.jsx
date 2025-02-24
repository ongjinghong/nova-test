import React, { useEffect } from "react";
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
import useMemberStore from "../../stores/MemberStore";
import useCommitmentStore from "../../stores/CommitmentStore";

function CommitmentFilter() {
  const { sites, years, quarters, domains } = useAppStore(
    (state) => state.constants
  );
  const appMode = useAppStore((state) => state.appMode);
  const members = useMemberStore((state) => state.members);
  const data = useCommitmentStore((state) => state.commitments);
  const filteredData = useCommitmentStore((state) => state.filteredCommitments);
  const filters = useCommitmentStore((state) => state.filters);

  useEffect(() => {
    const { Year, Quarter, Site, Domain, Manager, Member } = filters;

    const filtered = data.filter((item) => {
      const matchesYear = Year.length === 0 || Year.includes(item.Year);
      const matchesQuarter =
        Quarter.length === 0 || Quarter.includes(item.Quarter);
      const matchesSite = Site.length === 0 || Site.includes(item.Site);
      const matchesDomain = Domain.length === 0 || Domain.includes(item.Domain);

      // Find the emails of members who have the specified manager names
      const memberNames = members
        .filter(
          (member) => Manager === member.Manager && member.Active === true
        )
        .map((member) => member.Name);

      const matchesManager = Manager === "" || memberNames.includes(item.Name);

      const matchesMember = Member === "" || Member === item.Name;

      return (
        matchesYear &&
        matchesQuarter &&
        matchesSite &&
        matchesDomain &&
        matchesManager &&
        matchesMember
      );
    });
    useCommitmentStore.getState().setFilteredCommitments(filtered);
  }, [filters, data]);

  const handleFilterChange = (key) => (event) => {
    console.log(key, event.target.value);
    useCommitmentStore.getState().setFilters(key, event.target.value);
  };

  const handleResetFilterClick = () => {
    useCommitmentStore.getState().resetFilters();
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

        {(appMode === "Innovation" || appMode === "Manager") && (
          <FormControl size="small">
            <InputLabel sx={{ ml: 1 }}>Manager</InputLabel>
            <Select
              size="small"
              value={filters.Manager}
              input={<OutlinedInput label="Manager" />}
              onChange={handleFilterChange("Manager")}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // Limits height to make it scrollable
                    overflowY: "auto",
                  },
                },
              }}
              sx={{
                width: "fit-content",
                minWidth: "100px",
                marginLeft: "10px",
              }}
            >
              {members
                .filter(
                  (member) =>
                    member.Role.includes("Manager") && member.Active === true
                )
                .map((member) => (
                  <MenuItem key={member.Name} value={member.Name}>
                    {member.Name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}

        {(appMode === "Innovation" || appMode === "Manager") &&
          filters.Manager !== "" && (
            <FormControl size="small">
              <InputLabel sx={{ ml: 1 }}>Member</InputLabel>
              <Select
                size="small"
                value={filters.Member}
                input={<OutlinedInput label="Member" />}
                onChange={handleFilterChange("Member")}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200, // Limits height to make it scrollable
                      overflowY: "auto",
                    },
                  },
                }}
                sx={{
                  width: "fit-content",
                  minWidth: "100px",
                  marginLeft: "10px",
                }}
              >
                <MenuItem value="">None</MenuItem> {/* Allow unselecting */}
                {members
                  .find((member) => member.Name === filters.Manager)
                  ?.Reports?.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        {filters !== useCommitmentStore.getInitialState().filters && (
          <Button
            variant="contained"
            sx={{ marginRight: 1 }}
            onClick={handleResetFilterClick}
          >
            Reset Filters
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default CommitmentFilter;
