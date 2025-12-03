"use client";

import { useState, useCallback } from "react";

export function useProfileImagePicker(initialUrl = "") {
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
        initialUrl
    );
    const [file, setFile] = useState<File | null>(null);

    // 사진 선택: 파일 저장 + 미리보기 URL 생성
    const handlePickImage = useCallback((f: File) => {
        setFile(f);
        setProfileImageUrl(URL.createObjectURL(f));
    }, []);

    return {
        profileImageUrl,
        file,
        handlePickImage,
        setProfileImageUrl,
        setFile,
    };
}
