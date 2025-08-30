import React, { useState, useRef, useEffect } from 'react'
import { IoChatbubbleOutline, IoClose, IoSend, IoPerson } from 'react-icons/io5'

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'team';
    timestamp: Date;
}

export default function TeamChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hello! How can I help you today?",
            sender: 'team',
            timestamp: new Date()
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const userMessage: Message = {
                id: messages.length + 1,
                text: newMessage,
                sender: 'user',
                timestamp: new Date()
            };
            setMessages([...messages, userMessage]);
            setNewMessage('');
            
            // Simulate team response
            setTimeout(() => {
                const teamMessage: Message = {
                    id: messages.length + 2,
                    text: "Thanks for your message! We'll get back to you soon.",
                    sender: 'team',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, teamMessage]);
            }, 1000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className='fixed bottom-6 right-6 cursor-pointer py-3 px-8 rounded-lg shadow-lg bg-[#62A07C] hover:bg-[#4A8A6A] transition-all duration-300 z-50 flex items-center justify-center text-white font-semibold text-sm'
            >
                <IoChatbubbleOutline className='text-2xl mr-2' /> 
                <span>Team Chat</span>
            </button>

            {/* Chat Box */}
            {isOpen && (
                <div className='fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col'>
                    {/* Header */}
                    <div className='bg-[#62A07C] text-white p-4 rounded-t-lg flex items-center justify-between'>
                        <div className='flex items-center'>
                            <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3'>
                                <IoPerson className='text-xl' />
                            </div>
                            <div>
                                <h3 className='font-semibold'>Team Support</h3>
                                <p className='text-sm text-white/80'>Online</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className='hover:bg-white/20 p-1 cursor-pointer rounded transition-colors'
                        >
                            <IoClose className='text-xl ' />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className='flex-1 p-4 overflow-y-auto bg-gray-50'>
                        <div className='space-y-4'>
                            {messages.map((message) => (
                                <div 
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div 
                                        className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user'
                                            ? 'bg-[#62A07C] text-white rounded-br-none'
                                            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                        }`}
                                    >
                                        <p className='text-sm'>{message.text}</p>
                                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                                        }`}>
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input */}
                    <div className='p-4 border-t border-gray-200 bg-white rounded-b-lg'>
                        <div className='flex items-center space-x-2'>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62A07C] focus:border-transparent'
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className='p-2 bg-[#62A07C] text-white rounded-lg hover:bg-[#4A8A6A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                <IoSend className='text-lg' />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
