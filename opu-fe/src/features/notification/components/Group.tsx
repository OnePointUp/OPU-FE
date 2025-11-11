"use client";

type Props = {
    title: string;
    children: React.ReactNode;
};

export default function Group({ title, children }: Props) {
    return (
        <section className="w-full">
            <div className="px-2 mt-5 mb-1">
                <h3
                    className="text-[var(--color-dark-navy)]"
                    style={{
                        fontWeight: "var(--weight-semibold)",
                        fontSize: "12px",
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
