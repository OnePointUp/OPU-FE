'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import clsx from "clsx";

type PlusButtonProps = {
    showMenu: boolean; // ← true면 메뉴 열림, false면 바로 생성
};

export default function PlusButton({ showMenu }: PlusButtonProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(prev => !prev);
    const closeMenu = () => setIsOpen(false);

    // 메뉴 모드일 때만 사용됨
    const menuItems = [
        {
            label: "직접 생성",
            icon: (
                <Icon
                    icon="pajamas:todo-done"
                    width={28}
                    height={28}
                    className="text-white"
                />
            ),
            bgColor: "var(--color-opu-green)",
            onClick: () => {
                router.push("/opu/register"); // ← 하드코딩된 이동
                closeMenu();
            }
        },
        {
            label: "OPU에서 추가",
            icon: (
                <Icon
                    icon="mdi:bulletin-board"
                    width={30}
                    height={30}
                    style={{ color: "var(--color-dark-yellow)" }}
                />
            ),
            bgColor: "var(--color-light-yellow)",
            onClick: () => {
                alert("OPU에서 추가 클릭");
                closeMenu();
            },
        },
        {
            label: "랜덤 OPU 뽑기",
            icon: (
                <Icon
                    icon="lucide:rabbit"
                    width={30}
                    height={30}
                    className="text-white"
                />
            ),
            bgColor: "var(--color-light-pink)",
            onClick: () => {
                alert("랜덤 OPU 뽑기 클릭");
                closeMenu();
            },
        },
    ];

    return (
        <>
            {/* 오버레이 — 메뉴 모드에서만 동작 */}
            {showMenu && (
                <div
                    className={clsx(
                        "plus-menu__overlay",
                        isOpen && "plus-menu__overlay--visible"
                    )}
                    onClick={closeMenu}
                />
            )}

            <div className="plus-button__container">

                {/* 메뉴 (showMenu=true 일 때만 렌더링) */}
                {showMenu && (
                    <div
                        className={clsx(
                            "plus-menu",
                            isOpen ? "plus-menu--open" : "plus-menu--closed"
                        )}
                    >
                        {menuItems.map((item, index) => (
                            <div key={index} className="plus-menu__item-wrapper">
                                <span className="plus-menu__label">{item.label}</span>
                                <button
                                    onClick={item.onClick}
                                    className="plus-menu__item"
                                    style={{ backgroundColor: item.bgColor }}
                                >
                                    {item.icon}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* 플러스 버튼 */}
                <button
                    onClick={
                        showMenu
                            ? toggleMenu
                            : () => router.push("/opu/register") // ← 메뉴 OFF일 때 바로 이동
                    }
                    className={clsx(
                        "plus-button",
                        showMenu && isOpen && "plus-button--rotated"
                    )}
                    style={{ backgroundColor: "var(--color-opu-pink)" }}
                >
                    <Icon
                        icon="mdi:plus"
                        width={32}
                        height={32}
                        className="plus-button__icon"
                        style={{ color: "#FFFFFF" }}
                    />
                </button>
            </div>
        </>
    );
}
