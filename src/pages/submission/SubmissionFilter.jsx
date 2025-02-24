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
import useMemberStore from "../../stores/MemberStore";
import useSubmissionStore from "../../stores/SubmissionStore";

function SubmissionFilter() {
  const { years, quarters, sites, domains, categories, statuses, eas } =
    useAppStore((state) => state.constants);
  const appMode = useAppStore((state) => state.appMode);
  const members = useMemberStore((state) => state.members);
  const data = useSubmissionStore((state) => state.submissions);
  const filters = useSubmissionStore((state) => state.filters);

  useEffect(() => {
    const {
      Year,
      Quarter,
      Site,
      Domain,
      Status,
      Category,
      EA,
      Manager,
      Member,
    } = filters;

    const filtered = data.filter((item) => {
      const matchesYear = Year.length === 0 || Year.includes(item.Year);
      const matchesQuarter =
        Quarter.length === 0 || Quarter.includes(item.Quarter);
      const matchesSite =
        Site.length === 0 || item.Site?.some((site) => Site.includes(site));
      const matchesDomain =
        Domain.length === 0 ||
        item.Domain?.some((domain) => Domain.includes(domain));
      const matchesStatus = Status.length === 0 || Status.includes(item.Status);
      const matchesCategory =
        Category.length === 0 || Category.includes(item.Category);
      const matchesEA = EA.length === 0 || EA.includes(item.EA);
      // Find the emails of members who have the specified manager names
      const memberNames = members
        .filter(
          (member) => Manager === member.Manager && member.Active === true
        )
        .map((member) => member.Name);

      const matchesManager =
        Manager === "" ||
        memberNames.includes(item.PrimaryAuthor) ||
        item.SecondaryAuthors?.some((author) => memberNames.includes(author));

      const matchesMember =
        Member === "" ||
        Member === item.PrimaryAuthor ||
        item.SecondaryAuthors?.includes(Member);

      return (
        matchesYear &&
        matchesQuarter &&
        matchesSite &&
        matchesDomain &&
        matchesStatus &&
        matchesCategory &&
        matchesEA &&
        matchesManager &&
        matchesMember
      );
    });

    const filteredMembers = members.filter((item) => {
      const matchesSite = Site.length === 0 || Site.includes(item.Site);
      const matchesDomain = Domain.length === 0 || Domain.includes(item.Domain);
      const matchesManager = Manager === "" || Manager === item.Manager;
      const matchesMember = Member === "" || Member === item.Name;

      return matchesSite && matchesDomain && matchesManager && matchesMember;
    });

    useSubmissionStore.getState().setFilteredSubmissions(filtered);
    useMemberStore.getState().setFilteredMembers(filteredMembers);
  }, [filters, data, members]);

  const handleFilterChange = (key) => (event) => {
    useSubmissionStore.getState().setFilters(key, event.target.value);
  };

  const handleResetFilterClick = () => {
    useSubmissionStore.getState().resetFilters();
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
              <Box
                sx={{
                  display: "flex",
                  overflow: "hidden",
                  flexWrap: "ellipsis",
                }}
              >
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            sx={{ width: "100px", marginLeft: "10px" }}
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
              <Box
                sx={{
                  display: "flex",
                  overflow: "hidden",
                  flexWrap: "ellipsis",
                }}
              >
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            sx={{ width: "100px", marginLeft: "10px" }}
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
              <Box
                sx={{
                  display: "flex",
                  overflow: "hidden",
                  flexWrap: "ellipsis",
                }}
              >
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            sx={{ width: "80px", marginLeft: "10px" }}
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
              <Box
                sx={{
                  display: "flex",
                  overflow: "hidden",
                  flexWrap: "ellipsis",
                }}
              >
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            sx={{ width: "100px", marginLeft: "10px" }}
          >
            {domains.map((domain) => (
              <MenuItem key={domain} value={domain}>
                {domain}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel sx={{ ml: 1 }}>Status</InputLabel>
          <Select
            size="small"
            multiple
            value={filters.Status}
            input={<OutlinedInput label="Status" />}
            onChange={handleFilterChange("Status")}
            renderValue={(selected) => (
              <Box
                sx={{
                  display: "flex",
                  overflow: "hidden",
                  flexWrap: "ellipsis",
                }}
              >
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            sx={{ width: "100px", marginLeft: "10px" }}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel sx={{ ml: 1 }}>Category</InputLabel>
          <Select
            size="small"
            multiple
            value={filters.Category}
            input={<OutlinedInput label="Category" />}
            onChange={handleFilterChange("Category")}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
            sx={{ width: "fit-content", minWidth: "110px", marginLeft: "10px" }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel sx={{ ml: 1 }}>EA</InputLabel>
          <Select
            size="small"
            value={filters.EA}
            input={<OutlinedInput label="EA" />}
            onChange={handleFilterChange("EA")}
            sx={{ width: "75px", marginLeft: "10px" }}
          >
            <MenuItem value="">None</MenuItem> {/* Allow unselecting */}
            {eas.map((ea) => (
              <MenuItem key={ea} value={ea}>
                {ea ? "Yes" : "No"}
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
              <MenuItem value="">None</MenuItem> {/* Allow unselecting */}
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
      </Box>

      {filters !== useSubmissionStore.getInitialState().filters && (
        <Button
          variant="contained"
          onClick={handleResetFilterClick}
          sx={{ minWidth: "fit-content", marginRight: "4px" }}
        >
          Reset Filters
        </Button>
      )}
    </Box>
  );
}

export default SubmissionFilter;
