"use client";
import React,{useState} from "react";
import Link from "next/link";
import {Smile, Mountain, Flag, RefreshCw} from "lucide-react";

const features = [
    {
        icon: <Smile size={40} className=" mb-4" />,
        title: "Customer Delight",
        description:
            "We deliver the best service and experience for our dear customer.",
        href:"/customer-delight"
    },
    {
        icon: <Mountain size={40} className=" mb-4" />,
        title: "Authentic Adventure",
        description:
            "We deliver the real adventure experience for our dear customer.",
        href:"/authentic-adventure"
    },
    {
        icon: (
                <Flag size={40} className=" mb-4" />
        ),
        title: "Expert Guides",
        description:
            "We deliver only expert tour guides for our dear customer.",
        href:"/expert-guides"
    },
    {
        icon: <RefreshCw size={40} className="mb-4" />,
        title: "Time Flexibility",
        description:
            "We welcome time flexibility of traveling for our dear customer.",
        href:"/time-flexibility"
    },
];

function PilihKami() {
    const [activeIndex,setActiveIndex]=useState<number | null>(null)
    return (
        <section className="py-16 bg-blue-100/100 my-20 rounded-2xl">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-20 text-center">
                {features.map((feature,index)=>{
                    const isActive = activeIndex ===index;
                    return(
                        <Link key={index} href="#" onClick={()=>setActiveIndex(index)} className="flex flex-col items-center group cursor-pointer">
                            <div className={`p-4 rounded-lg transition-all duration-300 ${isActive ? "bg-blue-500 text-white":" text-blue-500"} hover:scale-125 hover:-translate-y-2`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
                            <p className="text-gray-600 mt-2 text-sm">{feature.description}</p>
                        </Link>
                    )
                })}
            </div>
        </section>
    );
}

export default PilihKami;
