"use client";

import { createPortal } from "react-dom";

type Props = {
    open: boolean;
    permission: NotificationPermission;
    onClose: () => void;
    onAccept: () => void;
    onLater: () => void;
};

export default function WebPushModal({
    open,
    permission,
    onClose,
    onAccept,
    onLater,
}: Props) {
    if (!open) return null;
    if (typeof window === "undefined") return null;

    const denied = permission === "denied";

    return createPortal(
        <div className="fixed inset-0 z-[2147483647] isolate mix-blend-normal">
            <div
                className="absolute inset-0 bg-[var(--color-modal-bg)] mix-blend-normal"
                onClick={onClose}
            />
            <div className="fixed left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white px-6 py-5 shadow-xl mix-blend-normal">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🔔</span>
                        <div
                            className="text-lg"
                            style={{ fontWeight: "var(--weight-semibold)" }}
                        >
                            푸시 알림 받기
                        </div>
                    </div>
                    <button
                        type="button"
                        className="text-[var(--color-dark-gray)] cursor-pointer"
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        ✕
                    </button>
                </div>

                <p className="mt-3 text-sm text-[var(--color-dark-gray)] leading-5">
                    {denied ? (
                        <>
                            브라우저 알림이 차단되어 있어요
                            <br />
                            브라우저 설정에서 알림을 허용해 주세요
                        </>
                    ) : (
                        <>
                            OPU 푸시 알림을 켜고
                            <br />
                            하루의 루틴을 놓치지 마세요 🌱
                        </>
                    )}
                </p>

                <button
                    type="button"
                    onClick={onAccept}
                    className="mt-5 w-full rounded-full bg-black py-3 text-sm text-white cursor-pointer"
                    style={{ fontWeight: "var(--weight-semibold)" }}
                >
                    {denied ? "확인" : "알림 받기"}
                </button>

                <button
                    type="button"
                    onClick={onLater}
                    className="underline mt-3 w-full text-center text-[length:var(--text-caption)] text-[var(--color-dark-gray)] cursor-pointer"
                >
                    나중에 받을게요.
                </button>
            </div>
        </div>,
        document.body
    );
}
