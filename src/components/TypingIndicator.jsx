import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

/**
 * TypingIndicator — Enhanced with Framer Motion for a fluid, premium "dancing dots" effect.
 */
export default function TypingIndicator() {
    const dotVariants = {
        animate: (i) => ({
            y: [0, -6, 0],
            transition: {
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
            }
        })
    };

    return (
        <div className="flex items-start gap-3 mb-6">
            {/* AI Avatar */}
            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg">
                <Bot size={20} />
            </div>

            {/* Animated dots bubble */}
            <div className="glass dark:bg-white/5 bg-white/40 border border-white/20 rounded-3xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-2">
                <motion.span
                    custom={0}
                    variants={dotVariants}
                    animate="animate"
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                />
                <motion.span
                    custom={1}
                    variants={dotVariants}
                    animate="animate"
                    className="w-2 h-2 bg-teal-400 rounded-full"
                />
                <motion.span
                    custom={2}
                    variants={dotVariants}
                    animate="animate"
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                />
                <span className="ml-2 text-xs font-medium text-gray-400 dark:text-gray-500 italic">
                    Nexus is thinking...
                </span>
            </div>
        </div>
    );
}
