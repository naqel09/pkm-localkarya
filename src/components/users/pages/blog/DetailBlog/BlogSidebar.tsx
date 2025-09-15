"use client"
import React from "react";
import Image from "next/image";
import { popularposts } from "@/data/popularposts";

const tags = [
    "Travel",
    "Adventure",
    "Food",
    "Destination",
    "Tips & Trick",
    "Culture & History",
    "Inspiration",
];


const BlogSidebar = () => {
    return (
        <div className="space-y-10">
            {/* Search */}
            <div>
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full md:mt-20 px-4 py-2 border border-gray-300 rounded-full"
                />
            </div>

            {/* Tags */}
            <div>
                <h3 className="font-bold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Popular */}
            <div>
                <h3 className="font-bold mb-4">Popular</h3>
                <div className="space-y-4">
                    {popularposts.map((post, i) => (
                        <div key={i} className="gap-4">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="rounded-md object-cover w-full h-[200px]"
                            />
                            <div>
                                <p className="text-xs text-blue-500 font-semibold uppercase">
                                    {post.category}
                                </p>
                                <p className="text-sm font-medium">
                                    {post.title}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {post.date}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogSidebar;
