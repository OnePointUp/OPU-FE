"use client";

import OpuForm from "../components/OpuForm";
import EmojiSelectSheet from "../components/EmojiSelectSheet";
import TimeSelectSheet from "../components/TimeSelectSheet";
import CategorySelectSheet from "../components/CategorySelectSheet";
import { useOpuRegisterPage } from "../hooks/useRegisterPage";
import ConfirmModal from "@/components/common/ConfirmModal";
import OpuDuplicateListModal from "../components/OpuDuplicateListModal";

export default function OpuRegisterPage() {
    const {
        formProps,
        emojiSheetProps,
        timeSheetProps,
        categorySheetProps,
        confirmModalProps,
        duplicateListModalProps,
    } = useOpuRegisterPage();

    return (
        <section>
            <OpuForm {...formProps} />
            <EmojiSelectSheet {...emojiSheetProps} />
            <TimeSelectSheet {...timeSheetProps} />
            <CategorySelectSheet {...categorySheetProps} />
            <ConfirmModal {...confirmModalProps} />
            <OpuDuplicateListModal {...duplicateListModalProps} />
        </section>
    );
}
