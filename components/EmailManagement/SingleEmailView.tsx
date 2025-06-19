import React from 'react';
import Image from 'next/image';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface Sender {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
}

interface Recipient {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
}

interface EmailData {
    id: string;
    subject: string;
    content: string;
    createdAt: string;
    isFavorite: boolean;
    sender?: Sender;
    recipient?: Recipient;
    recipientEmail?: string;
}

interface SingleEmailViewProps {
    email: EmailData;
    fromTab?: string;
    onBack: () => void;
    onDelete: (id: string) => void;
}

export default function SingleEmailView({ email, fromTab, onBack, onDelete }: SingleEmailViewProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const senderName = email.sender?.name || 'Unknown Sender';
    const senderEmail = email.sender?.email || 'No email';
    const senderRole = email.sender?.role || 'Unknown';
    const senderInitial = senderName.charAt(0).toUpperCase();

    const recipientEmail = email.recipient?.email || email.recipientEmail || 'No email';
    const recipientName = email.recipient?.name || 'Unknown Recipient';

    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            {email.subject}
                            {fromTab && (
                                <span className="ml-2 px-2 py-1 rounded bg-gray-100 text-xs text-gray-600 capitalize">
                                    {fromTab}
                                </span>
                            )}
                        </h1>
                        <div className="text-sm text-gray-500 space-y-1">
                            <p><strong>From:</strong> {senderName} &lt;{senderEmail}&gt;</p>
                            <p><strong>To:</strong> {email.recipient?.name ? `${recipientName} <${recipientEmail}>` : recipientEmail}</p>
                        </div>
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

            <div className="flex-1 overflow-auto p-6">
                <div className="">
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#61A07B] rounded-full flex items-center justify-center overflow-hidden">
                                    {email.sender?.image ? (
                                        <Image
                                            src={email.sender.image}
                                            alt={senderName}
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white font-semibold text-sm">
                                            {senderInitial}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{senderName}</h2>
                                    <p className="text-sm text-gray-500">{senderEmail}</p>
                                </div>
                            </div>
                            <div className="text-right">

                                {/* time format  */}
                                <p className="text-sm text-gray-500">{formatDate(email.createdAt)}</p>

                                <p className="text-xs text-gray-400 mt-1">
                                    {senderRole.charAt(0).toUpperCase() + senderRole.slice(1)}
                                </p>
                            </div>
                        </div>

                    </div>

                    <div className="prose max-w-none">
                        <div className="text-gray-800 leading-relaxed">
                            <p className="mb-4">
                                {email.content}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 