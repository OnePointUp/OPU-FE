export default function OpuCardSkekleton() {
    return (
        <div
            className="w-full rounded-xl bg-[var(--background)] border px-3 pt-3 pb-2"
            style={{ borderColor: "var(--color-super-light-gray)" }}
        >
            <div className="flex flex-col gap-3">
                <div className="flex w-full justify-between">
                    <div
                        className="rounded-2xl skeleton"
                        style={{ width: 35, height: 35 }}
                    />
                    <div className="h-5 w-5 rounded-full skeleton" />
                </div>
                <div className="flex flex-col gap-1 mb-2">
                    <div className="h-4 w-24 rounded-md skeleton" />
                    <div className="flex gap-0.5">
                        <div className="h-4 w-8 rounded-md skeleton" />
                        <div className="h-4 w-8 rounded-md skeleton" />
                    </div>
                </div>
            </div>
            <div className="h-3 w-36 rounded-md skeleton mt-1" />
            <div className="h-3 w-24 rounded-md skeleton mt-1" />

            <div className="flex items-end justify-between mt-2">
                <div className="h-3 w-18 rounded-md skeleton" />
                <div className="h-3 w-12 rounded-md skeleton" />
            </div>
        </div>
    );
}
