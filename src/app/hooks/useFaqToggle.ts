"use client";

import { useState } from "react";

export function useFaqToggle() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleIndex = (index: number) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };

    return { activeIndex, toggleIndex };
}
