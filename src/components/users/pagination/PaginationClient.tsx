"use client";

import React, {useState} from "react";
import Pagination from "./Pagination";

export default function PaginationClient() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    return (
        <div>   
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
}
