'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type PlusButtonProps = {
    showMenu: boolean;
    onAddEvent?: () => void;
};

export default function PlusButton({ showMenu, onAddEvent }: PlusButtonProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const [portalTarget, setPortalTarget] = useState<Element | null>(null);

    // 브라우저에서만 document.body 설정
    useEffect(() => {
        setPortalTarget(document.body);
    }, []);

    const toggleMenu = () => setIsOpen(prev => !prev);
    const closeMenu = () => setIsOpen(false);

    const handleDefaultAdd = () => router.push("/opu/register");

    const runAddEvent = () => onAddEvent ? onAddEvent() : handleDefaultAdd();

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
                runAddEvent();
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
                router.push("/opu")
                closeMenu();
            }
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
            }
        }
    ];

    // 아직 portalTarget이 없으면 렌더하지 않음
    if (!portalTarget) return null;

    return createPortal(
        <>
            {/* 기존 overlay */}
            {showMenu && (
                <div
                    className={clsx(
                        "plus-menu__overlay",
                        isOpen && "plus-menu__overlay--visible"
                    )}
                    onClick={closeMenu}
                />
            )}

            {/* 기존 container */}
            <div className="plus-button__container">

                {/* 메뉴 */}
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
                    onClick={showMenu ? toggleMenu : () => router.push("/opu/register")}
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
        </>,
        portalTarget
    );
}
