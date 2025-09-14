"use client";

import React from 'react';

interface HTMLRendererProps {
    content: string;
    className?: string;
}

const HTMLRenderer: React.FC<HTMLRendererProps> = ({ content, className = "" }) => {
    return (
        <div 
            className={`prose prose-gray max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
                lineHeight: '1.7',
                fontSize: '16px'
            }}
        />
    );
};

export default HTMLRenderer;