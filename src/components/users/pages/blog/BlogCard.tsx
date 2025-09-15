"use client";

import React from "react";
import Image from "next/image";
import {motion} from "framer-motion";

type BlogCardProps = {
  title: string;
  category: string;
  image: string;
};

const BlogCard = ({ title, category, image }: BlogCardProps) => {
    return (
        <motion.div
            initial={{opacity: 0, x: -50}}
            whileInView={{opacity: 1, x: 0}}
            transition={{duration: 0.5}}
            viewport={{once: true}}
            className="w-full h-[300px] max-w-8xl transform transition duration-300 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer rounded-t-2xl"
        >
            <div className="overflow-hidden rounded-xl space-y-4">
                <Image
                    src={image}
                    alt={title}
                    width={100}
                    height={48}
                    className="w-full h-48 object-cover"
                />
                <div className="px-2">
                    <p className="text-xs text-blue-500 uppercase">
                        {category}
                    </p>
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>
            </div>
        </motion.div>
    );
};

export default BlogCard;
