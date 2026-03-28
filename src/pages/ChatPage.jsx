import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveSession, selectError } from '../features/chat/chatSlice';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import ErrorBanner from '../components/ErrorBanner';

export default function ChatPage({ darkMode, onToggleDark }) {
    const activeSession = useSelector(selectActiveSession);
    const error = useSelector(selectError);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-full w-full overflow-hidden relative">
            {/* ── Desktop Sidebar ── */}
            <div className="hidden md:flex flex-shrink-0">
                <Sidebar />
            </div>

            {/* ── Mobile Sidebar Overlay ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-300"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Backdrop Blur */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        onClick={() => setSidebarOpen(false)}
                    />
                    {/* Panel Slide In */}
                    <div className="relative z-50 w-72 h-full shadow-2xl animate-in slide-in-from-left duration-500">
                        <Sidebar onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* ── Main Chat Layout ── */}
            <main className="flex flex-col flex-1 min-w-0 main-bg text-primary transition-colors duration-500">
                {/* Header */}
                <Header
                    darkMode={darkMode}
                    onToggleDark={onToggleDark}
                    sessionTitle={activeSession?.title}
                    onOpenSidebar={() => setSidebarOpen(true)}
                />

                {/* Dynamic Content Container */}
                <div className="flex-1 flex flex-col relative overflow-hidden">
                    {/* Error Feed */}
                    <div className="absolute top-0 w-full z-20">
                        <ErrorBanner error={error} />
                    </div>

                    {/* Chat Window */}
                    <ChatWindow />

                    {/* Input Interface */}
                    <div className="flex-shrink-0">
                        <ChatInput />
                    </div>
                </div>
            </main>

            {/* ── UI Background Accents (Subtle Gradients) ── */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
