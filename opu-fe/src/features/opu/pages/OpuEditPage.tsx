"use client";

import { useState } from "react";
import OpuForm from "../components/OpuForm";
import { OPU } from "@/mocks/api/db/opu.db";
import { toCategoryName } from "@/features/opu/domain";
import { mapTimeToLabel, type TimeCode } from "../utils/time";
import TimeSelectSheet from "../components/TimeSelectSheet";
import CategorySelectSheet from "../components/CategorySelectSheet";
import EmojiSelectSheet from "../components/EmojiSelectSheet";

type Props = { id: number };

export default function OpuEditPage({ id }: Props) {
    const existing = OPU.find((o) => o.id === id);

    const [emojiSheetOpen, setEmojiSheetOpen] = useState(false);
    const [timeSheetOpen, setTimeSheetOpen] = useState(false);
    const [categorySheetOpen, setCategorySheetOpen] = useState(false);

    const [emoji, setEmoji] = useState<string>(existing?.emoji ?? "");
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

    const notFound = !existing;

    return (
        <div className="mt-3 mx-2">
            {notFound ? (
                <div
                    className="text-center text-sm py-10"
                    style={{
                        fontSize: "var(--text-sub)",
                        color: "var(--color-light-gray)",
                    }}
                >
                    존재하지 않는 OPU입니다
                </div>
            ) : (
                <>
                    <OpuForm
                        mode="edit"
                        initialValues={{
                            title: existing.title,
                            emoji,
                            timeLabel,
                            categoryLabel,
                            isPublic: existing.is_shared === "Y",
                        }}
                        onSubmit={(values) => {
                            console.log("수정 요청:", {
                                id: existing.id,
                                ...values,
                                requiredTime: timeCode,
                                categoryId,
                            });
                        }}
                        onClickEmoji={() => setEmojiSheetOpen(true)}
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

                    {/* 소요시간 선택 */}
                    <TimeSelectSheet
                        open={timeSheetOpen}
                        selectedCode={timeCode}
                        onClose={() => setTimeSheetOpen(false)}
                        onSelect={({ code, label }) => {
                            setTimeCode(code);
                            setTimeLabel(label);
                            setTimeSheetOpen(false);
                        }}
                    />

                    {/* 카테고리 선택 */}
                    <CategorySelectSheet
                        open={categorySheetOpen}
                        selectedId={categoryId}
                        onClose={() => setCategorySheetOpen(false)}
                        onSelect={({ id, label }) => {
                            setCategoryId(id);
                            setCategoryLabel(label);
                            setCategorySheetOpen(false);
                        }}
                    />
                </>
            )}
        </div>
    );
}
