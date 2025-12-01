"use client";

import { useState, useCallback } from "react";

export function useProfileImagePicker(initialUrl = "") {
    const [profileImageUrl, setProfileImgUrl] = useState(initialUrl);
    const [file, setFile] = useState<File | null>(null);

    // 사진 선택: 파일 저장 + 미리보기 URL 생성
    const handlePickImage = useCallback((f: File) => {
        setFile(f);
        setProfileImgUrl(URL.createObjectURL(f));
    }, []);

    return {
        profileImageUrl,
        file,
        handlePickImage,
        setProfileImgUrl,
        setFile,
    };
}
