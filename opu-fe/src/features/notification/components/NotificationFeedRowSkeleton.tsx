"use client";

export default function NotificationFeedRowSkeleton() {
    return (
        <li
            className="flex gap-4 px-2 mt-8"
            style={{
                background: "var(--color-background)",
            }}
        >
            {/* 아이콘 스켈레톤 */}
            <div className="skeleton flex w-12 h-12 mt-4 rounded-full" />

            <div className="flex flex-1 flex-col gap-2 mt-1">
                {/* 제목 */}
                <div
                    className="skeleton rounded-md"
                    style={{
                        width: "70%",
                        height: "14px",
                    }}
                />

                {/* 메시지 1 */}
                <div
                    className="skeleton rounded-md"
                    style={{
                        width: "100%",
                        height: "12px",
                    }}
                />

                {/* 메시지 2 */}
                <div
                    className="skeleton rounded-md"
                    style={{
                        width: "60%",
                        height: "12px",
                    }}
                />

                {/* 시간 */}
                <div
                    className="skeleton rounded-md mt-1"
                    style={{
                        width: "40px",
                        height: "10px",
                    }}
                />
            </div>
        </li>
    );
}
