import React, { useState, useEffect } from "react";
import { Button, Box, Typography, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSharePointData } from "../../data/sharepointData";
import CustomizedDataGrid from "../submission/SubmissionDetails";
import FilterPanel from "../../components/filter/filter";

export default function FullSpectrum() {
  const { listData } = useSharePointData();
  const { submission, member } = listData;
  const [filteredSubmission, setFilteredSubmission] = useState(submission);
  const [filteredMember, setFilteredMember] = useState(member);
  const [authorDetails, setAuthorDetails] = useState([]);
  const [managerFilter, setManagerFilter] = useState([]);

  useEffect(() => {
    const categoryMap = {};
    const itemMap = {};
    const openSourceCountMap = {};

    filteredSubmission.forEach((item) => {
      const { category, author1, author2 } = item;

      // Create a set of all authors for this submission
      const authors = new Set([
        author1,
        ...(Array.isArray(author2)
          ? author2.map((a) => a.LookupId.toString())
          : []),
      ]);

      // Map each author to the category
      authors.forEach((authorId) => {
        if (!categoryMap[authorId]) {
          categoryMap[authorId] = new Set();
          itemMap[authorId] = [];
          openSourceCountMap[authorId] = 0;
        }
        if (category !== "Knowledge Sharing") {
          categoryMap[authorId].add(category);
        }
        if (category === "Open Source") {
          openSourceCountMap[authorId] += 1;
        }
        itemMap[authorId].push(item);
      });
    });

    // Find authors with at least one submission in all 5 categories
    const authorsWithAllCategories = Object.keys(categoryMap).filter(
      (authorId) => categoryMap[authorId].size === 5
    );

    // Find authors with more than 5 "Open Source" submissions
    const authorsWithMoreThanFiveOpenSource = Object.keys(
      openSourceCountMap
    ).filter((authorId) => openSourceCountMap[authorId] >= 5);

    // Create a map of lookupid to name from member data
    const memberMap = member.reduce((acc, { lookupid, name }) => {
      acc[lookupid] = name;
      return acc;
    }, {});

    // Get the details of authors with submissions in all categories
    const authorDetails = authorsWithAllCategories.map((authorId) => ({
      name: memberMap[authorId],
      items: itemMap[authorId],
    }));

    // Get the names of authors with more than 5 "Open Source" submissions
    const authorsWithMoreThanFiveOpenSourceNames =
      authorsWithMoreThanFiveOpenSource.map((authorId) => memberMap[authorId]);

    console.log(authorsWithMoreThanFiveOpenSourceNames, itemMap);

    setAuthorDetails(authorDetails);
  }, [filteredSubmission]);

  return (
    <Box>
      <Box
        className="achievement-filter"
        sx={{ paddingLeft: "25px", marginBottom: "25px" }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={0.5} sx={{ flexGrow: 1 }}>
            <FilterPanel
              data={submission}
              setData={setFilteredSubmission}
              memberData={member}
              setMemberData={setFilteredMember}
              managerMode={managerFilter}
            />
          </Stack>
        </Stack>
      </Box>
      <Box sx={{ justifyItems: "center" }}>
        <Typography variant="h5" sx={{ mb: "25px", alignSelf: "center" }}>
          Flex Member who involved in at least 1 Submission for each 5 main
          Innovation Categories:{" "}
        </Typography>
        <Grid container spacing={2} columns={12} alignItems="stretch">
          {authorDetails.map(({ name, items }) => (
            <>
              <Grid
                size={2}
                sx={{ justifyItems: "center", alignContent: "center" }}
              >
                <Typography variant="h6">{name}</Typography>
              </Grid>
              <Grid size={10}>
                <CustomizedDataGrid data={items} rows={[5, 10, 20]} />
              </Grid>
            </>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
