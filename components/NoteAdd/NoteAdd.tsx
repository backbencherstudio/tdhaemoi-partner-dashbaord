import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const CATEGORIES = [
    'Diagramm',
    'Notizen',
    'Bestellungen',
    'Leistungen',
    'Rechnungen',
    'Zahlungen',
    'E-mails'
];

type CategoryType = 'Notizen' | 'Bestellungen' | 'Leistungen' | 'Rechnungen' | 'Zahlungen' | 'E-mails';

const CATEGORY_COLORS: Record<CategoryType, string> = {
    'Notizen': 'bg-blue-500',
    'Bestellungen': 'bg-red-500',
    'Leistungen': 'bg-yellow-500',
    'Rechnungen': 'bg-green-500',
    'Zahlungen': 'bg-teal-500',
    'E-mails': 'bg-orange-500'
};


interface Note {
    id: number;
    text: string;
    category: CategoryType;
    timestamp: string;
}

interface Notes {
    [key: string]: Note[];
}

interface NoteCalendarProps {
    customerId: string;
}

export default function NoteCalendar() {
    const [activeTab, setActiveTab] = useState<string>('Diagramm');
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [notes, setNotes] = useState<Notes>({});
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [noteText, setNoteText] = useState<string>('');
    // Update the state initialization
    const [noteCategory, setNoteCategory] = useState<CategoryType>('Notizen');
    const [hoveredNote, setHoveredNote] = useState<number | null>(null);

    // Type the functions
    const saveNotes = (newNotes: Notes) => {
        setNotes(newNotes);
    };

    const handleAddNote = () => {
        if (!selectedDate || !noteText.trim()) return;

        const dateKey = selectedDate;
        const newNote = {
            id: Date.now(),
            text: noteText,
            category: noteCategory,
            timestamp: new Date().toISOString()
        };

        const updatedNotes = {
            ...notes,
            [dateKey]: [...(notes[dateKey] || []), newNote]
        };

        saveNotes(updatedNotes);
        setShowAddForm(false);
        setNoteText('');
        setSelectedDate('');
    };

    const handleDeleteNote = (date: string, noteId: number) => {
        const updatedNotes = { ...notes };
        updatedNotes[date] = updatedNotes[date].filter((note: { id: number }) => note.id !== noteId);
        if (updatedNotes[date].length === 0) {
            delete updatedNotes[date];
        }
        saveNotes(updatedNotes);
    };

    // Get all dates with notes, sorted by date
    const getAllDates = (): string[] => {
        const dates = Object.keys(notes).filter(date => notes[date].length > 0);
        return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    };

    // Format date for display
    const formatDisplayDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Check if date is today
    const isToday = (dateStr: string): boolean => {
        const today = new Date();
        const date = new Date(dateStr);
        return date.toDateString() === today.toDateString();
    };

    // Get notes for a specific category and date
    const getNotesForCategory = (date: string, category: string): Note[] => {
        const allNotes = notes[date] || [];
        if (activeTab === 'Diagramm') {
            // In Diagramm view, show notes only in their correct category column
            return allNotes.filter(note => note.category === category);
        }
        return allNotes.filter(note => note.category === category);
    };

    // Filter dates based on active tab
    const getFilteredDates = (): string[] => {
        if (activeTab === 'Diagramm') {
            return getAllDates();
        }
        return getAllDates().filter(date =>
            notes[date] && notes[date].some(note => note.category === activeTab)
        );
    };

    return (
        <div className=" ">
            {/* Header with Category Tabs */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors relative ${activeTab === category
                                ? 'bg-white text-[#62A17B] shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setShowAddForm(true)}
                    className="border bg-[#62A17B] text-white hover:bg-white hover:text-[#62A17B] cursor-pointer px-4 py-2 rounded-lg flex items-center space-x-2 transform duration-300"
                >
                    <div className='border border-white rounded-full p-1'>
                        <Plus size={20} />
                    </div>

                </button>
            </div>

            {/* Table Header */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-300">
                    <div className="p-3 font-semibold text-gray-700 border-r border-gray-300">Datum</div>
                    <div className="p-3 font-semibold text-gray-700 border-r border-gray-300">
                        Notizen
                    </div>
                    <div className="p-3 font-semibold text-gray-700 border-r border-gray-300">
                        Bestellungen
                    </div>
                    <div className="p-3 font-semibold text-gray-700 border-r border-gray-300">
                        Leistungen
                    </div>
                    <div className="p-3 font-semibold text-gray-700 border-r border-gray-300">
                        Termin
                    </div>
                    <div className="p-3 font-semibold text-gray-700 border-r border-gray-300">
                        Zahlungen
                    </div>
                    <div className="p-3 font-semibold text-gray-700">
                        E-Mails
                    </div>
                </div>

                {/* Today Row */}
                {(activeTab === 'Diagramm' || notes[new Date().toISOString().split('T')[0]]?.some(note => note.category === activeTab)) && (
                    <div className="grid grid-cols-7 border-b border-gray-300 bg-blue-50">
                        <div className="p-3 border-r border-gray-300">
                            <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                                Heute
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                                {formatDisplayDate(new Date().toISOString().split('T')[0])}
                            </div>
                        </div>
                        {['Notizen', 'Bestellungen', 'Leistungen', 'Rechnungen', 'Zahlungen', 'E-mails'].map((category, index) => (
                            <div key={category} className={`p-3 min-h-[80px] ${index < 5 ? 'border-r border-gray-300' : ''}`}>
                                {(activeTab === 'Diagramm' || activeTab === category) &&
                                    getNotesForCategory(new Date().toISOString().split('T')[0], category).map((note) => (
                                        <div
                                            key={note.id}
                                            className="relative group mb-2"
                                            onMouseEnter={() => setHoveredNote(note.id)}
                                            onMouseLeave={() => setHoveredNote(null)}
                                        >
                                            <div className={`text-xs p-2 rounded text-white ${CATEGORY_COLORS[note.category]} cursor-pointer`}>
                                                {note.text}
                                            </div>
                                            {hoveredNote === note.id && (
                                                <button
                                                    onClick={() => handleDeleteNote(new Date().toISOString().split('T')[0], note.id)}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={10} />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                }
                            </div>
                        ))}
                    </div>
                )}

                {/* Date Rows */}
                {getFilteredDates().filter(date => !isToday(date)).map((date) => (
                    <div key={date} className="grid grid-cols-7 border-b border-gray-300 hover:bg-gray-50">
                        <div className="p-3 border-r border-gray-300">
                            <div className="text-sm font-medium text-gray-900">
                                {formatDisplayDate(date)}
                            </div>
                        </div>
                        {['Notizen', 'Bestellungen', 'Leistungen', 'Rechnungen', 'Zahlungen', 'E-mails'].map((category, index) => (
                            <div key={category} className={`p-3 min-h-[80px] ${index < 5 ? 'border-r border-gray-300' : ''}`}>
                                {(activeTab === 'Diagramm' || activeTab === category) &&
                                    getNotesForCategory(date, category).map((note) => (
                                        <div
                                            key={note.id}
                                            className="relative group mb-2"
                                            onMouseEnter={() => setHoveredNote(note.id)}
                                            onMouseLeave={() => setHoveredNote(null)}
                                        >
                                            <div className={`text-xs p-2 rounded text-white ${CATEGORY_COLORS[note.category]} cursor-pointer`}>
                                                {note.text}
                                            </div>
                                            {hoveredNote === note.id && (
                                                <button
                                                    onClick={() => handleDeleteNote(date, note.id)}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={10} />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                }
                            </div>
                        ))}
                    </div>
                ))}

                {/* Empty state */}
                {getFilteredDates().length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <p>No notes found for the selected category. Click "Add Note" to get started.</p>
                    </div>
                )}
            </div>

            {/* Add Note Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Add New Note</h3>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={noteCategory}
                                    onChange={(e) => setNoteCategory(e.target.value as CategoryType)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {CATEGORIES.filter(cat => cat !== 'Diagramm').map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Note
                                </label>
                                <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Enter your note..."
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 cursor-pointer text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddNote}
                                disabled={!selectedDate || !noteText.trim()}
                                className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}