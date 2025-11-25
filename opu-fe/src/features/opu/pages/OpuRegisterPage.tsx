"use client";

import { useState } from "react";
import OpuForm from "../components/OpuForm";
import CategorySelectSheet from "../components/CategorySelectSheet";
import TimeSelectSheet from "../components/TimeSelectSheet";
import EmojiSelectSheet from "../components/EmojiSelectSheet";
import { TimeCode } from "../utils/time";

export default function OpuRegisterPage() {
    const [emojiSheetOpen, setEmojiSheetOpen] = useState(false);
    const [timeSheetOpen, setTimeSheetOpen] = useState(false);
    const [categorySheetOpen, setCategorySheetOpen] = useState(false);

    const [emoji, setEmoji] = useState<string | undefined>("");
    const [timeLabel, setTimeLabel] = useState("");
    const [categoryLabel, setCategoryLabel] = useState("");

    const [timeCode, setTimeCode] = useState<TimeCode | undefined>(undefined);
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

    return (
        <section>
            <OpuForm
                mode="create"
                initialValues={{
                    emoji,
                    timeLabel,
                    categoryLabel,
                    isPublic: false,
                }}
                onClickEmoji={() => setEmojiSheetOpen(true)}
                onClickTime={() => setTimeSheetOpen(true)}
                onClickCategory={() => setCategorySheetOpen(true)}
                onSubmit={(values) => {
                    console.log("등록 요청:", values);

                    // await fetch('/api/opu', { method:'POST', body: JSON.stringify(values) })
                }}
            />

            {/* 이모지 선택 */}
            <EmojiSelectSheet
                open={emojiSheetOpen}
                selected={emoji}
                onClose={() => setEmojiSheetOpen(false)}
                onSelect={(e) => setEmoji(e)}
            />

            {/* 소요시간 선택 */}
            <TimeSelectSheet
                open={timeSheetOpen}
                selectedCode={timeCode}
                onClose={() => setTimeSheetOpen(false)}
                onSelect={({ code, label }) => {
                    setTimeLabel(label);
                    setTimeCode(code);
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
        </section>
    );
}
