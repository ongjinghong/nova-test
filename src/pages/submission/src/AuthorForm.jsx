import * as React from "react";

import { Autocomplete, FormLabel, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/system";
import { useMsal } from "@azure/msal-react";
import { invoke } from "@tauri-apps/api/core";

import { useSharePointData } from "../../../data/sharepointData";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function AuthorForm({ data, newData, setNewData, errors }) {
  const { instance, accounts } = useMsal();
  const { listData, token } = useSharePointData();
  const { member } = listData;
  const [author1Value, setAuthor1Value] = React.useState("");
  const [author2Value, setAuthor2Value] = React.useState("");
  const [author1Options, setAuthor1Options] = React.useState([]);
  const [author2Options, setAuthor2Options] = React.useState([]);

  const handleChange = (name, value) => {
    if (name === "PrimaryAuthorLookupId") {
      const lookupid = member.find((item) => item.name === value)?.lookupid;
      setNewData({
        ...newData,
        [name]: lookupid,
      });
    } else if (name === "SecondaryAuthor") {
      const extendName = `${name}LookupId`;
      const lookupidArray = value.map(
        (author) => member.find((item) => item.name === author)?.lookupid
      );
      setNewData({
        ...newData,
        [`${extendName}@odata.type`]: "Collection(Edm.String)",
        [extendName]: lookupidArray,
      });
    } else if (name === "Site" || name === "Domain") {
      setNewData({
        ...newData,
        [`${name}@odata.type`]: "Collection(Edm.String)",
        [name]: value,
      });
    } else {
      setNewData({
        ...newData,
        [name]: value,
      });
    }
  };

  // Fetch options from the Rust backend when input changes
  React.useEffect(() => {
    const fetchPerson = async () => {
      if (author1Value.length > 4) {
        try {
          const response = await invoke("fetch_person", {
            token: token,
            input: author1Value,
          });
          setAuthor1Options(response.value.map((item) => item.displayName));
        } catch (error) {
          console.error("Error fetching Intel employee:", error);
          throw error;
        }
      }
    };

    fetchPerson();
  }, [author1Value]);

  // Fetch options from the Rust backend when input changes
  React.useEffect(() => {
    const fetchPerson2 = async () => {
      if (author2Value.length > 4) {
        try {
          const response = await invoke("fetch_person", {
            token: token,
            input: author2Value,
          });
          setAuthor2Options(response.value.map((item) => item.displayName));
        } catch (error) {
          console.error("Error get Intelers:", error);
          throw error;
        }
      }
    };

    fetchPerson2();
  }, [author2Value]);

  return (
    <Grid container spacing={3}>
      <FormGrid size={6}>
        <FormLabel required>Primary Author</FormLabel>
        <Autocomplete
          options={author1Options}
          size="small"
          defaultValue={
            newData.PrimaryAuthorLookupId !== ""
              ? member.find(
                  (item) => item.lookupid === newData.PrimaryAuthorLookupId
                )?.name
              : data
              ? member.find((item) => item.lookupid === data.author1)?.name
              : ""
          }
          inputValue={author1Value}
          onInputChange={(event, newInputValue) => {
            setAuthor1Value(newInputValue);
          }}
          onChange={(e, value) => handleChange("PrimaryAuthorLookupId", value)}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              placeholder={data ? "" : "Involved Intel Flex's member who led"}
              size="small"
              error={errors.PrimaryAuthorLookupId}
              helperText={
                errors.PrimaryAuthorLookupId && "Primary Author is required"
              }
            />
          )}
          ListboxProps={{
            sx: {
              maxHeight: 150,
            },
          }}
        />
      </FormGrid>
      <FormGrid size={6}>
        <FormLabel>Secondary Authors</FormLabel>
        <Autocomplete
          multiple
          id="secondary-author"
          options={author2Options}
          size="small"
          defaultValue={
            newData.SecondaryAuthorLookupId.length !== 0
              ? newData.SecondaryAuthorLookupId.map(
                  (author) =>
                    member.find((item) => item.lookupid === author)?.name
                )
              : data?.author2
              ? data.author2.map((author) => author.LookupValue)
              : []
          }
          inputValue={author2Value}
          onInputChange={(event, newInputValue) => {
            setAuthor2Value(newInputValue);
          }}
          onChange={(e, value) => handleChange("SecondaryAuthor", value)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={
                data ? "" : "Involved Intel Flex's member who helped"
              }
              size="small"
            />
          )}
          ListboxProps={{
            sx: {
              maxHeight: 150,
            },
          }}
        />
      </FormGrid>
      <FormGrid size={6}>
        <FormLabel required>Site</FormLabel>
        <Autocomplete
          disablePortal
          multiple
          options={[
            "Malaysia",
            "Poland",
            "India",
            "Beijing",
            "Shanghai",
            "Arizona",
            "Oregon",
            "Costa Rica",
          ]}
          size="small"
          defaultValue={newData.Site.length !== 0 ? newData.Site : data?.site}
          onChange={(e, value) => handleChange("Site", value)}
          renderInput={(params) => (
            <TextField
              {...params}
              name="site"
              placeholder={data ? "" : "Involved Intel Flex's site(s)"}
              size="small"
              error={errors.Site}
              helperText={errors.Site && "Site is required"}
            />
          )}
          ListboxProps={{
            sx: {
              maxHeight: 150,
            },
          }}
        />
      </FormGrid>
      <FormGrid size={6}>
        <FormLabel required>Domain</FormLabel>
        <Autocomplete
          disablePortal
          multiple
          options={["Engineering", "TFM", "OMS", "FC"]}
          defaultValue={
            newData.Domain.length !== 0 ? newData.Domain : data?.domain
          }
          onChange={(e, value) => handleChange("Domain", value)}
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={data ? "" : "Involved Intel Flex's domain(s)"}
              size="small"
              error={errors.Domain}
              helperText={errors.Domain && "Domain is required"}
            />
          )}
        />
      </FormGrid>
    </Grid>
  );
}
