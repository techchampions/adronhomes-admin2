// utils/formatDateTime.ts
export const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }); // e.g., "15 Aug 2025"
  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }); // e.g., "14:22:56"
  return { date: formattedDate, time: formattedTime };
};