"use client";

type Props = {
    title: string;
    children: React.ReactNode;
};

export default function Group({ title, children }: Props) {
    return (
        <section className="w-full">
            <div className="mt-4 mb-1">
                <h3
                    style={{
                        fontWeight: "var(--weight-semibold)",
                        fontSize: "var(--text-sub)",
                        color: "var(--color-dark-navy)]",
                    }}
                >
                    {title}
                </h3>
            </div>
            <div>{children}</div>
            <div className="h-[1px] bg-[var(--color-super-light-gray)] -mx-6 mt-2" />
        </section>
    );
}
