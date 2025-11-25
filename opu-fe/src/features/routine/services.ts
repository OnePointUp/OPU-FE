import type { RoutineEntity } from "./domain";

type RoutineListResponse = {
    items: RoutineEntity[];
};

export async function fetchRoutineList(): Promise<RoutineEntity[]> {
    const res = await fetch("/api/routine", { cache: "no-store" });
    if (!res.ok) {
        throw new Error("루틴 목록 조회 실패");
    }
    const data: RoutineListResponse = await res.json();
    return data.items;
}
