"use client";
import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import BlogSidebar from "@/components/users/pages/blog/DetailBlog/BlogSidebar";
import TourHeader from "@/components/TourHeader";
import HTMLRenderer from "@/components/HTMLRenderer";

interface Artikel {
    id: number;
    judul: string;
    tanggalPembuatan: string;
    gambar: string;
    isiArtikel: string;
    penulis: string;
}

type Props = {
    params: {
        slug: string;
    };
};

const BlogPage = ({ params }: Props) => {
    const [article, setArticle] = useState<Artikel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchArticle() {
            try {
                const response = await fetch(`/api/blog/${params.slug}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Artikel tidak ditemukan');
                        return;
                    }
                    throw new Error('Failed to fetch article');
                }
                const data = await response.json();
                setArticle(data.data);
            } catch (error) {
                console.error('Error fetching article:', error);
                setError('Gagal memuat artikel');
            } finally {
                setLoading(false);
            }
        }

        if (params.slug) {
            fetchArticle();
        }
    }, [params.slug]);

    if (loading) {
        return (
            <>
                <TourHeader
                    title="Artikel"
                    halaman="Home"
                    bagian="Berita"
                    image="/images/artikel/headerblog.jpg"
                />
                <section className="max-w-8xl mx-auto px-4 mt-5 py-12">
                    <div className="animate-pulse">
                        <div className="bg-gray-300 h-12 rounded mb-6"></div>
                        <div className="bg-gray-300 h-64 rounded mb-6"></div>
                        <div className="space-y-4">
                            <div className="bg-gray-300 h-4 rounded"></div>
                            <div className="bg-gray-300 h-4 rounded"></div>
                            <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    if (error || !article) {
        return notFound();
    }

    return (
        <>
            <TourHeader
                title="Artikel"
                halaman="Kisah"
                bagian="Cerita"
                image="/images/artikel/headerblog.jpg"
            />
            <section className="max-w-8xl mx-auto px-4 mt-5 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="md:col-span-1">
                    <BlogSidebar />
                </aside>

                {/* Content */}
                <article className="md:col-span-3 space-y-6">
                    <div className="text-center mb-8">
                        <h1 className="text-blue-700 font-bold text-3xl md:text-5xl mb-4">
                            {article.judul}
                        </h1>
                        <div className="text-gray-600 space-y-2">
                            <p>Oleh: <span className="font-semibold">{article.penulis}</span></p>
                            <p>{new Date(article.tanggalPembuatan).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>
                    </div>

                    {article.gambar && (
                        <div className="mb-8">
                            <Image
                                src={`/uploads/${article.gambar}`}
                                alt={article.judul}
                                width={800}
                                height={500}
                                className="rounded-xl w-full h-[500px] object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none">
                        <HTMLRenderer content={article.isiArtikel} />
                    </div>
                </article>
            </section>
        </>
    );
};

export default BlogPage;
