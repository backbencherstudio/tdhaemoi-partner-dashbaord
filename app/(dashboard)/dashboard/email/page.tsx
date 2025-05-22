"use client";
import React, { useState } from "react";
import {
    Mail,
    Star,
    Send,
    Trash2,
    Archive,
    Search,
    Plus,
    X,

} from "lucide-react";
import { useForm } from "react-hook-form";

export default function EmailPage() {
    const [activeTab, setActiveTab] = useState("inbox");
    const [topTab, setTopTab] = useState("allgemein");
    const [showCompose, setShowCompose] = useState(false);
    const [favorites, setFavorites] = useState(new Set());
    const [selectedEmails, setSelectedEmails] = useState(new Set());
    const [isSending, setIsSending] = useState(false);

    const [emailList, setEmailList] = useState([
        {
            id: 1,
            sender: "Eleonora Persico",
            subject: "Pinterest: le opportunit\u00e0 stanno arrivando per il tuo Brand su Pinterest",
            preview: "Ciao, Sono Eleonora Pinterest e vorrei offrirti la possibilit\u00e0...",
            time: "10 M\u00e4rz",
            read: false,
            category: "allgemein",
        },
        {
            id: 2,
            sender: "iStock",
            subject: "Sondaggio in 30 secondi: valuta la tua esperienza",
            preview: "Condividi con noi il tuo feedback per aiutarci a migliorare...",
            time: "12 M\u00e4rz",
            read: true,
            category: "bestellungen",
        },
        {
            id: 3,
            sender: "Pinterest",
            subject: "Wir aktualisieren unsere gesch\u00e4ftlichen AGB und Datenschutzrichtlinien",
            preview: "Wir bei Pinterest aktualisieren unsere Bedingungen...",
            time: "7 M\u00e4rz",
            read: true,
            category: "kunden",
        },
    ]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            to: "",
            subject: "",
            message: ""
        }
    });

    const toggleFavorite = (emailId: number) => {
        const newFavorites = new Set(favorites);
        newFavorites.has(emailId) ? newFavorites.delete(emailId) : newFavorites.add(emailId);
        setFavorites(newFavorites);
    };

    const handleSendEmail = async (data) => {
        setIsSending(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Sending email:", data);
            reset();
            setShowCompose(false);
        } catch (error) {
            console.error("Failed to send email:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleDeleteEmail = (id: number) => {
        setEmailList((prev) => prev.filter((email) => email.id !== id));
    };

    const handleArchiveEmail = (id: number) => {
        console.log("Archived email ID:", id);
    };

    const filteredEmails = emailList.filter((email) => {
        const matchesTab =
            activeTab === "favorites" ? favorites.has(email.id) : activeTab === "inbox" ? true : false;
        const matchesCategory = email.category === topTab;
        return matchesTab && matchesCategory;
    });

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50">
            <div className="w-full md:w-64 bg-white border-b md:border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <button
                        onClick={() => setShowCompose(true)}
                        className="w-full border border-[#61A07B]  cursor-pointer text-[#61A07B] font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus size={16} />
                        Verfassen
                    </button>
                </div>

                <nav className="flex-1 p-2">
                    <div className="space-y-1">
                        {[{ key: "inbox", label: "Posteingang", icon: Mail }, { key: "favorites", label: "Favoriten", icon: Star }, { key: "sent", label: "Gesendet", icon: Send }].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`w-full text-left px-3 py-2 cursor-pointer rounded-lg flex items-center gap-3 hover:bg-gray-100 transition-colors ${activeTab === tab.key ? "bg-[#63a17b71]  font-medium" : "text-gray-700"}`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                                <span className="ml-auto text-sm bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                    {tab.key === "inbox" ? emailList.filter((e) => !e.read).length : tab.key === "favorites" ? favorites.size : ""}
                                </span>
                            </button>
                        ))}
                    </div>
                </nav>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="bg-white border-b border-gray-200 overflow-x-auto">
                    <div className="flex items-center px-4 py-2 space-x-6 min-w-max">
                        {[{ id: "allgemein", color: "bg-gray-200", label: "Allgemein", short: "A" }, { id: "fastfirst", color: "bg-blue-500", label: "FastFirst Nachrichten", short: "F" }, { id: "bestellungen", color: "bg-green-500", label: "Bestellungen", short: "B" }, { id: "lager", color: "bg-purple-500", label: "Lager-Benachrichtigungen", short: "L" }, { id: "kunden", color: "bg-orange-500", label: "Kunden-Benachrichtigungen", short: "K" }].map((tab) => (
                            <div
                                key={tab.id}
                                onClick={() => setTopTab(tab.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${topTab === tab.id ? "bg-gray-200 font-semibold" : "hover:bg-gray-50"}`}
                            >
                                <div className={`w-6 h-6 ${tab.color} rounded flex items-center justify-center`}>
                                    <span className="text-xs font-medium text-white">{tab.short}</span>
                                </div>
                                <span className="text-sm">{tab.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h1 className="text-xl font-semibold text-gray-900 capitalize">{activeTab}</h1>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            {selectedEmails.size > 0 && (
                                <button
                                    onClick={() => {
                                        setEmailList((prev) => prev.filter((e) => !selectedEmails.has(e.id)));
                                        setSelectedEmails(new Set());
                                    }}
                                    className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100 transition"
                                >
                                    <Trash2 size={16} />
                                    {`L\u00f6schen (${selectedEmails.size})`}
                                </button>
                            )}
                            <div className="relative flex-1 sm:flex-none">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="E-Mails durchsuchen"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {filteredEmails.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <Mail size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>Keine E-Mails gefunden</p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredEmails.map((email) => (
                                <div key={email.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors group relative">
                                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-[#F9FAFB]">
                                        <button onClick={() => handleArchiveEmail(email.id)} className="p-1 cursor-pointer rounded-full hover:bg-gray-100">
                                            <Archive size={16} className="text-gray-500" />
                                        </button>
                                        <button onClick={() => handleDeleteEmail(email.id)} className="p-1 cursor-pointer rounded-full hover:bg-red-100">
                                            <Trash2 size={16} className="text-red-500" />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-2 sm:gap-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedEmails.has(email.id)}
                                            onChange={() => {
                                                const updated = new Set(selectedEmails);
                                                updated.has(email.id) ? updated.delete(email.id) : updated.add(email.id);
                                                setSelectedEmails(updated);
                                            }}
                                            className="mt-1 rounded border-gray-300"
                                        />
                                        <button
                                            onClick={() => toggleFavorite(email.id)}
                                            className="mt-1 hover:text-yellow-500 transition-colors"
                                        >
                                            <Star
                                                size={16}
                                                className={favorites.has(email.id) ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}
                                            />
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`font-medium ${email.read ? "text-gray-600" : "text-gray-900"}`}>{email.sender}</h3>
                                                <span className="text-sm text-gray-500">{email.time}</span>
                                            </div>
                                            <p className={`text-sm ${email.read ? "text-gray-600" : "text-gray-900 font-medium"}`}>{email.subject}</p>
                                            <p className="text-sm text-gray-500 line-clamp-2">{email.preview}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showCompose && (
                <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-end sm:items-center justify-center z-50">
                    <div className="bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full sm:max-w-2xl h-[90vh] sm:h-auto mx-0 sm:mx-4">
                        <form onSubmit={handleSubmit(handleSendEmail)}>
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold">Neue Nachricht</h2>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        reset();
                                        setShowCompose(false);
                                    }} 
                                    className="p-1 cursor-pointer hover:bg-gray-100 rounded"
                                >
                                    <X size={16} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">An</label>
                                    <input
                                        type="email"
                                        {...register("to", { required: "Email is required" })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="E-Mail-Adresse eingeben"
                                    />
                                    {errors.to && <span className="text-red-500 text-sm">{errors.to.message}</span>}
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
                                        {...register("message", { required: "Message is required" })}
                                        rows={8}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Ihre Nachricht hier eingeben..."
                                    />
                                    {errors.message && <span className="text-red-500 text-sm">{errors.message.message}</span>}
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-200">
                                <div className="flex justify-between gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            reset();
                                            setShowCompose(false);
                                        }} 
                                        className="px-4 py-2 cursor-pointer text-gray-600 hover:text-gray-800 font-medium"
                                    >
                                        Abbrechen
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSending}
                                        className="px-6 py-2 border border-[#61A07B] cursor-pointer text-[#61A07B] font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            )}
        </div>
    );
}
