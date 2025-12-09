import { RandomScope, TimeCode } from "../domain";
import RandomResultClient from "./RandomResultClient";

type RawSearchParams = {
    scope?: string;
    time?: string;
    excludeOpuId?: string;
};

type Props = {
    searchParams: RawSearchParams;
};

const VALID_SCOPES: RandomScope[] = ["ALL", "LIKED"];
const VALID_TIMES: TimeCode[] = ["ALL", "1M", "5M", "30M", "1H", "DAILY"];

export default function RandomResultPage({ searchParams }: Props) {
    const rawScope = searchParams.scope ?? "ALL";
    const rawTime = searchParams.time ?? "ALL";

    const scope: RandomScope = VALID_SCOPES.includes(rawScope as RandomScope)
        ? (rawScope as RandomScope)
        : "ALL";

    const time: TimeCode = VALID_TIMES.includes(rawTime as TimeCode)
        ? (rawTime as TimeCode)
        : "ALL";

    const excludeOpuId = searchParams.excludeOpuId
        ? Number(searchParams.excludeOpuId)
        : undefined;

    return (
        <RandomResultClient
            scope={scope}
            time={time}
            excludeOpuId={excludeOpuId}
        />
    );
}
