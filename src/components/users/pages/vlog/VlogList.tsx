"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import VlogCard from "./VlogCard";

interface Vlog {
    id: number;
    judulVideo: string;
    deskripsiVideo: string;
    linkYoutube: string;
    createdAt: string;
    updatedAt: string;
}

const VlogList = () => {
    const [vlogs, setVlogs] = useState<Vlog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter vlogs based on search term
    const filteredVlogs = useMemo(() => {
        if (!searchTerm) return vlogs;
        return vlogs.filter(vlog =>
            vlog.judulVideo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vlog.deskripsiVideo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [vlogs, searchTerm]);

    useEffect(() => {
        async function fetchVlogs() {
            try {
                const response = await fetch('/api/vlog');
                if (!response.ok) {
                    throw new Error('Failed to fetch vlogs');
                }
                const data = await response.json();
                setVlogs(data.data || []);
            } catch (error) {
                console.error('Error fetching vlogs:', error);
                setError('Gagal memuat video');
            } finally {
                setLoading(false);
            }
        }

        fetchVlogs();
    }, []);

    // Function to extract YouTube video ID
    const getYouTubeVideoId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : null;
    };

    // Function to get YouTube thumbnail
    const getYouTubeThumbnail = (url: string) => {
        const videoId = getYouTubeVideoId(url);
        return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    };

    // Function to get YouTube embed URL
    const getYouTubeEmbedUrl = (url: string) => {
        const videoId = getYouTubeVideoId(url);
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

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

    if (vlogs.length === 0) {
        return (
            <section className="px-6 py-12 max-w-8xl mx-auto text-center">
                <p className="text-gray-600 text-lg">Belum ada video yang tersedia.</p>
            </section>
        );
    }

    return (
        <section className="px-6 py-12 max-w-8xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
                <motion.h2 
                    className="text-3xl font-bold text-gray-800 mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Video Wisata Terkini
                </motion.h2>
                <motion.p 
                    className="text-gray-600 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Jelajahi keindahan destinasi wisata melalui video-video menarik dari berbagai tempat
                </motion.p>
            </div>

            {/* Search Bar */}
            <motion.div 
                className="max-w-md mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari video berdasarkan judul atau deskripsi..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Results Count */}
            {searchTerm && (
                <motion.div 
                    className="text-center mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <p className="text-gray-600">
                        Ditemukan {filteredVlogs.length} video untuk pencarian &quot;{searchTerm}&quot;
                    </p>
                </motion.div>
            )}

            {/* Vlog Grid */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                {filteredVlogs.length > 0 ? (
                    filteredVlogs.map((vlog, index) => (
                        <motion.div
                            key={vlog.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                        >
                            <VlogCard
                                id={vlog.id}
                                title={vlog.judulVideo}
                                description={vlog.deskripsiVideo}
                                videoUrl={vlog.linkYoutube}
                                thumbnail={getYouTubeThumbnail(vlog.linkYoutube)}
                                embedUrl={getYouTubeEmbedUrl(vlog.linkYoutube)}
                                createdAt={vlog.createdAt}
                            />
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-600 text-lg">
                            {searchTerm 
                                ? `Tidak ada video yang ditemukan untuk pencarian &quot;${searchTerm}&quot;`
                                : "Belum ada video yang tersedia."
                            }
                        </p>
                    </div>
                )}
            </motion.div>
        </section>
    );
};

export default VlogList;