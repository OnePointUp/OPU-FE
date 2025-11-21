"use client";

import BottomSheet from "@/components/common/BottomSheet";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

type Props = {
    open: boolean;
    selected?: string;
    onClose: () => void;
    onSelect: (emoji: string) => void;
};

export default function EmojiSelectSheet({
    open,
    selected,
    onClose,
    onSelect,
}: Props) {
    return (
        <BottomSheet open={open} onClose={onClose}>
            <div className="p-1 pb-4">
                <EmojiPicker
                    skinTonesDisabled
                    previewConfig={{ showPreview: false }}
                    theme={"light" as Theme}
                    lazyLoadEmojis
                    onEmojiClick={(emojiData: EmojiClickData) => {
                        onSelect(emojiData.emoji);
                        onClose();
                    }}
                    width="100%"
                    height={320}
                />
            </div>
        </BottomSheet>
    );
}
