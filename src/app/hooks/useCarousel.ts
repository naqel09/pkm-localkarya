import {useState, useEffect} from "react";

export function useCarousel(length:number, interval:number=100000){
    const [current,setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % length);
        }, interval);
        return () => clearInterval(timer);
    }, [length, interval]);

    const handleNext = () => {
        setCurrent((prev) => (prev + 1) % length);
    };

    const handlePrev = () => {
        setCurrent((prev) => (prev - 1 + length) % length);
    };

    return { current, handleNext, handlePrev }; 
}