import type { OpuEntity } from "../domain";

export function toTimeLabel(minutes: number | null): string {
    if (minutes == null) return "매일";

    if (minutes === 60) return "1시간";
    if (minutes === 1440) return "1일";

    return `${minutes}분`;
}

export type TimeCode = OpuEntity["required_time"] | "ALL";

export const TIME_LABEL_MAP: Record<TimeCode, string> = {
    ALL: "소요시간 전체",
    "1M": "1분",
    "5M": "5분",
    "30M": "30분",
    "1H": "1시간",
    DAILY: "1일",
};

export function mapTimeToLabel(code: TimeCode): string {
    return TIME_LABEL_MAP[code] ?? "소요시간 전체";
}

export const TIME_OPTIONS: { code: TimeCode; label: string }[] = [
    { code: "ALL", label: TIME_LABEL_MAP.ALL },
    { code: "1M", label: TIME_LABEL_MAP["1M"] },
    { code: "5M", label: TIME_LABEL_MAP["5M"] },
    { code: "30M", label: TIME_LABEL_MAP["30M"] },
    { code: "1H", label: TIME_LABEL_MAP["1H"] },
    { code: "DAILY", label: TIME_LABEL_MAP.DAILY },
];
