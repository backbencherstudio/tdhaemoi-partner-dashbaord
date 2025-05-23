import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

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


export default function NoteCalendar() {
    const [activeTab, setActiveTab] = useState<string>('Diagramm');
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [notes, setNotes] = useState<Notes>({});
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [noteText, setNoteText] = useState<string>('');
    const [noteCategory, setNoteCategory] = useState<CategoryType>('Notizen');
    const [hoveredNote, setHoveredNote] = useState<number | null>(null);

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
            return allNotes.filter(note => note.category === category);
        }
        return allNotes.filter(note => note.category === category);
    };

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
            <div className="flex flex-col md:flex-row gap-5 items-center justify-between mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1 bg-gray-100 p-1 rounded-lg">
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
            <Table className="border border-gray-500">
                <TableHeader>
                    <TableRow className="border border-gray-500">
                        <TableHead className="border border-gray-500">Datum</TableHead>
                        <TableHead className="border border-gray-600">Notizen</TableHead>
                        <TableHead className="border border-gray-500">Bestellungen</TableHead>
                        <TableHead className="border border-gray-500">Leistungen</TableHead>
                        <TableHead className="border border-gray-500">Termin</TableHead>
                        <TableHead className="border border-gray-500">Zahlungen</TableHead>
                        <TableHead className="border border-gray-500">E-Mails</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Today Row */}
                    {(activeTab === 'Diagramm' || notes[new Date().toISOString().split('T')[0]]?.some(note => note.category === activeTab)) && (
                        <TableRow className="bg-blue-50">
                            <TableCell className="border border-gray-500">
                                <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                                    Heute
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                    {formatDisplayDate(new Date().toISOString().split('T')[0])}
                                </div>
                            </TableCell>
                            {['Notizen', 'Bestellungen', 'Leistungen', 'Rechnungen', 'Zahlungen', 'E-mails'].map((category) => (
                                <TableCell key={category} className="border min-h-[80px] border-gray-500">
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
                                    </TableCell>
                                ))}
                            </TableRow>
                        )}

                        {/* Date Rows */}
                        {getFilteredDates().filter(date => !isToday(date)).map((date) => (
                            <TableRow key={date}>
                                <TableCell className="border border-gray-500">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatDisplayDate(date)}
                                    </div>
                                </TableCell>
                                {['Notizen', 'Bestellungen', 'Leistungen', 'Rechnungen', 'Zahlungen', 'E-mails'].map((category) => (
                                    <TableCell key={category} className="border min-h-[80px] border-gray-500">
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
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}

                        {/* Empty state */}
                        {getFilteredDates().length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="border text-center text-gray-500 p-8">
                                    <p>No notes found for the selected category. Click "Add Note" to get started.</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

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