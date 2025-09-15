import React from "react";
import BlogCard from "./BlogCard";
import { blogs } from "@/data/blogs";
import Link from "next/link";

const BlogList = () => {
    return (
        <section className="px-6 py-12 max-w-8xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {blogs.map((blog, index) => (
                    <Link key={index} href={`/Blog/${blog.slug}`}>
                        <BlogCard
                        
                        image={blog.sections[0].image}
                        category={blog.category}
                        title={blog.title}
                    />
                    </Link>
                    
                ))}
            </div>
        </section>
    );
};

export default BlogList;
