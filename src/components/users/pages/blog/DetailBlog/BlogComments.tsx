import React from "react";
import Image from "next/image";

const comments = [
    {
        avatar: "/images/testimonials.jpg",
        name: "Jessica Laurens",
        date: "December 3, 2025",
        text: "This article is fantastic! As someone who loves exploring the outdoors, I'm always on the lookout for new national parks to add to my bucket list. Thanks for the inspiration!",
    },
    {
        avatar: "/images/testimonials.jpg",
        name: "Jack Smith",
        date: "November 10, 2025",
        text: "I've been lucky enough to visit a few of the national parks on this list, and I can vouch for their incredible beauty and unique experiences. I highly recommend visiting Yellowstone and Banff – they are truly unforgettable destinations!",
    },
];

const BlogComments = () => {
    return (
        <section className="max-w-screen mx-auto mt-20 px-6">
            <h2 className="text-2xl font-bold mb-8">COMMENTS</h2>
            <div className="space-y-6">
                {comments.map((comment, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-md p-6 flex flex-col space-y-4"
                    >
                        <p className="text-gray-700 leading-relaxed">
                            “{comment.text}”
                        </p>
                        <div className="flex items-center space-x-4">
                            <Image
                                src={comment.avatar}
                                alt={comment.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {comment.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {comment.date}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BlogComments;
