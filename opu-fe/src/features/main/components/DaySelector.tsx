"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import CalendarPicker from "./CalendarPicker";

type Props = {
    year: number;
    month: number;
    day: number;
    onSelect: (y: number, m: number, d: number) => void;
    onToggleView: () => void;
    viewMode: "month" | "week";
    className?: string;
    hideViewToggle?: boolean;
};

export default function MonthSelector({
    year,
    month,
    day,
    onSelect,
    onToggleView,
    viewMode,
    className = "",
    hideViewToggle = false,
}: Props) {
    const [open, setOpen] = useState(false);

    const initialDate = new Date(year, month - 1, day);

    const handleSelect = (date: Date) => {
        onSelect(date.getFullYear(), date.getMonth() + 1, date.getDate());
        setOpen(false);
    };

    return (
        <div className={className}>
            <div
                className={`
          flex items-center w-full mt-[10px]
          ${hideViewToggle ? "justify-center" : "justify-between"}
        `}
            >
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-1.5 font-semibold"
                    style={{ fontSize: "var(--text-body)" }}
                >
                    {year}년 {month}월
                    <Icon
                        icon="teenyicons:down-solid"
                        width={12}
                        height={12}
                        color={"var(--color-dark-gray)"}
                    />
                </button>

                {!hideViewToggle && (
                    <button
                        onClick={onToggleView}
                        className="px-3 py-1 rounded-full bg-[var(--color-light-blue-gray)]"
                        style={{
                            fontSize: "var(--text-sub)",
                            fontWeight: "var(--weight-semibold)",
                        }}
                    >
                        {viewMode === "month" ? "월" : "주"}
                    </button>
                )}
            </div>

            {open && (
                <CalendarPicker
                    open={open}
                    onClose={() => setOpen(false)}
                    initial={initialDate}
                    onSelect={handleSelect}
                />
            )}
        </div>
    );
}
