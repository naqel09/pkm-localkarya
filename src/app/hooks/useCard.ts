"use client";
import { useState } from "react";

export default function useCard(totalItems: number, initialIndex = 1) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isFading, setIsFading] = useState(false);

    const next = () => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % totalItems);
            setIsFading(false);
        }, 300);
    };

    const prev = () => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
            setIsFading(false);
        }, 300);
    };

    const jumpTo = (index: number) => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsFading(false);
        }, 300);
    };

    const getItemIndex = (offset: number) => 
        (currentIndex + offset + totalItems) % totalItems;

    return {
        currentIndex,
        isFading,
        next,
        prev,
        jumpTo,
        getItemIndex,
    };
}