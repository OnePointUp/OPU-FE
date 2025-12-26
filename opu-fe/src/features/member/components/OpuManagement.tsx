import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

type OpuSummaryProps = {
    likedCount: number;
    myCount: number;
    loading: boolean;
};

export default function OpuManagement({
    likedCount,
    myCount,
    loading = false,
}: OpuSummaryProps) {
    const router = useRouter();

    const cards = [
        {
            label: "찜한 OPU",
            count: likedCount,
            icon: "fluent-emoji-flat:pink-heart",
            onClick: () => router.push("/opu/liked"),
        },
        {
            label: "내 OPU",
            count: myCount,
            icon: "flat-color-icons:folder",
            iconColor: "#facc15",
            onClick: () => router.push("/opu/my"),
        },
    ];

    if (loading) {
        return (
            <div className="flex border border-[var(--color-super-light-gray)] rounded-xl overflow-hidden relative">
                {/* 첫 번째 스켈레톤 버튼 */}
                <div className="flex-1 flex items-center justify-between px-5 py-4 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="skeleton w-[22px] h-[22px] rounded" />
                        <div className="skeleton w-16 h-4 rounded" />
                    </div>
                    <div className="skeleton w-6 h-6 rounded" />
                </div>

                {/* 세로선 */}
                <div className="w-px h-[60%] bg-gray-200 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />

                {/* 두 번째 스켈레톤 버튼 */}
                <div className="flex-1 flex items-center justify-between px-5 py-4 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="skeleton w-[22px] h-[22px] rounded" />
                        <div className="skeleton w-16 h-4 rounded" />
                    </div>
                    <div className="skeleton w-6 h-6 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex border border-[var(--color-super-light-gray)] rounded-xl overflow-hidden relative">
            {/* 첫 번째 버튼 */}
            <button
                onClick={cards[0].onClick}
                className="flex-1 flex items-center justify-between px-6 py-4 bg-gray-50 transition cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <Icon icon={cards[0].icon} width={22} height={22} />
                    <span
                        style={{
                            fontWeight: "var(--weight-semibold)",
                            fontSize: "var(--text-sub)",
                        }}
                    >
                        {cards[0].label}
                    </span>
                </div>
                <span
                    style={{
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-medium)",
                        color: "var(--color-dark-gray)",
                    }}
                >
                    {cards[0].count}
                </span>
            </button>

            {/* 세로선 */}
            <div className="w-px h-[60%] bg-gray-200 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />

            {/* 두 번째 버튼 */}
            <button
                onClick={cards[1].onClick}
                className="flex-1 flex items-center justify-between px-6 py-4 bg-gray-50 transition cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <Icon icon={cards[1].icon} width={22} height={22} />
                    <span
                        style={{
                            fontWeight: "var(--weight-semibold)",
                            fontSize: "var(--text-sub)",
                        }}
                    >
                        {cards[1].label}
                    </span>
                </div>
                <span
                    style={{
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-medium)",
                        color: "var(--color-dark-gray)",
                    }}
                >
                    {cards[1].count}
                </span>
            </button>
        </div>
    );
}
