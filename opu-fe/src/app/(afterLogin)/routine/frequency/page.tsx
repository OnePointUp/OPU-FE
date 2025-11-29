import RoutineFrequencyPage from "@/features/routine/pages/RoutineFrequencyPage";
import type { RoutineFrequency } from "@/features/routine/domain";

type SearchParams = {
    frequency?: RoutineFrequency;
    days?: string;
    months?: string;
    last?: string;
    routineId?: string;
    mode?: string;
};

type Props = {
    searchParams: Promise<SearchParams>;
};

function parseNumberList(str: string | undefined): number[] {
    if (!str) return [];
    return str
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n));
}

export default async function FrequencyPage({ searchParams }: Props) {
    const sp = await searchParams;

    const freq = (sp.frequency ?? "DAILY") as RoutineFrequency;
    const days = parseNumberList(sp.days);
    const months = parseNumberList(sp.months);
    const last = sp.last === "true";

    const routineIdParam = sp.routineId;
    const routineId = routineIdParam ? parseInt(routineIdParam, 10) : undefined;

    const mode = sp.mode;

    return (
        <RoutineFrequencyPage
            initialFrequency={freq}
            initialDays={days}
            initialMonths={months}
            initialLast={last}
            routineId={routineId}
            mode={mode}
        />
    );
}
