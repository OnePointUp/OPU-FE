"use client";

import OpuForm from "../components/OpuForm";
import { OPU } from "@/mocks/api/db/opu.db";
import { toCategoryName } from "@/features/opu/domain";
import { mapTimeToLabel, TimeCode } from "../utils/time";
import TimeSelectSheet from "../components/TimeSelectSheet";
import CategorySelectSheet from "../components/CategorySelectSheet";
import EmojiSelectSheet from "../components/EmojiSelectSheet";
import { useState } from "react";

const EDIT_TARGET_ID = 1;

export default function OpuEditPage() {
    const existing = OPU.find((o) => o.id === EDIT_TARGET_ID);

    const [emojiSheetOpen, setEmojiSheetOpen] = useState(false);
    const [timeSheetOpen, setTimeSheetOpen] = useState(false);
    const [categorySheetOpen, setCategorySheetOpen] = useState(false);

    const [emoji, setEmoji] = useState<string | undefined>(
        existing?.emoji ?? ""
    );

    /* 안 쓰는 변수같아 보이지만 사실은 Edit 페이지에서 데이터를 보여주는 변수로,
     * 오류가 아니니 안심하고 넘어가셔도 됩니다! */
    const [timeCode, setTimeCode] = useState<TimeCode | undefined>(
        existing?.required_time
    );
    const [timeLabel, setTimeLabel] = useState<string>(
        existing ? mapTimeToLabel(existing.required_time) : ""
    );
    const [categoryId, setCategoryId] = useState<number | undefined>(
        existing?.category_id
    );
    const [categoryLabel, setCategoryLabel] = useState<string>(
        existing ? toCategoryName(existing.category_id) : ""
    );

    if (!existing) {
        return (
            <div
                className="text-center text-sm py-10"
                style={{
                    fontSize: "var(--text-sub)",
                    color: "var(--color-light-gray)",
                }}
            >
                존재하지 않는 OPU입니다
            </div>
        );
    }

    return (
        <div className="app-page">
            <OpuForm
                mode="edit"
                initialValues={{
                    title: existing.title,
                    timeLabel: mapTimeToLabel(existing.required_time),
                    categoryLabel: toCategoryName(existing.category_id),
                    isPublic: existing.is_shared === "Y",
                }}
                onSubmit={(values) => {
                    console.log("수정 요청:", {
                        id: existing.id,
                        ...values,
                    });

                    // 나중에:
                    // await fetch(`/api/opu/${existing.id}`, {
                    //   method: "PUT",
                    //   headers: { "Content-Type": "application/json" },
                    //   body: JSON.stringify(values),
                    // });
                }}
                onClickTime={() => setTimeSheetOpen(true)}
                onClickCategory={() => setCategorySheetOpen(true)}
            />

            {/* 이모지 선택 */}
            <EmojiSelectSheet
                open={emojiSheetOpen}
                selected={emoji}
                onClose={() => setEmojiSheetOpen(false)}
                onSelect={(e) => {
                    setEmoji(e);
                    setEmojiSheetOpen(false);
                }}
            />

            <TimeSelectSheet
                open={timeSheetOpen}
                onClose={() => setTimeSheetOpen(false)}
                onSelect={({ code, label }) => {
                    setTimeLabel(label);
                    setTimeCode(code);
                    setTimeSheetOpen(false);
                }}
            />

            <CategorySelectSheet
                open={categorySheetOpen}
                onClose={() => setCategorySheetOpen(false)}
                onSelect={({ id, label }) => {
                    setCategoryLabel(label);
                    setCategoryId(id);
                    setCategorySheetOpen(false);
                }}
            />
        </div>
    );
}
