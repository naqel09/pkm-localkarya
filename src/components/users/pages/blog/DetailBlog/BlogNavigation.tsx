import React from "react";
import Link from "next/link";
import {ChevronLeft, ChevronRight} from "lucide-react";

type Props = {
    prevSlug?: string;
    nextSlug?: string;
};

const BlogNavigation = ({prevSlug, nextSlug}: Props) => {
    return (
        <div className="flex justify-between items-center mt-16">
            {/* Previous Article */}
            {prevSlug ? (
                <Link
                    href={`/Blog/${prevSlug}`}
                    className="text-blue-900 flex items-center hover:underline"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous Article
                </Link>
            ) : (
                <div />
            )}

            {/* Next Article */}
            {nextSlug ? (
                <Link
                    href={`/Blog/${nextSlug}`}
                    className="text-blue-900 flex items-center hover:underline"
                >
                    Next Article
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            ) : (
                <div />
            )}
        </div>
    );
};

export default BlogNavigation;
