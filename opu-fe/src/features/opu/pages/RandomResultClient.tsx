"use client";

import { useEffect, useState } from "react";
import RandomResultView from "../components/RandomResultView";
import type { OpuCardModel } from "@/features/opu/domain"; // 실제 타입에 맞게 수정
import RandomOpuLoadingScreen from "../components/RandomOpuLoadingScreen";

type Props = {
    item: OpuCardModel;
    delayMs?: number;
};

export default function RandomResultClient({ item, delayMs = 800 }: Props) {
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, delayMs);

        return () => clearTimeout(timer);
    }, [delayMs]);

    if (showLoading) {
        return <RandomOpuLoadingScreen />;
    }

    return <RandomResultView item={item} />;
}
