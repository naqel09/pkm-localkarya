"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Calendar, Youtube } from "lucide-react";

type VlogCardProps = {
    id: number;
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string | null;
    embedUrl: string | null;
    createdAt: string;
};

const VlogCard = ({ 
    id,
    title, 
    description, 
    thumbnail, 
    createdAt 
}: VlogCardProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <Link href={`/Vlog/${id}`}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <Youtube className="h-12 w-12 text-gray-500" />
                        </div>
                    )}
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-red-600 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                            <Play className="h-8 w-8 text-white fill-current" />
                        </div>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(createdAt)}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300">
                        {truncateText(title, 60)}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {truncateText(description, 120)}
                    </p>
                    
                    {/* Watch Button */}
                    <div className="flex items-center text-red-600 font-semibold text-sm group-hover:text-red-700 transition-colors duration-300">
                        <Play className="h-4 w-4 mr-2" />
                        Tonton Video
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default VlogCard;