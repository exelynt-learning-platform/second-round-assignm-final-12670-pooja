import React, { useEffect, useRef, memo } from 'react';
import { useSelector } from 'react-redux';
import { selectMessages, selectLoading } from '../features/chat/chatSlice';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { Sparkles, MessageSquarePlus } from 'lucide-react';

/**
 * ChatWindow — Premium scrollable area with high-fidelity empty state and smooth transitions.
 */
const ChatWindow = memo(function ChatWindow() {
    const messages = useSelector(selectMessages);
    const loading = useSelector(selectLoading);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    return (
        <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-thin scrollbar-thumb-black/5 dark:scrollbar-thumb-white/5 scrollbar-track-transparent">
            {/* ── Empty State ── */}
            {messages.length === 0 && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-8 max-w-lg mx-auto select-none pointer-events-none opacity-80">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
                        <div className="relative w-24 h-24 rounded-[32px] bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-500/40 ring-4 ring-white/10">
                            <Sparkles size={44} className="text-white fill-white/10" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl font-black tracking-tight text-primary">
                            Nexus Intelligence <span className="text-blue-500">v4.0</span>
                        </h2>
                        <p className="text-[15px] leading-relaxed text-secondary font-medium">
                            Welcome to the next generation of AI assistance. <br />
                            How can I help you architect something amazing today?
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full pointer-events-auto">
                        {[
                            { icon: '🚀', text: 'Build React App' },
                            { icon: '🎨', text: 'UI Design Ideas' },
                            { icon: '⚡', text: 'Refactor Code' },
                            { icon: '📊', text: 'Data Analysis' },
                        ].map((suggest) => (
                            <button
                                key={suggest.text}
                                className="flex items-center gap-3 p-4 rounded-2xl main-bg border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-all text-sm font-semibold text-primary hover:scale-105 active:scale-95 text-left"
                            >
                                <span className="text-lg">{suggest.icon}</span>
                                {suggest.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Message List ── */}
            <div className="max-w-4xl mx-auto w-full space-y-2">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}

                {/* ── Typing Indicator ── */}
                {loading && <TypingIndicator />}
            </div>

            <div ref={bottomRef} className="h-4" />
        </div>
    );
});

export default ChatWindow;
