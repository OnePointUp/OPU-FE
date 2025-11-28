import RoutineFrequencyPage from "@/features/routine/pages/RoutineFrequencyPage";
import type { RoutineFrequency } from "@/features/routine/domain";

type Props = {
    searchParams: { frequency?: string };
};

export default function Page({ searchParams }: Props) {
    const initialFrequency: RoutineFrequency =
        (searchParams?.frequency as RoutineFrequency | undefined) ?? "DAILY";

    return <RoutineFrequencyPage initialFrequency={initialFrequency} />;
}
