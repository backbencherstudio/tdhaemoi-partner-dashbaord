'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Star, Send, Plus, Menu } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { getFavoriteEmail } from '@/apis/emailManagement';
import { FavoriteCountContext } from '@/contexts/FavoriteCountContext';

const tabs = [
    { key: 'inbox', label: 'Posteingang', icon: Mail },
    { key: 'favorites', label: 'Favoriten', icon: Star },
    { key: 'sent', label: 'Gesendet', icon: Send },
];

export default function EmailLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(0);

    // Fetch favorite count on mount and when needed
    const updateFavoriteCount = async () => {
        try {
            const response = await getFavoriteEmail(1, 1, '');
            setFavoriteCount(response?.pagination?.total || 0);
        } catch {
            setFavoriteCount(0);
        }
    };
    useEffect(() => {
        updateFavoriteCount();
    }, []);

    return (
        <FavoriteCountContext.Provider value={{ favoriteCount, updateFavoriteCount }}>
            <div className="flex h-full">
                {/* Sidebar for desktop, drawer for mobile */}
                <aside
                    className={`z-40 fixed md:static top-0 left-0 h-full w-64 bg-white border-r flex flex-col  transition-transform duration-200 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } md:translate-x-0`}
                >
                    <div className="p-4 border-b">
                        <Link
                            href="/dashboard/email/compose"
                            className="w-full border border-[#61A07B] cursor-pointer text-[#61A07B] font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors hover:bg-[#61A07B] hover:text-white justify-center shadow-sm"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Plus size={16} />
                            Verfassen
                        </Link>
                    </div>
                    <nav className="flex-1 p-2">
                        <div className="space-y-1">
                            {tabs.map(tab => {
                                const isActive = pathname.includes(tab.key);
                                return (
                                    <Link
                                        key={tab.key}
                                        href={`/dashboard/email/${tab.key}`}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all duration-200 ${isActive ? 'bg-[#61A07B]/10 font-semibold ' : 'hover:bg-gray-100 hover:scale-[1.03]'} text-gray-700 group`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <tab.icon size={18} className={isActive ? 'text-[#61A07B]' : 'text-gray-400 group-hover:text-[#61A07B]'} />
                                        <span className="flex-1 flex items-center justify-between">
                                            <span>{tab.label}</span>
                                            {tab.key === 'favorites' && favoriteCount > 0 && (
                                                <span className="text-sm text-gray-500">
                                                    {favoriteCount}
                                                </span>
                                            )}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>
                </aside>
                {/* Overlay for mobile sidebar */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />
                )}
                {/* Main content */}
                <main className="flex-1 min-w-0">
                    {/* Mobile menu button - top right above tabs */}
                    <button
                        className="md:hidden fixed top-14 right-4 z-50 bg-white rounded-full p-2 shadow-lg border"
                        onClick={() => setSidebarOpen(v => !v)}
                        aria-label="Open sidebar"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="pt-10 md:pt-0">{children}</div>
                </main>
            </div>
        </FavoriteCountContext.Provider>
    );
} 