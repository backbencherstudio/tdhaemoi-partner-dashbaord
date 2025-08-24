import { useState, useCallback } from 'react';
import { addCustomerNote, getCustomerNote } from '@/apis/customerApis';

// Types and Interfaces
interface CustomerNote {
    id: string;
    customerId: string;
    category: string;
    date: string | null;
    url: string | null;
    methord: string | null;
    paymentIs: string | null;
    eventId: string | null;
    note: string | null;
    createdAt: string;
    updatedAt: string;
}

interface Note {
    id: number;
    text: string;
    category: string;
    timestamp: string;
    hasLink?: boolean;
    url?: string | null;
}

interface Notes {
    [key: string]: Note[];
}

interface UseCustomerNoteReturn {
    // State
    notes: CustomerNote[];
    localNotes: Notes;
    isAdding: boolean;
    isLoadingNotes: boolean;
    error: string | null;

    // Actions
    addNote: (customerId: string, note: string, category: string, date: string) => Promise<void>;
    getNotes: (customerId: string, page?: number, limit?: number, category?: string) => Promise<CustomerNote[]>;
    updateLocalNotes: (apiNotes: CustomerNote[]) => void;

    // Helper functions
    getAllDates: () => string[];
    getNotesForCategory: (date: string, category: string) => Note[];
    getFilteredDates: (activeTab: string) => string[];
    formatDisplayDate: (dateStr: string) => string;
    isToday: (dateStr: string) => boolean;
    handleDeleteNote: (date: string, noteId: number) => void;
    transformApiNotesToLocal: (apiNotes: CustomerNote[]) => Notes;
}

// Constants
const CATEGORY_MAPPING = {
    'E-mails': 'Emails'
} as const;

export const useCustomerNote = (): UseCustomerNoteReturn => {
    // State
    const [isAdding, setIsAdding] = useState(false);
    const [isLoadingNotes, setIsLoadingNotes] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notes, setNotes] = useState<CustomerNote[]>([]);
    const [localNotes, setLocalNotes] = useState<Notes>({});

    // Helper function to map frontend categories to API categories
    const mapToApiCategory = useCallback((frontendCategory: string): string => {
        return CATEGORY_MAPPING[frontendCategory as keyof typeof CATEGORY_MAPPING] || frontendCategory;
    }, []);

    // Helper function to map API categories to frontend categories
    const mapToFrontendCategory = useCallback((apiCategory: string): string => {
        if (apiCategory === 'Emails') return 'E-mails';
        return apiCategory;
    }, []);

    // Helper function to generate date key from note
    const getDateKey = useCallback((note: CustomerNote): string => {
        const date = note.date || note.createdAt;
        return new Date(date).toISOString().split('T')[0];
    }, []);

    // Helper function to determine note display text and link status
    const getNoteDisplayInfo = useCallback((note: CustomerNote): { text: string; hasLink: boolean; url?: string | null } => {
        if (note.note) {
            return { text: note.note, hasLink: false };
        }
        if (note.url) {
            // Transform external email URLs to internal dashboard URLs
            let transformedUrl = note.url;

            // Check if it's an external email URL that needs transformation
            if (note.url.includes('/message/system-inbox/') || note.url.includes('/messages/system-inbox/') || note.url.includes('/messages/inbox/')) {
                // Extract the email ID from the URL
                const urlParts = note.url.split('/');
                const emailId = urlParts[urlParts.length - 1];

                // Create internal dashboard URL
                transformedUrl = `/dashboard/email/sent/${emailId}`;

                console.log('URL Transformation:', {
                    original: note.url,
                    emailId,
                    transformed: transformedUrl
                });
            }

            return { text: 'Link', hasLink: true, url: transformedUrl };
        }
        if (note.eventId) {
            return { text: `Event: ${note.eventId}`, hasLink: false };
        }
        return { text: '', hasLink: false };
    }, []);

    // Helper function to generate note ID
    const generateNoteId = useCallback((apiNoteId: string): number => {
        return parseInt(apiNoteId.replace(/-/g, '').substring(0, 8), 16);
    }, []);

    // Actions
    const addNote = useCallback(async (customerId: string, note: string, category: string, date: string) => {
        try {
            setIsAdding(true);
            setError(null);

            const apiCategory = mapToApiCategory(category);
            await addCustomerNote(customerId, note, apiCategory, date);
        } catch (err: any) {
            setError('Failed to add note');
            throw err;
        } finally {
            setIsAdding(false);
        }
    }, [mapToApiCategory]);

    const getNotes = useCallback(async (customerId: string, page: number = 1, limit: number = 50, category: string = '') => {
        try {
            setIsLoadingNotes(true);
            setError(null);

            const apiCategory = mapToApiCategory(category);
            const response = await getCustomerNote(customerId, page, limit, apiCategory);
            const fetchedNotes = response?.data || [];

            setNotes(fetchedNotes);
            return fetchedNotes;
        } catch (err: any) {
            console.error('Error in getNotes:', err);
            setError('Failed to fetch notes');
            throw err;
        } finally {
            setIsLoadingNotes(false);
        }
    }, [mapToApiCategory]);

    // Data transformation
    const transformApiNotesToLocal = useCallback((apiNotes: CustomerNote[]): Notes => {
        const transformed: Notes = {};

        apiNotes.forEach((apiNote) => {
            const dateKey = getDateKey(apiNote);

            if (!transformed[dateKey]) {
                transformed[dateKey] = [];
            }

            // Only add notes that have actual content
            if (apiNote.note || apiNote.url || apiNote.eventId) {
                const frontendCategory = mapToFrontendCategory(apiNote.category);
                const { text, hasLink, url: transformedUrl } = getNoteDisplayInfo(apiNote);

                const transformedNote: Note = {
                    id: generateNoteId(apiNote.id),
                    text,
                    category: frontendCategory,
                    timestamp: apiNote.createdAt,
                    hasLink,
                    url: transformedUrl || apiNote.url
                };

                transformed[dateKey].push(transformedNote);
            }
        });

        return transformed;
    }, [getDateKey, mapToFrontendCategory, getNoteDisplayInfo, generateNoteId]);

    // Helper functions
    const getAllDates = useCallback((): string[] => {
        const dates = Object.keys(localNotes).filter(date => localNotes[date].length > 0);
        return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }, [localNotes]);

    const formatDisplayDate = useCallback((dateStr: string): string => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }, []);

    const isToday = useCallback((dateStr: string): boolean => {
        const today = new Date();
        const date = new Date(dateStr);
        return date.toDateString() === today.toDateString();
    }, []);

    const getNotesForCategory = useCallback((date: string, category: string): Note[] => {
        const allNotes = localNotes[date] || [];
        return allNotes.filter(note => note.category === category);
    }, [localNotes]);

    const getFilteredDates = useCallback((activeTab: string): string[] => {
        if (activeTab === 'Diagramm') {
            return getAllDates();
        }

        return getAllDates().filter(date => {
            return localNotes[date] && localNotes[date].some(note => note.category === activeTab);
        });
    }, [localNotes, getAllDates]);

    const handleDeleteNote = useCallback((date: string, noteId: number) => {
        const updatedNotes = { ...localNotes };
        updatedNotes[date] = updatedNotes[date].filter(note => note.id !== noteId);

        if (updatedNotes[date].length === 0) {
            delete updatedNotes[date];
        }

        setLocalNotes(updatedNotes);
    }, [localNotes]);

    const updateLocalNotes = useCallback((apiNotes: CustomerNote[]) => {
        const transformedNotes = transformApiNotesToLocal(apiNotes);
        setLocalNotes(transformedNotes);
    }, [transformApiNotesToLocal]);

    return {
        // State
        notes,
        localNotes,
        isAdding,
        isLoadingNotes,
        error,

        // Actions
        addNote,
        getNotes,
        updateLocalNotes,

        // Helper functions
        getAllDates,
        getNotesForCategory,
        getFilteredDates,
        formatDisplayDate,
        isToday,
        handleDeleteNote,
        transformApiNotesToLocal
    };
};
