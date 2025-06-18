import React from 'react';
import { ArrowLeft, Trash2, Archive, Reply, Forward, MoreVertical } from 'lucide-react';

interface EmailData {
    id: number;
    sender: string;
    subject: string;
    preview: string;
    time: string;
    read: boolean;
    category: string;
}

interface SingleEmailViewProps {
    email: EmailData;
    onBack: () => void;
    onDelete: (id: number) => void;
    onArchive: (id: number) => void;
}

export default function SingleEmailView({ email, onBack, onDelete, onArchive }: SingleEmailViewProps) {
    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Header with back button and actions */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">{email.subject}</h1>
                        <p className="text-sm text-gray-500">From: {email.sender}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onDelete(email.id)}
                        className="p-2 hover:bg-red-100 cursor-pointer rounded-full transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} className="text-red-500" />
                    </button>
                </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Email Header Info */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#61A07B] rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {email.sender.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{email.sender}</h2>
                                    <p className="text-sm text-gray-500">to me</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">{email.time}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {email.category.charAt(0).toUpperCase() + email.category.slice(1)}
                                </p>
                            </div>
                        </div>

                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{email.subject}</h1>
                    </div>

                    {/* Email Body */}
                    <div className="prose max-w-none">
                        <div className="text-gray-800 leading-relaxed">
                            <p className="mb-4">
                                {email.preview}
                            </p>

                            {/* Extended email content - you can customize this */}
                            <p className="mb-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>

                            <p className="mb-4">
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>

                            <p className="mb-4">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                            </p>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Best regards,<br />
                                    {email.sender}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
} 