"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link2, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = "Tulis deskripsi...",
    className = ""
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Update editor content when value changes
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    // Handle input changes
    const handleInput = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            onChange(content);
        }
    };

    // Format text commands
    const executeCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
            handleInput();
        }
    };

    // Handle paste to clean up formatting
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
        handleInput();
    };

    // Handle key shortcuts
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'b':
                    e.preventDefault();
                    executeCommand('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    executeCommand('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    executeCommand('underline');
                    break;
            }
        }
    };

    return (
        <div className={`border border-gray-400 rounded-md overflow-hidden bg-white ${className}`}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-gray-300 bg-gray-50 flex-wrap">
                <button
                    type="button"
                    onClick={() => executeCommand('bold')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Bold (Ctrl+B)"
                >
                    <Bold size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand('italic')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Italic (Ctrl+I)"
                >
                    <Italic size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand('underline')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Underline (Ctrl+U)"
                >
                    <Underline size={16} />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1" />
                
                <select
                    onChange={(e) => executeCommand('formatBlock', e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                    defaultValue=""
                >
                    <option value="">Normal</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                </select>
                
                <div className="w-px h-6 bg-gray-300 mx-1" />
                
                <button
                    type="button"
                    onClick={() => executeCommand('insertUnorderedList')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Bullet List"
                >
                    <List size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand('insertOrderedList')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Numbered List"
                >
                    <ListOrdered size={16} />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1" />
                
                <button
                    type="button"
                    onClick={() => {
                        const url = prompt('Masukkan URL:');
                        if (url) executeCommand('createLink', url);
                    }}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Insert Link"
                >
                    <Link2 size={16} />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1" />
                
                <button
                    type="button"
                    onClick={() => executeCommand('justifyLeft')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Align Left"
                >
                    <AlignLeft size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand('justifyCenter')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Align Center"
                >
                    <AlignCenter size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand('justifyRight')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Align Right"
                >
                    <AlignRight size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand('justifyFull')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Justify"
                >
                    <AlignJustify size={16} />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1" />
                
                <select
                    onChange={(e) => executeCommand('fontSize', e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                    defaultValue=""
                >
                    <option value="">Font Size</option>
                    <option value="1">Kecil</option>
                    <option value="3">Normal</option>
                    <option value="4">Sedang</option>
                    <option value="5">Besar</option>
                    <option value="6">Sangat Besar</option>
                </select>
                
                <input
                    type="color"
                    onChange={(e) => executeCommand('foreColor', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    title="Text Color"
                    defaultValue="#000000"
                />
                
                <input
                    type="color"
                    onChange={(e) => executeCommand('hiliteColor', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    title="Background Color"
                    defaultValue="#ffff00"
                />
            </div>
            
            {/* Editor Content */}
            <div className="relative">
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onPaste={handlePaste}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="min-h-[200px] p-4 focus:outline-none"
                    style={{ 
                        lineHeight: '1.6',
                        fontSize: '14px'
                    }}
                    suppressContentEditableWarning={true}
                />
                
                {/* Placeholder */}
                {!value && !isFocused && (
                    <div className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none">
                        {placeholder}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RichTextEditor;