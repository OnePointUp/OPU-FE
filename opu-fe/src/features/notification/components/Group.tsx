"use client";

type Props = {
    title: string;
    children: React.ReactNode;
};

export default function Group({ title, children }: Props) {
    return (
        <section className="w-full">
            <div className="px-4 mt-5 mb-1">
                <h3
                    className="text-[var(--color-dark-navy)]"
                    style={{
                        fontWeight: "var(--weight-semibold)",
                        fontSize: "var(--text-sub)",
                    }}
                >
                    {title}
                </h3>
            </div>
            <div>{children}</div>
            <div className="h-[1px] bg-[var(--color-super-light-gray)] my-1" />
        </section>
    );
}
