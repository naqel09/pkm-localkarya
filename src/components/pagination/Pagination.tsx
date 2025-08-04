"use client";

import React from "react";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/24/solid";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const pageNumbers = [1, 2, 3, "...", totalPages];

    return (
        <div className="flex items-center justify-center gap-3 py-6">
            {/* Previous Button */}
            <button
                className={`text-gray-300 ${
                    currentPage === 1
                        ? "cursor-not-allowed"
                        : "hover:text-black"
                }`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeftIcon className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((page, index) => {
                const isCurrent = page === currentPage;
                const isEllipsis = page === "...";

                return (
                    <button
                        key={index}
                        onClick={() =>
                            typeof page === "number" && onPageChange(page)
                        }
                        className={`text-sm font-bold ${
                            isCurrent ? "text-black" : "text-gray-300"
                        } ${!isEllipsis && "hover:text-black"} cursor-pointer`}
                        disabled={isEllipsis}
                    >
                        {String(page).padStart(2, "0")}
                    </button>
                );
            })}

            {/* Next Button */}
            <button
                className={`text-blue-400 ${
                    currentPage === totalPages
                        ? "cursor-not-allowed"
                        : "hover:text-blue-600"
                }`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRightIcon className="w-4 h-4" />
            </button>
        </div>
    );
}
