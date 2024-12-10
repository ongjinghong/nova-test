import { useState, useEffect } from "react";
import {
  Box,
  Chip,
  Typography,
  Popover,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import FilterListIcon from "@mui/icons-material/FilterList";

import { getCurrentYear } from "../../utils/GeneralUtils";
import useColorConfig from "../../config/colorConfig";

function CustomChip({ index, keyid, ...rest }) {
  const { chipColors } = useColorConfig();
  // Use label-based or key-based color
  const chipStyle = chipColors[keyid] || {
    backgroundColor: "gray",
    color: "white",
  };

  return <Chip key={index} sx={chipStyle} {...rest} />;
}

function FilterPanel({
  data,
  setData,
  memberData,
  setMemberData,
  managerMode,
  compareData,
  setCompareData,
  compareSecondData,
  setCompareSecondData,
}) {
  const currentYear = getCurrentYear();
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    Year: [currentYear],
    Quarter: [],
    Status: [],
    Category: [],
    Site: [],
    Domain: [],
    EA: [],
    Manager: [],
  });
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const statuses = [
    "NEW",
    "WIP",
    "Submitted",
    "Accepted",
    "Rejected",
    "Cancelled",
  ];
  const categories = [
    "Conferences",
    "IDF",
    "Initiatives",
    "Micro-Innovation",
    "Open Source",
    "Knowledge Sharing",
  ];
  const years = [...new Set(data.flatMap((item) => item.year))];
  const uniqueSites = [...new Set(data.flatMap((item) => item.site))];
  const domains = ["Engineering", "TFM", "OMS", "FC"];
  const ea = ["Yes", "No"];

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  // Remove a filter when the chip is clicked
  const handleChipDelete = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]:
        filterType === "Manager"
          ? []
          : prevFilters[filterType].filter((v) => v !== value),
    }));
  };

  const handleToggleChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const filterValues = prevFilters[filterType];
      if (filterValues.includes(value)) {
        // If the value is already in the filter, remove it (uncheck)
        return {
          ...prevFilters,
          [filterType]: filterValues.filter((v) => v !== value),
        };
      } else {
        // Otherwise, add the value (check)
        return {
          ...prevFilters,
          [filterType]: [...filterValues, value],
        };
      }
    });
  };

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      Manager: managerMode,
    }));
  }, [managerMode]);

  const filterData = (data, filters) => {
    const { Year, Quarter, Status, Category, Site, Domain, EA, Manager } =
      filters;

    return data.filter((item) => {
      const matchesYear =
        Year.length === 0 || Year.includes(item.year.toString());
      const matchesStatus = Status.length === 0 || Status.includes(item.status);
      const matchesQuarter =
        Quarter.length === 0 || Quarter.includes(item.quarter);
      const matchesSite =
        Site.length === 0 ||
        Site.some((selectedSite) => item.site.includes(selectedSite));
      const matchesDomain =
        Domain.length === 0 ||
        Domain.some((selectedDomain) => item.domain.includes(selectedDomain));
      const matchesEA = EA.length === 0 || EA.includes(item.ea ? "Yes" : "No");
      const matchesManager =
        Manager.length === 0 ||
        Manager.some(
          (lookupId) =>
            item.author1 === lookupId ||
            item.author2?.some(
              (author) => author.LookupId === parseInt(lookupId)
            )
        );
      const matchesCategory =
        Category.length === 0 ||
        Category.some((selectedCategory) =>
          item.category.includes(selectedCategory)
        );

      return (
        matchesYear &&
        matchesStatus &&
        matchesQuarter &&
        matchesSite &&
        matchesDomain &&
        matchesEA &&
        matchesManager &&
        matchesCategory
      );
    });
  };

  const filterMemberData = (memberData, filters) => {
    const { Site, Domain, Manager } = filters;

    return memberData.filter((item) => {
      const matchesSite =
        Site.length === 0 ||
        Site.some((selectedSite) => item.site.includes(selectedSite));
      const matchesDomain = Domain.length === 0 || Domain.includes(item.domain);
      const matchesManager =
        Manager.length === 0 || Manager.includes(item.lookupid);

      return matchesSite && matchesDomain && matchesManager;
    });
  };

  useEffect(() => {
    const filtered = filterData(data, filters);
    setData(filtered);

    if (compareData) {
      const filteredCompare = filterData(compareData, filters);
      setCompareData(filteredCompare);
    }

    if (compareSecondData) {
      const filteredSecondCompare = filterData(compareSecondData, filters);
      setCompareSecondData(filteredSecondCompare);
    }

    const filteredMember = filterMemberData(memberData, filters);
    setMemberData(filteredMember);
  }, [filters]);

  return (
    <>
      <Chip
        icon={<FilterListIcon fontSize="small" />}
        label="Filters"
        onClick={handleFilterClick}
      />
      <Popover
        className="filter-popover"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ width: "1500px" }}
      >
        <Grid
          container
          spacing={2}
          columns={12}
          sx={{
            width: "fit-content",
            padding: "10px",
          }}
        >
          <Grid size={2} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2">Year</Typography>
            <ToggleButtonGroup
              value={filters.Year}
              onChange={(e) => handleToggleChange("Year", e.target.value)}
              color="primary"
              fullWidth
            >
              {years.map((year, index) => (
                <ToggleButton
                  key={`year-${index}`}
                  value={year}
                  aria-label={year}
                >
                  {year}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
          <Grid size={4} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2">Quarter</Typography>
            <ToggleButtonGroup
              value={filters.Quarter}
              onChange={(e) => handleToggleChange("Quarter", e.target.value)}
              color="primary"
              fullWidth
            >
              {quarters.map((quarter, index) => (
                <ToggleButton
                  key={`quarter-${index}`}
                  value={quarter}
                  aria-label={quarter}
                >
                  {quarter}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
          <Grid size={3} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2">EA</Typography>
            <ToggleButtonGroup
              value={filters.EA}
              onChange={(e) => handleToggleChange("EA", e.target.value)}
              color="primary"
              fullWidth
            >
              {ea.map((ea_status, index) => (
                <ToggleButton
                  key={`ea_status-${index}`}
                  value={ea_status}
                  aria-label={ea_status}
                >
                  {ea_status}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
          <Grid size={8} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2">Status</Typography>
            <ToggleButtonGroup
              value={filters.Status}
              onChange={(e) => handleToggleChange("Status", e.target.value)}
              color="primary"
              fullWidth
            >
              {statuses.map((status, index) => (
                <ToggleButton
                  key={`status-${index}`}
                  value={status}
                  aria-label={status}
                >
                  {status}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
          {data.some((item) => "category" in item) && (
            <Grid size={12} sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle2">Category</Typography>
              <ToggleButtonGroup
                value={filters.Category}
                onChange={(e) => handleToggleChange("Category", e.target.value)}
                color="primary"
                fullWidth
              >
                {categories.map((category, index) => (
                  <ToggleButton
                    key={`category-${index}`}
                    value={category}
                    aria-label={category}
                  >
                    {category}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
          )}

          <Grid size={12} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2">Site</Typography>
            <ToggleButtonGroup
              value={filters.Site}
              onChange={(e) => handleToggleChange("Site", e.target.value)}
              color="primary"
              fullWidth
            >
              {uniqueSites.map((site, index) => (
                <ToggleButton
                  key={`site-${index}`}
                  value={site}
                  aria-label={site}
                >
                  {site}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
          <Grid size={6} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2">Domain</Typography>
            <ToggleButtonGroup
              value={filters.Domain}
              onChange={(e) => handleToggleChange("Domain", e.target.value)}
              color="primary"
              fullWidth
            >
              {domains.map((domain, index) => (
                <ToggleButton
                  key={`domain-${index}`}
                  value={domain}
                  aria-label={domain}
                >
                  {domain}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Popover>

      {/* Display Filter Chips */}
      <Box>
        {Object.keys(filters).map((filterType, index) =>
          filterType === "Manager"
            ? filters[filterType].length > 0 && (
                <CustomChip
                  index={`${filterType}-${index}`}
                  keyid={`${filterType}`}
                  label={`Direct Reports`}
                  onDelete={() => handleChipDelete(filterType, null)}
                />
              )
            : filters[filterType].map((value) => (
                <CustomChip
                  index={`${filterType}-${index}`}
                  keyid={`${filterType}`}
                  label={`${filterType}: ${value}`}
                  onDelete={() => handleChipDelete(filterType, value)}
                />
              ))
        )}
      </Box>
    </>
  );
}

export default FilterPanel;
