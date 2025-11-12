const formatLastSeen = (lastSeenDate) => {
  if (!lastSeenDate) return "last seen recently";

  const now = new Date();
  const lastSeen = new Date(lastSeenDate);
  const diffInMs = now - lastSeen;
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  // Less than 1 minute
  if (diffInMinutes < 1) return "last seen just now";

  // 1 minute
  if (diffInMinutes === 1) return "last seen a minute ago";

  // Less than 60 minutes
  if (diffInMinutes < 60) return `last seen ${diffInMinutes} minutes ago`;

  // Less than 24 hours - show time with AM/PM
  if (diffInHours < 24) {
    const time = lastSeen.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `last seen ${time}`;
  }

  // Yesterday
  if (diffInDays === 1) {
    const time = lastSeen.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `last seen yesterday ${time}`;
  }

  // Within a week - show day and time
  if (diffInDays < 7) {
    const day = lastSeen.toLocaleDateString("en-US", { weekday: "long" });
    const time = lastSeen.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `last seen ${day} ${time}`;
  }

  // More than a week - show date and time
  const date = lastSeen.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const time = lastSeen.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `last seen ${date} ${time}`;
};

export default formatLastSeen;
