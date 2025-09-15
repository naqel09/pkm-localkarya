"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

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
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2,"...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-3 py-6">
      {/* Previous Button */}
      <button
        className={`${
          currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-blue-500 hover:text-blue-700"
        }`}
        onClick={handlePrev}
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
              isCurrent
                ? "text-black"
                : isEllipsis
                ? "text-gray-300 cursor-default"
                : "text-gray-400 hover:text-blue-500"
            }`}
            disabled={isEllipsis}
          >
            {String(page).padStart(2, "0")}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        className={`${
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-blue-500 hover:text-blue-700"
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
