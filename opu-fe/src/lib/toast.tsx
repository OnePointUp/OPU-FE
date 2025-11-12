"use client";

import { toast } from "react-hot-toast";
import ToastCard from "@/components/toast/ToastCard";
import { JSX } from "react";

const baseOption = {
    position: "bottom-center" as const,
    duration: 5000,
};

function showSingleToast(element: JSX.Element) {
    toast.dismiss();
    toast.custom(element, baseOption);
}

export const toastSuccess = (msg: string) =>
    showSingleToast(<ToastCard message={msg} variant="success" />);

export const toastError = (msg: string) =>
    showSingleToast(<ToastCard message={msg} variant="error" />);

export const toastWarn = (msg: string) =>
    showSingleToast(<ToastCard message={msg} variant="warn" />);
