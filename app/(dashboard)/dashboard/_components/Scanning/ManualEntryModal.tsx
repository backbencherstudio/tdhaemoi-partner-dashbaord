import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ManualEntryData {
    marke: string;
    modell: string;
    kategorie: string;
    grosse: string;
}

interface ManualEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ManualEntryData) => void;
    initialData?: ManualEntryData;
}

export default function ManualEntryModal({ isOpen, onClose, onSave, initialData }: ManualEntryModalProps) {
    const [formData, setFormData] = useState<ManualEntryData>(
        initialData || {
            marke: '',
            modell: '',
            kategorie: '',
            grosse: ''
        }
    );

    const handleChange = (field: keyof ManualEntryData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Manuell eintragen
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Marke (Brand) */}
                    <div>
                        <label htmlFor="marke" className="block text-sm font-medium text-gray-700 mb-1">
                            Marke
                        </label>
                        <input
                            type="text"
                            id="marke"
                            value={formData.marke}
                            onChange={(e) => handleChange('marke', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="z.B. Nike, Adidas, etc."
                        />
                    </div>

                    {/* Modell (Model) */}
                    <div>
                        <label htmlFor="modell" className="block text-sm font-medium text-gray-700 mb-1">
                            Modell
                        </label>
                        <input
                            type="text"
                            id="modell"
                            value={formData.modell}
                            onChange={(e) => handleChange('modell', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="z.B. Air Max, Stan Smith, etc."
                        />
                    </div>

                    {/* Kategorie (Category) */}
                    <div>
                        <label htmlFor="kategorie" className="block text-sm font-medium text-gray-700 mb-1">
                            Kategorie
                        </label>
                        <input
                            type="text"
                            id="kategorie"
                            value={formData.kategorie}
                            onChange={(e) => handleChange('kategorie', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="z.B. Sportschuhe, Stiefel, etc."
                        />
                    </div>

                    {/* Größe (Size) */}
                    <div>
                        <label htmlFor="grosse" className="block text-sm font-medium text-gray-700 mb-1">
                            Größe
                        </label>
                        <input
                            type="text"
                            id="grosse"
                            value={formData.grosse}
                            onChange={(e) => handleChange('grosse', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="z.B. 42, 8.5, etc."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                        >
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            Speichern
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
