"use client"
import React,{useState} from "react";

function FormNewsletter() {
    return (
        <form className="flex items-center justify-center gap-4">
            <input
                type="email"
                placeholder="Enter your email address here ..."
                className="px-4 py-3 w-full sm:w-[400px] border-b-2 border-black outline-none focus:border-black bg-transparent placeholder-black text-sm"
            />
            <button
                type="submit"
                className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition cursor-pointer"
            >
                Subscribe
            </button>
        </form>
    );
}

export default FormNewsletter;
