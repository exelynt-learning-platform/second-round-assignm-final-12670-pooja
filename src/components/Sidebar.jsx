import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectSessions,
    selectActiveSessionId,
    addSession,
    setActiveSession,
    deleteSession,
} from '../features/chat/chatSlice';
import { Plus, MessageSquare, X, Trash2, LayoutGrid } from 'lucide-react';

/**
 * Sidebar — Premium list with glassmorphism, smooth hover states, and clear visuals.
 */
export default function Sidebar({ onClose }) {
    const dispatch = useDispatch();
    const sessions = useSelector(selectSessions);
    const activeId = useSelector(selectActiveSessionId);

    return (
        <aside className="w-72 h-full flex flex-col sidebar-bg border-r border-black/5 dark:border-white/10 overflow-hidden">
            {/* ── Header ── */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-primary font-bold tracking-tight">
                    <LayoutGrid size={20} className="text-blue-500" />
                    <span>Dashboard</span>
                </div>
                {onClose && (
                    <button onClick={onClose} className="md:hidden p-2 text-gray-400 hover:text-gray-600">
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* ── New Chat Action ── */}
            <div className="px-5 mb-6">
                <button
                    onClick={() => {
                        dispatch(addSession());
                        if (onClose) onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-[15px] shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                    <Plus size={18} />
                    <span>New Thread</span>
                </button>
            </div>

            {/* ── Sessions List ── */}
            <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6 custom-scrollbar">
                <p className="px-3 mb-2 text-[11px] font-bold text-secondary uppercase tracking-widest">
                    Recent Conversations
                </p>

                {sessions.map((session) => {
                    const isActive = session.id === activeId;
                    return (
                        <div
                            key={session.id}
                            onClick={() => {
                                dispatch(setActiveSession(session.id));
                                if (onClose) onClose();
                            }}
                            className={`group relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border ${isActive
                                ? 'active-sidebar-item shadow-sm'
                                : 'border-transparent text-secondary hover:bg-gray-200/50 dark:hover:bg-white/5'
                                }`}
                        >
                            <MessageSquare size={18} className={isActive ? 'text-blue-500' : 'text-gray-400'} />
                            <span className="flex-1 text-[14px] font-medium truncate leading-none">
                                {session.title}
                            </span>

                            {sessions.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm('Delete this chat history?')) {
                                            dispatch(deleteSession(session.id));
                                        }
                                    }}
                                    className={`p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                        }`}
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}

                            {isActive && (
                                <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Footer ── */}
            <div className="p-6 border-t border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {sessions.length} Threads Active
                    </span>
                </div>
            </div>
        </aside>
    );
}
