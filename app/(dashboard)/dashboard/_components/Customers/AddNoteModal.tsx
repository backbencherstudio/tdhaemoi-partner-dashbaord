import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCustomerNote } from '@/hooks/customer/useCustomerNote';
import toast from 'react-hot-toast';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button as UIButton } from "@/components/ui/button";
import { Calendar as CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = [
    'Notizen'

];

type CategoryType = 'Notizen' | 'Bestellungen' | 'Leistungen' | 'Termin' | 'Zahlungen' | 'E-mails';



interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerId: string;
    onSuccess?: () => void;
    editNote?: {
        apiId: string;
        text: string;
        dateISO: string | null;
        category: CategoryType;
    } | null;
}

export default function AddNoteModal({ isOpen, onClose, customerId, onSuccess, editNote }: AddNoteModalProps) {
    const formatDateToYMDLocal = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const parseYMDToLocalDate = (ymd: string) => {
        const [y, m, d] = ymd.split('-').map(Number);
        return new Date(y, (m || 1) - 1, d || 1);
    };

    const toIsoPreservingDate = (ymd: string) => {
        const [y, m, d] = ymd.split('-').map(Number);
        const iso = new Date(Date.UTC(y, (m || 1) - 1, d || 1, 0, 0, 0));
        return iso.toISOString();
    };

    const [selectedDate, setSelectedDate] = useState<string>(formatDateToYMDLocal(new Date()));
    const [noteText, setNoteText] = useState<string>('');
    const [noteCategory, setNoteCategory] = useState<CategoryType>('Notizen');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const { addNote, updateNote, isAdding, error } = useCustomerNote();

    React.useEffect(() => {
        if (isOpen) {
            if (editNote) {
                setNoteText(editNote.text || '');
                setNoteCategory(editNote.category || 'Notizen');
                const dateToUse = editNote.dateISO ? new Date(editNote.dateISO) : new Date();
                setSelectedDate(formatDateToYMDLocal(dateToUse));
            } else {
                setNoteText('');
                setNoteCategory('Notizen');
                setSelectedDate(formatDateToYMDLocal(new Date()));
            }
        }
    }, [isOpen, editNote]);


    const handleSubmit = async () => {
        if (!selectedDate || !noteText.trim()) return;

        try {
            const isoDate = toIsoPreservingDate(selectedDate);
            if (editNote?.apiId) {
                await updateNote(editNote.apiId, noteText, noteCategory, isoDate);
                toast.success('Notiz erfolgreich aktualisiert!');
            } else {
                await addNote(customerId, noteText, noteCategory, isoDate);
                toast.success('Notiz erfolgreich hinzugefügt!');
            }

            setSuccessMessage('Note added successfully!');
            setNoteText('');
            setSelectedDate(formatDateToYMDLocal(new Date()));
            setNoteCategory('Notizen');

            if (onSuccess) {
                onSuccess();
            }

            setTimeout(() => {
                onClose();
                setSuccessMessage('');
            }, 500);
        } catch (err) {
            toast.error('Fehler beim Hinzufügen der Notiz');

            console.error('Failed to add note:', err);
        }
    };

    const handleCancel = () => {
        setNoteText('');
        setSelectedDate(formatDateToYMDLocal(new Date()));
        setNoteCategory('Notizen');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Neue Notiz hinzufügen</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 overflow-y-auto ">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
                            {successMessage}
                        </div>
                    )}

                    <div>
                        <Label htmlFor="date" className='mb-2'>Datum</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <UIButton
                                    variant="outline"
                                    className="w-full cursor-pointer justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate || 'Datum auswählen'}
                                </UIButton>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 " align="start">
                                <Calendar
                                    mode="single"
                                    selected={parseYMDToLocalDate(selectedDate)}
                                    onSelect={(date) => {
                                        if (date) setSelectedDate(formatDateToYMDLocal(date));
                                    }}
                                    className="cursor-pointer"
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div>
                        <Label htmlFor="category" className='mb-2'>Kategorie</Label>
                        <Select value={noteCategory} onValueChange={(val) => setNoteCategory(val as CategoryType)}>
                            <SelectTrigger id="category" className="w-full cursor-pointer">
                                <SelectValue placeholder="Kategorie wählen" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="note" className='mb-2'>Notiz</Label>
                        <Textarea
                            id="note"
                            className="whitespace-pre-wrap break-words outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-gray-300 focus-visible:border-gray-300"
                            wrap="soft"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Notiz eingeben..."
                            rows={4}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <Button className='cursor-pointer' variant="outline" onClick={handleCancel}>
                        Abbrechen
                    </Button>
                    <Button
                        className='cursor-pointer'
                        onClick={handleSubmit}
                        disabled={!selectedDate || !noteText.trim() || isAdding}
                    >
                        {isAdding ? 'Speichern...' : 'Speichern'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
