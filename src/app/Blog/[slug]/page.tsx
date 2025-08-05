import React from "react";
import {notFound} from "next/navigation";
import Image from "next/image";
import {blogs} from "@/data/blogs";
import BlogSidebar from "@/components/pages/blog/DetailBlog/BlogSidebar";
import TourHeader from "@/components/TourHeader";
import ButtonNavigasi from "@/components/pages/blog/DetailBlog/BlogNavigation";
import BlogComments from "@/components/pages/blog/DetailBlog/BlogComments";
import CommentForm from "@/components/pages/blog/DetailBlog/CommentForm";

type Props = {
    params: {
        slug: string;
    };
};

const BlogPage = ({params}: Props) => {
    const blog = blogs.find((b) => b.slug === params.slug);
    const index = blogs.findIndex((b) => b.slug === params.slug);
    const navigation = blogs[index];

    if (!blog) return notFound();

    return (
        <>
            <TourHeader
                title="Artikel"
                halaman="Home"
                bagian="Blog | Berita"
                image="/bedroom.jpg"
            />
            <section className="max-w-8xl mx-auto px-4 mt-5 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="md:col-span-1">
                    <BlogSidebar />
                </aside>

                {/* Content */}
                <article className="md:col-span-3 space-y-6">
                    <h3 className="text-center text-blue-700 font-bold text-5xl mb-10">{blog.title}</h3>
                    {blog.sections.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h1 className="text-3xl font-bold">
                                <span className="text-blue-500">{section.berita}. </span>
                                {section.subtitle}
                            </h1>
                            <Image
                                src={section.image}
                                alt={`Section ${index + 1}`}
                                width={800}
                                height={500}
                                className="rounded-xl w-full h-[500PX] object-cover"
                            />
                            <p className="text-gray-700 leading-relaxed">
                                {section.description}
                            </p>
                        </div>
                    ))}
                    <ButtonNavigasi
                        prevSlug={blogs[index - 1]?.slug}
                        nextSlug={blogs[index + 1]?.slug}
                    />
                    <BlogComments />
                    <CommentForm/>
                </article>
            </section>
        </>
    );
};

export default BlogPage;
