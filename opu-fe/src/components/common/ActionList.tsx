"use client";

export type ActionItem = {
    label: string;
    danger?: boolean;
    primary?: boolean;
    onClick?: () => void;
};

export default function ActionList({ items }: { items: ActionItem[] }) {
    return (
        <ul className="py-1">
            {items.map((it, i) => (
                <li key={it.label}>
                    <button
                        type="button"
                        onClick={it.onClick}
                        className={`
              w-full px-4 py-4 text-center text-[15px] cursor-pointer
              ${i !== 0 ? "border-t border-zinc-100" : ""}
              ${
                  it.danger
                      ? "text-rose-500 font-medium"
                      : it.primary
                      ? "text-blue-600"
                      : "text-zinc-800"
              }
            `}
                    >
                        {it.label}
                    </button>
                </li>
            ))}
        </ul>
    );
}
