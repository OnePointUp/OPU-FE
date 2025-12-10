"use client";

export function useTodoTime() {
  const parse = (timeStr: string | null) => {
    if (!timeStr) return null;
    let [hour, minute] = timeStr.split(":").map(Number);
    const ampm = (hour >= 12 ? "PM" : "AM") as "AM" | "PM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return { ampm, hour, minute };
  };

  const formatTime = (
    v: string | { ampm: "AM" | "PM"; hour: number; minute: number } | null
  ) => {
    if (!v) return null;

    let parsed =
      typeof v === "string"
        ? parse(v)
        : v;

    if (!parsed) return null;

    const mm = String(parsed.minute).padStart(2, "0");
    return `${parsed.ampm} ${parsed.hour}:${mm}`;
  };

  return { parse, formatTime };
}
