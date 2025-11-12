"use client";

import Menu from "@/components/layout/Menu";
import { toastSuccess, toastError, toastWarn } from "@/lib/toast";

export default function ToastTest() {
    return (
        <div className="app-page">
            <div className="app-container pt-app-header pb-40">
                <h1 className="text-page-title mb-4">Toast Test</h1>

                <div className="flex flex-col items-center gap-3">
                    <button
                        onClick={() =>
                            toastSuccess("이메일이 재전송 되었습니다.")
                        }
                        className="px-4 py-2 rounded-xl bg-[var(--color-opu-green)] text-white font-semibold"
                    >
                        성공 토스트
                    </button>

                    <button
                        onClick={() =>
                            toastWarn("저장하지 않은 변경사항이 있어요.")
                        }
                        className="px-4 py-2 rounded-xl bg-[#f5a524] text-white font-semibold"
                    >
                        경고 토스트
                    </button>

                    <button
                        onClick={() =>
                            toastError(
                                "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
                            )
                        }
                        className="px-4 py-2 rounded-xl bg-[#e54848] text-white font-semibold"
                    >
                        에러 토스트
                    </button>
                </div>
            </div>
            <Menu />
        </div>
    );
}
