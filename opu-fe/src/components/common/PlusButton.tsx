"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import clsx from "clsx";

export default function PlusButton() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);

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
                alert("직접 생성 클릭");
                closeMenu();
            },
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
            {/* 어두운 오버레이 */}
            <div
                className={clsx(
                    "plus-menu__overlay",
                    isOpen && "plus-menu__overlay--visible"
                )}
                onClick={closeMenu}
            />

            {/* 화면 하단 고정 + app-max 안에서 정렬 */}
            <div className="plus-button__container">
                {/* 메뉴 */}
                <div
                    className={clsx(
                        "plus-menu",
                        isOpen ? "plus-menu--open" : "plus-menu--closed"
                    )}
                >
                    {menuItems.map((item, index) => (
                        <div key={index} className="plus-menu__item-wrapper">
                            <span className="plus-menu__label">
                                {item.label}
                            </span>
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

                {/* 플러스 버튼 */}
                <button
                    onClick={toggleMenu}
                    className={clsx(
                        "plus-button",
                        isOpen && "plus-button--rotated"
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
