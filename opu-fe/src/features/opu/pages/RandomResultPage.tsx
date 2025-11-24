import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";
import { drawRandomOpu, type RandomScope } from "@/features/opu/random";
import type { TimeCode } from "@/features/opu/utils/time";
import RandomResultView from "../components/RandomResultView";

type RawSearchParams = {
    scope?: string;
    time?: string;
};

type Props = {
    searchParams: Promise<RawSearchParams>;
};

const VALID_SCOPES: RandomScope[] = ["ALL", "LIKED"];
const VALID_TIMES: TimeCode[] = ["ALL", "1M", "5M", "30M", "1H", "DAILY"];

export default async function RandomResultPage({ searchParams }: Props) {
    const params = await searchParams;

    const rawScope = params.scope ?? "ALL";
    const rawTime = params.time ?? "ALL";

    const scope: RandomScope = VALID_SCOPES.includes(rawScope as RandomScope)
        ? (rawScope as RandomScope)
        : "ALL";

    const time: TimeCode = VALID_TIMES.includes(rawTime as TimeCode)
        ? (rawTime as TimeCode)
        : "ALL";

    const opu = await drawRandomOpu(CURRENT_MEMBER_ID, scope, time);

    if (!opu) {
        return (
            <div className="flex items-center justify-center text-[var(--color-dark-gray)]">
                조건에 맞는 OPU가 없어요
            </div>
        );
    }

    return <RandomResultView item={opu} />;
}
