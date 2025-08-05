import BlogList from "@/components/pages/blog/BlogList";
import PaginationClient from "@/components/pagination/PaginationClient";
import TourHeader from "@/components/TourHeader";
import React from "react";

const page = () => {
    return (
        <>
            <TourHeader
                title="ARTIKEL"
                halaman="Home"
                bagian="Blog"
                image="/images/artikel/headerblog.jpg"
            />
            <BlogList />
            <PaginationClient/>
        </>
    );
};

export default page;
