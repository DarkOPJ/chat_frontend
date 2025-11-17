const formatConversationTime = (updatedAt) => {
  if (!updatedAt) return "";

  const now = new Date();
  const date = new Date(updatedAt);
  const diffInMs = now - date;
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  // Less than 24 hours - show time with AM/PM
  if (diffInHours < 24) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Less than 7 days - show day (Mon, Tue, etc.)
  if (diffInDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  // More than 7 days - show date (1/1/2023)
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
};

export default formatConversationTime;
