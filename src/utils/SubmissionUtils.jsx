export function exportCSV(
  submission_data,
  member_data,
  filename = "submission.csv"
) {
  if (!submission_data || !submission_data.length) {
    console.error("No data to export");
    return;
  }

  // Extract keys (column headers) from the first object and exclude specified columns
  const headers = Object.keys(submission_data[0]).filter(
    (key) => !["id", "created", "modified"].includes(key)
  );

  // Helper function to escape special characters
  const escapeValue = (value) => {
    if (value == null) return ""; // Handle null or undefined
    let stringValue = String(value);

    // If the value contains a comma, double quote, or newline, wrap it in double quotes
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      // Escape double quotes by doubling them
      stringValue = `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const dictKey = {
    author2: "LookupValue", // Extract only the "name" field from "author2"
  };

  const lookup = {
    author1: member_data.reduce((map, obj) => {
      map[obj.id] = obj.name;
      return map;
    }, {}),
  };

  // Generate CSV content
  const csvRows = [
    headers.join(","), // Header row
    ...submission_data.map((row) =>
      headers
        .map((field) => {
          let value = row[field];

          if (typeof value === "string") {
            value = value.trim();
            if (value.startsWith("- ")) {
              value = value.replace(/^- /, "");
            }
          }

          // Handle arrays of strings
          if (Array.isArray(value) && typeof value[0] === "string") {
            value = value.join(";"); // Join strings with semicolons
          }

          // Handle arrays of dictionaries
          if (Array.isArray(value) && typeof value[0] === "object") {
            const keyToExtract = dictKey[field]; // Get the key to extract for this column
            value = value.map((item) => item[keyToExtract]).join(";");
          }

          // Handle id-to-name replacement using the lookup map
          if (lookup[field]) {
            value = lookup[field][value] || value; // Replace id with name, fallback to original value
          }

          // Escape the final value
          return escapeValue(value);
        })
        .join(",")
    ),
  ];

  // Create CSV blob
  const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(csvData);

  // Trigger file download
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
