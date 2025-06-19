import React, { useState, useEffect } from 'react';
import { Mail, Star, Trash2 } from 'lucide-react';
import { receiveEmail, sentAllEmail, getFavoriteEmail, addAndRemoveFavoriteEmail, singleEmailDelete } from '@/apis/emailManagement';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface SentDataEmailProps {
    activeTab: string;
    topTab: string;
    selectedEmails: Set<string>;
    onEmailClick: (email: EmailData) => void;
    onSelectedEmailsChange: (emails: Set<string>) => void;
    onFavoriteCountChange?: (count: number) => void;
    search?: string;
    refreshKey?: number;
    onSingleEmailDelete?: (emailId: string) => void;
}

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default function SentDataEmail({
    activeTab,
    topTab,
    selectedEmails,
    onEmailClick,
    onSelectedEmailsChange,
    onFavoriteCountChange,
    search = '',
    refreshKey,
    onSingleEmailDelete,
}: SentDataEmailProps) {
    const [emailList, setEmailList] = useState<EmailData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 0,
    });

    const debouncedSearch = useDebounce(search, 500);

    const formatEmailDate = (dateString: string) => {
        const emailDate = new Date(dateString);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const emailDay = new Date(emailDate.getFullYear(), emailDate.getMonth(), emailDate.getDate());

        if (emailDay.getTime() === today.getTime()) {
            // Today - show time
            return emailDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } else if (emailDay.getTime() === yesterday.getTime()) {
            // Yesterday - show "Yesterday"
            return 'Yesterday';
        } else {
            // Older - show date
            return emailDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    // Helper function to truncate text
    const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Helper function to truncate to word limit
    const truncateWords = (text: string, maxWords: number) => {
        if (!text) return '';
        const words = text.split(' ');
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(' ') + '...';
    };

    useEffect(() => {
        fetchEmails(1);
        // eslint-disable-next-line
    }, [activeTab, topTab]);

    useEffect(() => {
        fetchEmails(1);
 
    }, [pagination.limit]);

    useEffect(() => {
        fetchEmails(1);
    }, [debouncedSearch]);

    useEffect(() => {
        if (refreshKey) {
            fetchEmails(pagination.page);
        }
    }, [refreshKey]);

    const fetchEmails = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (activeTab === 'sent') {
                response = await sentAllEmail(page, pagination.limit, debouncedSearch);
            } else if (activeTab === 'favorites') {
                response = await getFavoriteEmail(page, pagination.limit, debouncedSearch);
                if (onFavoriteCountChange && response.pagination) {
                    onFavoriteCountChange(response.pagination.total);
                }
            } else {
                response = await receiveEmail(page, pagination.limit, debouncedSearch);
            }
            if (response && response.data) {
                setEmailList(response.data);
                if (response.pagination) setPagination(response.pagination);
            } else {
                setError('No data received from API');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setError(`Failed to load emails: ${errorMessage}`);
            toast.error(`Failed to load emails: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const updateFavoriteCount = async () => {
        try {
            const response = await getFavoriteEmail(1, 1, debouncedSearch);
            if (onFavoriteCountChange && response.pagination) {
                onFavoriteCountChange(response.pagination.total);
            }
        } catch { }
    };

    const handleToggleFavorite = async (emailId: string) => {
        try {
            const email = emailList.find(e => e.id === emailId);
            const isCurrentlyFavorite = email?.isFavorite || false;
            
            await addAndRemoveFavoriteEmail(emailId);
            await updateFavoriteCount();
            fetchEmails(pagination.page);
            
            if (isCurrentlyFavorite) {
                toast.success('Favorit entfernt');
            } else {
                toast.success('Zu Favoriten hinzugefügt');
            }
        } catch {
            toast.error('Fehler beim Aktualisieren des Favoriten-Status');
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchEmails(newPage);
        }
    };
    const handleLimitChange = (newLimit: number) => {
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    };

    // Filter logic: only show for 'allgemein' and 'fastfirst'
    const filteredEmails = emailList.filter(email => {
        if (topTab !== 'allgemein' && topTab !== 'fastfirst') return false;
        return true;
    });

    if (loading) {
        return (
            <div className="flex-1 overflow-auto flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#61A07B] mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading emails...</p>
                </div>
            </div>
        );
    }

    if (!loading && filteredEmails.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center h-full">
                <div className="text-center">
                    <Mail size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Keine E-Mails gefunden</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 overflow-auto flex items-center justify-center">
                <div className="text-center">
                    <Mail size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-red-500 mb-2">{error}</p>
                    <button
                        onClick={() => fetchEmails(1)}
                        className="px-4 py-2 bg-[#61A07B] text-white rounded-lg hover:bg-[#4a7c5f] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-w-0">
            {/* Select All Header */}
            {filteredEmails.length > 0 && (
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={filteredEmails.length > 0 && filteredEmails.every(email => selectedEmails.has(email.id))}
                            onChange={e => {
                                const updated = new Set(selectedEmails);
                                if (e.target.checked) {
                                    // Select all filtered emails
                                    filteredEmails.forEach(email => updated.add(email.id));
                                } else {
                                    // Deselect all filtered emails
                                    filteredEmails.forEach(email => updated.delete(email.id));
                                }
                                onSelectedEmailsChange(updated);
                            }}
                            className="rounded border-gray-300 cursor-pointer hover:border-[#61A07B] transition-colors"
                        />
                        <span className="text-sm text-gray-600">
                            {selectedEmails.size > 0 
                                ? `${selectedEmails.size} ausgewählt` 
                                : 'Alle auswählen'
                            }
                        </span>
                    </div>
                </div>
            )}
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="w-full">
                    {filteredEmails.map(email => (
                        <div
                            key={email.id}
                            className="p-3 sm:p-4 flex flex-col group relative cursor-pointer border-b border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 w-full"
                            onClick={() => onEmailClick(email)}
                        >
                            <div className="flex items-start gap-2 sm:gap-4 w-full">
                                <div
                                    className="mt-1 flex-shrink-0"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedEmails.has(email.id)}
                                        onChange={() => {
                                            const updated = new Set(selectedEmails);
                                            if (updated.has(email.id)) {
                                                updated.delete(email.id);
                                            } else {
                                                updated.add(email.id);
                                            }
                                            onSelectedEmailsChange(updated);
                                        }}
                                        className="rounded border-gray-300 cursor-pointer hover:border-[#61A07B] transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleToggleFavorite(email.id);
                                    }}
                                    className="mt-1 cursor-pointer hover:text-yellow-500 transition-colors p-1 rounded-full hover:bg-yellow-50 flex-shrink-0"
                                >
                                    <Star
                                        size={16}
                                        className={email.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
                                    />
                                </button>
                                <div className="flex-1 overflow-x-auto">
                                    <div className="flex items-center justify-between mb-1 min-w-max">
                                        <h3 className="font-sm text-gray-900">
                                            {activeTab === 'sent'
                                                ? email.recipient?.name || email.recipientEmail || 'Unknown Recipient'
                                                : email.sender?.name || email.recipient?.name || 'Unknown'}
                                        </h3>
                                        <span className="text-sm text-gray-500 ml-4">
                                            {formatEmailDate(email.createdAt)}
                                        </span>
                                    </div>
                                    <div className='flex gap-2 min-w-max'>
                                        <p className='text-sm font-medium text-gray-900'>{truncateText(email.subject, 50)}</p>
                                        <span className='text-sm text-gray-500'>-</span>
                                        <p className="text-sm text-gray-500">{truncateWords(email.content, 20)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        onSingleEmailDelete?.(email.id);
                                    }}
                                    className="p-1 cursor-pointer rounded-full hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                                >
                                    <Trash2 size={16} className="text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Pagination (always show, even if only one page) */}
            <div className="border-t border-gray-200 bg-white p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">Show:</span>
                            <select
                                value={pagination.limit}
                                onChange={e => handleLimitChange(Number(e.target.value))}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                                <option value={2}>2</option>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                        </div>
                        <span className="text-sm text-gray-500">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} emails
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="flex items-center gap-1"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={pagination.page === pageNum ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNum)}
                                        className="w-8 h-8 p-0"
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="flex items-center gap-1"
                        >
                            Next
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 