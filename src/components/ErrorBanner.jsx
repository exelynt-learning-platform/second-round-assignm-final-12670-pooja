import React from 'react';
import { useDispatch } from 'react-redux';
import { clearError } from '../features/chat/chatSlice';
import { AlertCircle, X } from 'lucide-react';

/**
 * ErrorBanner — Modern, high-visibility error notification.
 */
export default function ErrorBanner({ error }) {
    const dispatch = useDispatch();

    if (!error) return null;

    return (
        <div className="mx-6 mb-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-4 bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-5 py-4 rounded-2xl backdrop-blur-md shadow-lg shadow-rose-900/5">
                <div className="bg-rose-500/10 p-2 rounded-xl">
                    <AlertCircle size={20} />
                </div>
                <p className="flex-1 font-medium text-[14px]">
                    {error}
                </p>
                <button
                    onClick={() => dispatch(clearError())}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                    aria-label="Dismiss error"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
