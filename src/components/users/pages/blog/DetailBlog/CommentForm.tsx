"use client";

import React, {useState} from "react";

const CommentForm = () => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    return (
        <section className="max-w-8xl mx-auto mt-20 px-6">
            <h2 className="text-xl font-bold mb-6 text-white">
                WRITE A COMMENT
            </h2>
            <form className="bg-black rounded-xl p-6 space-y-6 text-white">
                {/* Name and Email */}
                <div className=" gap-4">
                    <div>
                        <label className="block text-sm mb-2">NAME</label>
                        <input
                            type="text"
                            placeholder="Amelia Watson"
                            className="w-full rounded-md px-2 py-2 text-black bg-white"
                        />
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm mb-2">COMMENT</label>
                    <textarea
                        placeholder="Write your message ..."
                        rows={5}
                        className="w-full rounded-md px-4 py-2 text-black bg-white"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer"
                    >
                        SUBMIT COMMENT
                    </button>
                </div>
            </form>
        </section>
    );
};

export default CommentForm;
