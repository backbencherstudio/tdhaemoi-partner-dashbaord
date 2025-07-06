import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ScanData {
    nameKunde?: string;
    Geschäftstandort?: string;
}

interface DataModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    scanData: ScanData;
    supply: string;
}

export default function DataModal({ isOpen, onOpenChange, scanData, supply }: DataModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Werkstattzettel</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Name Kunde</label>
                            <input
                                type="text"
                                value={scanData?.nameKunde || ''}
                                readOnly
                                className="w-full p-2 border rounded bg-gray-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Wohnort</label>
                            <input
                                type="text"
                                value={scanData?.Geschäftstandort || ''}
                                readOnly
                                className="w-full p-2 border rounded bg-gray-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">E-Mail</label>
                            <input
                                type="text"
                                value="Mustermann.Max@gmail.com"
                                readOnly
                                className="w-full p-2 border rounded bg-gray-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Mitarbeiter</label>
                            <input
                                type="text"
                                value="Johannes"
                                readOnly
                                className="w-full p-2 border rounded bg-gray-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Versorgung</label>
                            <input
                                type="text"
                                value={supply}
                                readOnly
                                className="w-full p-2 border rounded bg-gray-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Preis zu bezahlen</label>
                            <input
                                type="text"
                                value="169.00€"
                                readOnly
                                className="w-full p-2 border rounded bg-gray-50"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Datum des Auftrags</label>
                            <input
                                type="text"
                                value="01.02.2025"
                                readOnly
                                className="w-full p-2 border rounded bg-gray-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Telefon</label>
                            <input
                                type="text"
                                value="+49 432 234 23"
                                readOnly
                                className="w-full p-2 border rounded bg-gray-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Geschäftstandort</label>
                            <input
                                type="text"
                                value="Bremen"
                                readOnly
                                className="w-full p-2 border rounded bg-gray-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Fertigstellung bis</label>
                            <input
                                type="text"
                                value="10.02.2025"
                                readOnly
                                className="w-full p-2 border rounded bg-gray-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Bezahlt</label>
                            <input
                                type="text"
                                value="Ja"
                                readOnly
                                className="w-full p-2 border rounded bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 cursor-pointer bg-[#62A07C] text-white rounded hover:bg-[#528e6a] transition-colors"
                    >
                        Drucken
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
