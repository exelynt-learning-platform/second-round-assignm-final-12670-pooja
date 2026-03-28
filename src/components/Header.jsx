import React from 'react';
import { useDispatch } from 'react-redux';
import { clearChat } from '../features/chat/chatSlice';
import { Sun, Moon, Trash2, Zap, Menu } from 'lucide-react';

/**
 * Header — Premium app bar with modern icons and enhanced typography.
 */
export default function Header({ darkMode, onToggleDark, sessionTitle, onOpenSidebar }) {
    const dispatch = useDispatch();

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/10 panel-glass sticky top-0 z-30">
            {/* ── Brand & Mobile Menu ── */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onOpenSidebar}
                    className="md:hidden p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    aria-label="Open sidebar"
                >
                    <Menu size={20} />
                </button>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
                        <Zap size={22} className="text-white fill-white/10" />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-[17px] font-bold tracking-tight text-primary">
                            Nexus<span className="text-blue-500">AI</span>
                        </h1>
                        <p className="text-[11px] font-medium text-secondary flex items-center gap-1.5 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {sessionTitle || 'New Session'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex items-center gap-3">
                {/* Clear chat */}
                <button
                    onClick={() => {
                        if (window.confirm('Clear all messages in this session?')) {
                            dispatch(clearChat());
                        }
                    }}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
                    title="Clear session"
                >
                    <Trash2 size={19} />
                </button>

                {/* Dark mode toggle */}
                <button
                    onClick={onToggleDark}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-300 transform active:rotate-12"
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
}
