import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';

const DEFAULT_MESSAGES = [
    {
        label: 'Bestellbestätigung',
        enabled: true,
        template: 'Ihre Bestellung wurde erfolgreich aufgegeben. Vielen Dank für Ihren Einkauf!'
    },
    {
        label: 'Zahlungseingangsbestätigung',
        enabled: true,
        template: 'Wir haben Ihre Zahlung erhalten. Ihre Bestellung wird nun bearbeitet.'
    },
    {
        label: 'Erinnerung: Einlage Abholbereit',
        enabled: false,
        template: 'Ihre Einlage ist abholbereit. Bitte kommen Sie zur Abholung vorbei.'
    },
    {
        label: 'Erinnerung: Kontrolltermin nach 2 Wochen',
        enabled: false,
        template: 'Denken Sie an Ihren Kontrolltermin in 2 Wochen. Wir freuen uns auf Ihren Besuch.'
    },
    {
        label: 'Automatische Bewertungsanfrage (nach 2 Monaten)',
        enabled: false,
        template: 'Wir hoffen, Sie sind zufrieden! Bitte bewerten Sie unseren Service.'
    },
    {
        label: 'Erinnerung: Kontrolle Einlagenversorgung nach 1 Jahr',
        enabled: false,
        template: 'Es ist Zeit für Ihre jährliche Kontrolle der Einlagenversorgung.'
    },
    {
        label: 'Automatische Benachrichtigung bei Lieferverzögerung',
        enabled: false,
        template: 'Leider verzögert sich Ihre Lieferung. Wir bitten um Ihr Verständnis.'
    },
];

export default function CustomerCommunication() {
    const [messages, setMessages] = useState(DEFAULT_MESSAGES);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');

    const handleCheckbox = (idx: number) => {
        setMessages(msgs =>
            msgs.map((m, i) => i === idx ? { ...m, enabled: !m.enabled } : m)
        );
    };

    const handleEyeClick = (idx: number) => {
        setActiveIndex(idx);
        setEditValue(messages[idx].template);
        setModalOpen(true);
    };

    const handleSave = () => {
        if (activeIndex !== null) {
            setMessages(msgs =>
                msgs.map((m, i) => i === activeIndex ? { ...m, template: editValue } : m)
            );
        }
        setModalOpen(false);
    };

    const handleReset = () => {
        if (activeIndex !== null) {
            setEditValue(DEFAULT_MESSAGES[activeIndex].template);
        }
    };

    return (
        <div className=" bg-white p-8 rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-bold mb-2">Kundenkommunikation</h2>
            <p className="text-gray-700 mb-8">
                Erstellen und verwalten Sie automatisierte Nachrichten für Ihre Kunden.
            </p>
            <ul className="space-y-4">
                {messages.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                        <button
                            className="focus:outline-none"
                            onClick={() => handleEyeClick(idx)}
                            title="Vorschau & Bearbeiten"
                        >
                            <FaEye className="text-gray-700 min-w-[20px] hover:text-blue-500" />
                        </button>
                        <input
                            type="checkbox"
                            checked={item.enabled}
                            onChange={() => handleCheckbox(idx)}
                            className="w-5 h-5 accent-green-500 border-gray-400 rounded focus:ring-2 focus:ring-green-400"
                        />
                        <span className="text-gray-900 text-sm">{item.label}</span>
                    </li>
                ))}
            </ul>

            {/* Modal for preview/edit */}
            {modalOpen && activeIndex !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/80 bg-opacity-30 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <h3 className="text-lg font-semibold mb-2">Nachrichtenvorlage bearbeiten</h3>
                        <textarea
                            className="w-full border border-gray-300 rounded p-2 mb-4 min-h-[100px]"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                                onClick={handleReset}
                            >
                                Auf Standard zurücksetzen
                            </button>
                            <button
                                className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleSave}
                            >
                                Speichern
                            </button>
                            <button
                                className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => setModalOpen(false)}
                            >
                                Schließen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
