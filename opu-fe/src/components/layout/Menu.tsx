"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const TABS = [
    { href: "/", label: "홈", icon: "ic:baseline-home" },
    { href: "/calendar", label: "캘린더", icon: "ic:baseline-calendar-today" },
    { href: "/opu", label: "OPU", icon: "lucide:rabbit" },
    { href: "/stats", label: "통계", icon: "akar-icons:statistic-up" },
    { href: "/me", label: "마이", icon: "ic:baseline-person" },
];

export default function Menu() {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <nav className="menu-bar">
            <ul className="menu-bar__list">
                {TABS.map((m) => {
                    const active = isActive(m.href);
                    return (
                        <li key={m.href}>
                            <Link
                                href={m.href}
                                className={`menu-bar__item ${
                                    active ? "is-active" : ""
                                }`}
                            >
                                <Icon
                                    className="menu-bar__icon"
                                    icon={m.icon}
                                    width={24}
                                    height={24}
                                />
                                <span className="menu-bar__label">
                                    {m.label}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
