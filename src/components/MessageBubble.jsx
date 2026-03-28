import React, { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Bot } from 'lucide-react';

/**
 * MessageBubble — renders a single chat message with Premium Features:
 * - Syntax Highlighting for code blocks
 * - Copy to Clipboard functionality
 * - Lucide icons for User/AI
 * - Staggered fade-in animation
 */
const MessageBubble = memo(function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={`flex items-start gap-3 mb-6 message-enter ${isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
        >
            {/* ── Avatar ── */}
            <div
                className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${isUser
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                    }`}
            >
                {isUser ? <User size={20} /> : <Bot size={20} />}
            </div>

            {/* ── Bubble ── */}
            <div
                className={`relative max-w-[85%] px-5 py-4 rounded-3xl shadow-sm transition-all duration-300 group ${isUser
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none'
                    : 'glass text-primary rounded-tl-none border-white/20'
                    }`}
            >
                {isUser ? (
                    <p className="whitespace-pre-wrap break-words text-[0.95rem] leading-relaxed">
                        {message.content}
                    </p>
                ) : (
                    <div className="prose prose-sm prose-theme max-w-none break-words">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const codeContent = String(children).replace(/\n$/, '');

                                    return !inline && match ? (
                                        <div className="code-block-container relative group/code my-4">
                                            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-400 text-xs border-b border-gray-700 rounded-t-xl">
                                                <span>{match[1].toUpperCase()}</span>
                                                <button
                                                    onClick={() => handleCopy(codeContent)}
                                                    className="flex items-center gap-1 hover:text-white transition-colors"
                                                >
                                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                                    {copied ? 'Copied' : 'Copy'}
                                                </button>
                                            </div>
                                            <SyntaxHighlighter
                                                style={atomDark}
                                                language={match[1]}
                                                PreTag="div"
                                                className="!m-0 !rounded-b-xl !bg-gray-900/90"
                                                {...props}
                                            >
                                                {codeContent}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                )}

                {/* ── Footer Info ── */}
                <div
                    className={`flex items-center gap-2 mt-2 text-[10px] uppercase tracking-wider font-semibold opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'text-blue-100/50 justify-end' : 'text-gray-400 dark:text-gray-500'
                        }`}
                >
                    <span>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
});

export default MessageBubble;
