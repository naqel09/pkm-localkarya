"use client";
import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import Link from "next/link";

interface Artikel {
    id: number;
    judul: string;
    tanggalPembuatan: string;
    gambar: string;
    isiArtikel: string;
    penulis: string;
}

const BlogList = () => {
    const [articles, setArticles] = useState<Artikel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const response = await fetch('/api/blog');
                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }
                const data = await response.json();
                setArticles(data.data || []);
            } catch (error) {
                console.error('Error fetching articles:', error);
                setError('Gagal memuat artikel');
            } finally {
                setLoading(false);
            }
        }

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <section className="px-6 py-12 max-w-8xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                            <div className="bg-gray-300 h-4 rounded mb-2"></div>
                            <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="px-6 py-12 max-w-8xl mx-auto text-center">
                <p className="text-red-600 text-lg">{error}</p>
            </section>
        );
    }

    if (articles.length === 0) {
        return (
            <section className="px-6 py-12 max-w-8xl mx-auto text-center">
                <p className="text-gray-600 text-lg">Belum ada artikel yang tersedia.</p>
            </section>
        );
    }

    return (
        <section className="px-6 py-12 max-w-8xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {articles.map((article) => (
                    <Link key={article.id} href={`/Blog/${article.id}`}>
                        <BlogCard
                            image={article.gambar ? `/uploads/${article.gambar}` : '/images/default-article.jpg'}
                            category={article.penulis}
                            title={article.judul}
                        />
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default BlogList;
