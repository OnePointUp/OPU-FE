"use client";

import { Icon } from "@iconify/react";
import { useId } from "react";

type Props = {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit?: (q: string) => void;
    placeholder?: string;
    className?: string;
};

export default function SearchBar({
    value,
    onChange,
    onSubmit,
    placeholder = "OPU 제목 입력",
    className = "",
}: Props) {
    const id = useId();
    console.log("render SearchBar");
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const q =
                    value ??
                    ((
                        e.currentTarget.elements.namedItem(
                            "q"
                        ) as HTMLInputElement
                    )?.value ||
                        "");
                onSubmit?.(q);
            }}
            className={`relative w-full max-w-[600px] h-[38px] ${className}`}
            aria-labelledby={id}
        >
            <Icon
                icon="mdi:magnify"
                width={20}
                height={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#ACAEB5" }}
            />
            <input
                id={id}
                name="q"
                type="search"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full h-full pl-10 pr-3 rounded-[38px] bg-[#F5F6F7] text-[14px] leading-[17px] font-medium placeholder-[#ACAEB5] text-zinc-700 outline-none focus:ring-2 focus:ring-black/5"
            />
        </form>
    );
}
