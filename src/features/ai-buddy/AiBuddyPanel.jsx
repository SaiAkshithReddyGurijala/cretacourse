import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, BookOpen } from 'lucide-react';
import { sendMessage, getQuickActions } from './aiBuddyService';
import { useCourse } from '../course/CourseContext';

const AiBuddyPanel = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'ai',
            content: "Hey! 👋 I'm your AI Study Buddy. Ask me anything about your course, request a quiz, or just say hi!",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { activeCourse } = useCourse();

    const quickActions = getQuickActions();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const handleSend = async (text = input) => {
        if (!text.trim() || isThinking) return;

        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: text.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        try {
            const response = await sendMessage(text.trim(), {
                courseName: activeCourse?.title,
                phaseName: null, // Could be enhanced with current phase
            });

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                content: response,
                timestamp: new Date(),
            }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                content: "Sorry, I ran into an issue. Try again?",
                timestamp: new Date(),
            }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 998,
                }}
            />

            {/* Panel */}
            <div className="animate-slide-in-right ai-buddy-panel" style={{
                position: 'fixed',
                top: 0, right: 0, bottom: 0,
                width: '420px',
                maxWidth: '100vw',
                background: 'var(--bg-secondary)',
                borderLeft: '1px solid var(--border-color)',
                zIndex: 999,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-8px 0 30px rgba(0,0,0,0.3)',
            }}>
                {/* Header */}
                <div style={{
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-tertiary)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <div style={{
                            width: '32px', height: '32px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--gradient-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Bot size={18} color="#fff" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>AI Study Buddy</h3>
                            <p style={{ fontSize: '0.7rem', color: 'var(--success)' }}>● Online</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: '6px' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Context pill */}
                {activeCourse && (
                    <div style={{
                        padding: 'var(--spacing-xs) var(--spacing-lg)',
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '0.75rem', color: 'var(--text-muted)',
                        background: 'var(--primary-subtle)',
                    }}>
                        <BookOpen size={12} />
                        <span>Studying: <strong style={{ color: 'var(--primary)' }}>{activeCourse.title}</strong></span>
                    </div>
                )}

                {/* Messages */}
                <div style={{
                    flex: 1, overflowY: 'auto',
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    display: 'flex', flexDirection: 'column',
                    gap: 'var(--spacing-md)',
                }}>
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <div style={{
                                maxWidth: '85%',
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                borderRadius: msg.role === 'user'
                                    ? 'var(--radius-lg) var(--radius-lg) var(--radius-xs) var(--radius-lg)'
                                    : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-xs)',
                                background: msg.role === 'user'
                                    ? 'var(--primary)'
                                    : 'var(--bg-tertiary)',
                                color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                                fontSize: '0.88rem',
                                lineHeight: 1.6,
                                whiteSpace: 'pre-wrap',
                                border: msg.role === 'user'
                                    ? 'none'
                                    : '1px solid var(--border-color)',
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Thinking indicator */}
                    {isThinking && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <div style={{
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                borderRadius: 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-xs)',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-color)',
                                display: 'flex', gap: '4px', alignItems: 'center',
                            }}>
                                {[0, 1, 2].map(i => (
                                    <div key={i} style={{
                                        width: '6px', height: '6px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)',
                                        animation: `pulse 1.4s infinite`,
                                        animationDelay: `${i * 0.2}s`,
                                    }} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length <= 2 && (
                    <div style={{
                        padding: '0 var(--spacing-lg) var(--spacing-sm)',
                        display: 'flex', gap: 'var(--spacing-xs)',
                        flexWrap: 'wrap',
                    }}>
                        {quickActions.map((action, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(action.message)}
                                className="btn btn-secondary"
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '6px 12px',
                                }}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div style={{
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex', gap: 'var(--spacing-sm)',
                    alignItems: 'flex-end',
                }}>
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
                        rows={1}
                        className="input"
                        style={{
                            flex: 1,
                            resize: 'none',
                            minHeight: '40px',
                            maxHeight: '100px',
                            padding: '10px 14px',
                            fontSize: '0.9rem',
                        }}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isThinking}
                        className="btn btn-primary"
                        style={{
                            padding: '10px',
                            borderRadius: 'var(--radius-md)',
                            opacity: !input.trim() ? 0.5 : 1,
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default AiBuddyPanel;
