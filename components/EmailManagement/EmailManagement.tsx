import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { composeEmail } from '@/apis/emailManagement';

interface EmailFormData {
    email: string;
    subject: string;
    content: string;
}

interface EmailManagementProps {
    setShowCompose: (show: boolean) => void;
}

export default function EmailManagement({ setShowCompose }: EmailManagementProps) {
    const [isSending, setIsSending] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<EmailFormData>({
        defaultValues: {
            email: "",
            subject: "",
            content: ""
        }
    });

    const handleSendEmail = async (data: EmailFormData) => {
        setIsSending(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await composeEmail(data);
            toast.success("Email sent successfully");
            reset();
            setShowCompose(false);
        } catch (error) {
            console.error("Failed to send email:", error);
            toast.error("Failed to send email");
        } finally {
            setIsSending(false);
        }
    };

    const handleClose = () => {
        reset();
        setShowCompose(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-end sm:items-center justify-center z-50">
            <div className="bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full sm:max-w-2xl h-[90vh] sm:h-auto mx-0 sm:mx-4">
                <form onSubmit={handleSubmit(handleSendEmail)}>
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">Neue Nachricht</h2>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-1 cursor-pointer hover:bg-gray-100 rounded"
                        >
                            <X size={16} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="E-Mail-Adresse eingeben"
                            />
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Betreff</label>
                            <input
                                type="text"
                                {...register("subject", { required: "Subject is required" })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Betreff eingeben"
                            />
                            {errors.subject && <span className="text-red-500 text-sm">{errors.subject.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nachricht</label>
                            <textarea
                                {...register("content", { required: "Message is required" })}
                                rows={8}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Ihre Nachricht hier eingeben..."
                            />
                            {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <div className="flex justify-between gap-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 cursor-pointer text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Abbrechen
                            </button>
                            <button
                                type="submit"
                                disabled={isSending}
                                className="px-6 py-2 border border-[#61A07B] cursor-pointer text-[#61A07B] font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#61A07B] hover:text-white"
                            >
                                {isSending ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-[#61A07B] border-t-transparent rounded-full" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Senden
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
