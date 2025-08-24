import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCustomerNote } from '@/hooks/customer/useCustomerNote';
import toast from 'react-hot-toast';

const CATEGORIES = [
    'Notizen',
    'Bestellungen',
    'Leistungen',
    'Termin',
    'Zahlungen',
    'Emails'
];

type CategoryType = 'Notizen' | 'Bestellungen' | 'Leistungen' | 'Termin' | 'Zahlungen' | 'Emails';



interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerId: string;
    onSuccess?: () => void;
}

export default function AddNoteModal({ isOpen, onClose, customerId, onSuccess }: AddNoteModalProps) {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [noteText, setNoteText] = useState<string>('');
    const [noteCategory, setNoteCategory] = useState<CategoryType>('Notizen');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const { addNote, isAdding, error } = useCustomerNote();

    const handleSubmit = async () => {
        if (!selectedDate || !noteText.trim()) return;

        try {
            // Convert selected date to ISO string format
            const isoDate = new Date(selectedDate).toISOString();
            
            // Log the date format being sent
            console.log('Selected date:', selectedDate);
            console.log('ISO formatted date:', isoDate);
            
            // Send note text, category, and ISO formatted date
            await addNote(customerId, noteText, noteCategory, isoDate);

            toast.success('Notiz erfolgreich hinzugefügt!');

            setSuccessMessage('Note added successfully!');
            setNoteText('');
            setSelectedDate(new Date().toISOString().split('T')[0]);
            setNoteCategory('Notizen');

            if (onSuccess) {
                onSuccess();
            }

            setTimeout(() => {
                onClose();
                setSuccessMessage('');
            }, 1500);
        } catch (err) {
            toast.error('Fehler beim Hinzufügen der Notiz');

            console.error('Failed to add note:', err);
        }
    };

    const handleCancel = () => {
        setNoteText('');
        setSelectedDate(new Date().toISOString().split('T')[0]);
        setNoteCategory('Notizen');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Neue Notiz hinzufügen</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
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
                        <Input
                            id="date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="category" className='mb-2'>Kategorie</Label>
                        <select
                            id="category"
                            value={noteCategory}
                            onChange={(e) => setNoteCategory(e.target.value as CategoryType)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="note" className='mb-2'>Notiz</Label>
                        <Textarea
                            id="note"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Notiz eingeben..."
                            rows={4}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="outline" onClick={handleCancel}>
                        Abbrechen
                    </Button>
                    <Button
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
