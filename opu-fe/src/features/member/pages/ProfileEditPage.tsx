"use client";

import ProfileAvatarPicker from "@/features/member/components/ProfileAvatarPicker";
import NicknameField from "@/features/member/components/NicknameField";
import IntroField from "@/features/member/components/IntroField";
import OpuActionButton from "@/components/common/OpuActionButton";
import { useProfileEdit } from "../hooks/useProfileEdit";
import { useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function ProfileEditPage() {
    const {
        nickname,
        bio,
        profileImageUrl,
        saving,
        introMax,
        setNickname,
        setBio,
        handleDeleteImage,
        handlePickImage,
        handleSave,
        canSubmit,
    } = useProfileEdit();

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <section>
            <ProfileAvatarPicker
                nickname={nickname}
                previewUrl={profileImageUrl ?? undefined}
                onPick={handlePickImage}
                canDelete={!!profileImageUrl}
                onClickDelete={() => setShowDeleteModal(true)}
            />
            <NicknameField
                value={nickname}
                onChange={(v) => {
                    setNickname(v);
                }}
                showLabel
                variant="profile"
            />
            <IntroField value={bio} onChange={setBio} max={introMax} />

            <OpuActionButton
                label="저장"
                disabled={!canSubmit}
                loading={saving}
                onClick={handleSave}
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                message={`프로필 사진을 삭제할까요?\n삭제하면 기본 이미지로 변경됩니다.`}
                onConfirm={() => {
                    handleDeleteImage();
                    setShowDeleteModal(false);
                }}
                onCancel={() => setShowDeleteModal(false)}
            />
        </section>
    );
}
