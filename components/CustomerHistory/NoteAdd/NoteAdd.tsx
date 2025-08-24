import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import AddNoteModal from '@/app/(dashboard)/dashboard/_components/Customers/AddNoteModal';
import { useSingleCustomer } from '@/hooks/customer/useSingleCustomer';
import { useCustomerNote } from '@/hooks/customer/useCustomerNote';

// Extend the Note interface to match the hook
interface Note {
    id: number;
    text: string;
    category: string;
    timestamp: string;
    hasLink?: boolean;
    url?: string | null;
}

const CATEGORIES = [
    'Diagramm',
    'Notizen',
    'Bestellungen',
    'Leistungen',
    'Termin',
    'Zahlungen',
    'E-mails'
];

type CategoryType = 'Notizen' | 'Bestellungen' | 'Leistungen' | 'Termin' | 'Zahlungen' | 'E-mails';

const CATEGORY_COLORS: Record<CategoryType, string> = {
    'Notizen': 'bg-blue-500',
    'Bestellungen': 'bg-red-500',
    'Leistungen': 'bg-yellow-500',
    'Termin': 'bg-purple-500',
    'Zahlungen': 'bg-teal-500',
    'E-mails': 'bg-orange-500'
};




export default function NoteCalendar() {
    const params = useParams();
    const { customer: scanData, loading, error } = useSingleCustomer(String(params.id));
    const { 
        localNotes, 
        getNotes, 
        isLoadingNotes, 
        error: notesError,
        getNotesForCategory,
        getFilteredDates,
        formatDisplayDate,
        isToday,
        handleDeleteNote,
        updateLocalNotes
    } = useCustomerNote();
    
    const [activeTab, setActiveTab] = useState<string>('Diagramm');
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [hoveredNote, setHoveredNote] = useState<number | null>(null);

    // Fetch notes when component mounts or customer changes
    useEffect(() => {
        if (scanData?.id) {
            // Fetch all notes initially for Diagramm view
            getNotes(scanData.id).then((apiNotes) => {
                updateLocalNotes(apiNotes);
            });
        }
    }, [scanData?.id, getNotes, updateLocalNotes]);

    // Fetch notes when activeTab changes (for category filtering)
    useEffect(() => {
        if (scanData?.id && activeTab !== 'Diagramm') {
            // Fetch notes filtered by category from API
            getNotes(scanData.id, 1, 50, activeTab).then((apiNotes) => {
                updateLocalNotes(apiNotes);
            });
        } else if (scanData?.id && activeTab === 'Diagramm') {
            // Fetch all notes for Diagramm view
            getNotes(scanData.id).then((apiNotes) => {
                updateLocalNotes(apiNotes);
            });
        }
    }, [activeTab, scanData?.id, getNotes, updateLocalNotes]);

    // Show loading state while fetching customer data
    if (loading) {
        return <div className="text-center py-8">Loading customer data...</div>;
    }

    // Show error state if customer fetch failed
    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-600 font-semibold mb-2">Customer Error:</div>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    // Show message if no customer data
    if (!scanData) {
        return <div className="text-center py-8">Customer not found</div>;
    }

    return (
        <div className=" ">
            {/* Loading and Error Display for Notes */}
            {isLoadingNotes && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-blue-700 font-semibold">Loading notes...</div>
                </div>
            )}
            
            {notesError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-red-700 font-semibold mb-1">Notes Error:</div>
                    <div className="text-red-600 text-sm">{notesError}</div>
                </div>
            )}

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
                    disabled={loading || !scanData}
                    className={`border bg-[#62A17B] text-white hover:bg-white hover:text-[#62A17B] cursor-pointer px-4 py-2 rounded-lg flex items-center space-x-2 transform duration-300 ${
                        (loading || !scanData) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <div className='border border-white rounded-full p-1'>
                        <Plus size={20} />
                    </div>
                    {loading ? 'Loading...' : 'Add Note'}
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
                        <TableHead className="border border-gray-500">E-mails</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Today Row */}
                    {(activeTab === 'Diagramm' || localNotes[new Date().toISOString().split('T')[0]]?.some((note: any) => note.category === activeTab)) && (
                        <TableRow className="bg-blue-50">
                            <TableCell className="border border-gray-500">
                                <div className="text-black px-2 py-1 rounded text-sm font-medium">
                                    Heute
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                    {formatDisplayDate(new Date().toISOString().split('T')[0])}
                                </div>
                            </TableCell>
                            {['Notizen', 'Bestellungen', 'Leistungen', 'Termin', 'Zahlungen', 'E-mails'].map((category) => (
                                <TableCell key={category} className="border min-h-[80px] border-gray-500">
                                    {(activeTab === 'Diagramm' || activeTab === category) &&
                                        getNotesForCategory(new Date().toISOString().split('T')[0], category).map((note: Note) => (
                                            <div
                                                key={note.id}
                                                className="relative group mb-2"
                                                onMouseEnter={() => setHoveredNote(note.id)}
                                                onMouseLeave={() => setHoveredNote(null)}
                                            >
                                                <div className={`text-xs p-2 rounded text-white ${CATEGORY_COLORS[note.category as CategoryType]} cursor-pointer`}>
                                                    {note.hasLink ? (
                                                        <button 
                                                            onClick={() => window.open(note.url || '#', '_blank')}
                                                            className="text-white hover:underline"
                                                        >
                                                            Link
                                                        </button>
                                                    ) : (
                                                        note.text
                                                    )}
                                                </div>
                                                {hoveredNote === note.id && (
                                                    <button
                                                        onClick={() => handleDeleteNote(new Date().toISOString().split('T')[0], note.id)}
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    }
                                </TableCell>
                            ))}
                        </TableRow>
                    )}

                    {/* Data not found row */}
                                        {getFilteredDates(activeTab).filter(date => !isToday(date)).length === 0 &&
                        !(activeTab === 'Diagramm' || localNotes[new Date().toISOString().split('T')[0]]?.some((note: any) => note.category === activeTab)) && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500 font-semibold">
                                    Data not found
                                </TableCell>
                            </TableRow>
                        )}

                    {/* Date Rows */}
                    {(() => {
                        const filteredDates = getFilteredDates(activeTab).filter(date => !isToday(date));
                        console.log('Rendering date rows for activeTab:', activeTab);
                        console.log('Filtered dates:', filteredDates);
                        console.log('localNotes state:', localNotes);
                        
                        return filteredDates.map((date) => (
                            <TableRow key={date}>
                                <TableCell className="border border-gray-500">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatDisplayDate(date)}
                                    </div>
                                </TableCell>
                                {['Notizen', 'Bestellungen', 'Leistungen', 'Termin', 'Zahlungen', 'E-mails'].map((category) => {
                                    const notesForCategory = getNotesForCategory(date, category);
                                    console.log(`Rendering category ${category} for date ${date}:`, notesForCategory);
                                    
                                    return (
                                        <TableCell key={category} className="border min-h-[80px] border-gray-500">
                                            {(activeTab === 'Diagramm' || activeTab === category) &&
                                                notesForCategory.map((note: Note) => (
                                                    <div
                                                        key={note.id}
                                                        className="relative group mb-2"
                                                        onMouseEnter={() => setHoveredNote(note.id)}
                                                        onMouseLeave={() => setHoveredNote(null)}
                                                    >
                                                        <div className={`text-xs p-2 rounded text-white ${CATEGORY_COLORS[note.category as CategoryType]} cursor-pointer`}>
                                                            {note.hasLink ? (
                                                                <button 
                                                                    onClick={() => window.open(note.url || '#', '_blank')}
                                                                    className="text-white hover:underline"
                                                                >
                                                                    Link
                                                                </button>
                                                            ) : (
                                                                note.text
                                                            )}
                                                        </div>
                                                        {hoveredNote === note.id && (
                                                            <button
                                                                onClick={() => handleDeleteNote(date, note.id)}
                                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            }
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ));
                    })()}

                </TableBody>
            </Table>

            {/* Add Note Modal */}
            {scanData && (
                <AddNoteModal
                    isOpen={showAddForm}
                    onClose={() => setShowAddForm(false)}
                    customerId={scanData.id}
                    onSuccess={() => {
                        // Refresh notes after adding new note
                        if (scanData?.id) {
                            if (activeTab === 'Diagramm') {
                                // Refresh all notes for Diagramm view
                                getNotes(scanData.id).then((apiNotes) => {
                                    updateLocalNotes(apiNotes);
                                });
                            } else {
                                // Refresh notes filtered by current category
                                getNotes(scanData.id, 1, 50, activeTab).then((apiNotes) => {
                                    updateLocalNotes(apiNotes);
                                });
                            }
                        }
                    }}
                />
            )}
        </div>
    );
}