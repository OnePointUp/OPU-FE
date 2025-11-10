"use client";

import { useEffect, useState } from "react";
import OpuCard from "@/components/common/OpuCard";
import { fetchOpuCardsByMember } from "@/features/opu/services";
import type { OpuCardModel } from "@/types/opu";
import SearchBar from "@/components/common/SearchBar";

export default function OpuListTestPage() {
    const [data, setData] = useState<OpuCardModel[]>([]);

    useEffect(() => {
        fetchOpuCardsByMember(101).then(setData);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center gap-5 py-6">
            <div className="flex justify-center w-full px-6">
                <SearchBar />
            </div>

            <div
                className="mx-auto w-full px-6 flex flex-col gap-3"
                style={{ width: "min(100%, var(--app-max))" }} // 최대 600px
            >
                {data.map((item) => (
                    <OpuCard
                        key={item.id}
                        item={item}
                        onAddTodo={(id) => console.log("add todo", id)}
                        onMore={(id) => console.log("more", id)}
                    />
                ))}
            </div>
        </div>
    );
}
