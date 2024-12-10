export function getCurrentYear() {
  return new Date().getFullYear().toString();
}

export function getCurrentQuarter() {
  return Math.floor(new Date().getMonth() / 3) + 1;
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
