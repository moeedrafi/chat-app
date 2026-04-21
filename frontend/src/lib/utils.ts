function getOrdinal(n: number) {
  if (n > 3 && n < 21) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export const formattedDateTime = (iso: string) => {
  const date = new Date(iso);
  const day = date.getDate();
  const suffix = getOrdinal(day);

  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  const time = date.toLocaleString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day}${suffix} ${month}, ${year} — ${time}`;
};

export const formatSeenAt = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();

  // Normalize to midnight for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffInDays = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );

  // ✅ Today → show time
  if (diffInDays === 0) {
    return date.toLocaleString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // ✅ Yesterday
  if (diffInDays === 1) {
    return "Yesterday";
  }

  // ✅ Older → Apr 5th, 2026
  const day = date.getDate();
  const suffix = getOrdinal(day);

  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();

  return `${day}${suffix} ${month}, ${year}`;
};

export function toLocalDatetimeInput(isoString: string | undefined) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset(); // minutes
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
}
