import type { OpuEntity } from "../domain";

export type PeriodCode = OpuEntity["required_time"] | "ALL";

export const PERIOD_LABEL_MAP: Record<PeriodCode, string> = {
    ALL: "소요시간 전체",
    "1M": "1분",
    "5M": "5분",
    "30M": "30분",
    "1H": "1시간",
    DAILY: "1일",
};

export function mapPeriodToLabel(code: PeriodCode): string {
    return PERIOD_LABEL_MAP[code] ?? "소요시간 전체";
}

export const PERIOD_OPTIONS: { code: PeriodCode; label: string }[] = [
    { code: "ALL", label: PERIOD_LABEL_MAP.ALL },
    { code: "1M", label: PERIOD_LABEL_MAP["1M"] },
    { code: "5M", label: PERIOD_LABEL_MAP["5M"] },
    { code: "30M", label: PERIOD_LABEL_MAP["30M"] },
    { code: "1H", label: PERIOD_LABEL_MAP["1H"] },
    { code: "DAILY", label: PERIOD_LABEL_MAP.DAILY },
];
