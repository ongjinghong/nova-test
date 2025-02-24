import useSubmissionStore from "../stores/SubmissionStore";

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getCurrentQuarter() {
  return Math.floor(new Date().getMonth() / 3) + 1;
}

export function getNextMondayMidnight() {
  let now = new Date();
  let day = now.getDay(); // Current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  let daysUntilNextMonday = day === 0 ? 1 : 8 - day; // Days to next Monday
  let nextMonday = new Date(now);

  nextMonday.setDate(now.getDate() + daysUntilNextMonday);
  nextMonday.setHours(0, 0, 0, 0); // Set time to 00:00:00

  return nextMonday;
}

export function getLast30Days(stringFormat) {
  const days = [];
  const currentDate = new Date();

  for (let i = 29; i >= 0; i--) {
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - i);

    if (stringFormat == true) {
      const dayFormatted = pastDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      days.push(dayFormatted);
    } else {
      days.push(pastDate);
    }
  }

  return days;
}

export function exportSubmissionCSV(filename = "submission.csv") {
  const submission_data = useSubmissionStore
    .getState()
    .filteredSubmissions.filter((item) => item.ListID !== "1");
  if (!submission_data || !submission_data.length) {
    console.error("No data to export");
    return;
  }

  // Extract keys (column headers) from the first object and exclude specified columns
  const headers = Object.keys(submission_data[0]).filter(
    (key) => !["id", "Created", "Modified"].includes(key)
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
