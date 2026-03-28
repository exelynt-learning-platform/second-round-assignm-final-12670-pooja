import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, selectLoading } from '../features/chat/chatSlice';
import { Send, Loader2, Smile } from 'lucide-react';

/**
 * ChatInput — Premium input area with auto-resize, focus effects, and Lucide icons.
 */
export default function ChatInput() {
    const dispatch = useDispatch();
    const loading = useSelector(selectLoading);
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
        }
    }, [text]);

    const handleSend = useCallback(() => {
        const trimmed = text.trim();
        if (!trimmed || loading) return;
        dispatch(sendMessage(trimmed));
        setText('');
    }, [text, loading, dispatch]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="px-6 pb-6 pt-2 max-w-5xl mx-auto w-full">
            <div className="relative flex items-end gap-3 glass dark:bg-slate-800 bg-white p-2.5 rounded-[24px] shadow-2xl shadow-blue-900/10 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all border-black/5 dark:border-white/10">

                {/* Attachment/Extra Button (Visual) */}
                <button className="p-2.5 text-gray-400 hover:text-blue-500 transition-colors">
                    <Smile size={20} />
                </button>

                {/* Dynamic Textarea */}
                <textarea
                    ref={textareaRef}
                    rows={1}
                    disabled={loading}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message NexusAI..."
                    className="flex-1 resize-none bg-transparent py-2.5 px-1 text-[15px] font-medium text-primary placeholder-gray-400 dark:placeholder-gray-500 outline-none leading-relaxed max-h-40 overflow-y-auto"
                />

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={!text.trim() || loading}
                    className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg hover:shadow-blue-500/40 transform hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:hover:scale-100"
                >
                    {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Send size={18} className="translate-x-0.5 -translate-y-0.5" />
                    )}
                </button>
            </div>
            <p className="text-center text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-600 mt-4 opacity-60">
                Encrypted Conversation • Powered by Nexus Core
            </p>
        </div>
    );
}
