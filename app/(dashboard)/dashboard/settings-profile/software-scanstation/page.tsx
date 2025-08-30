'use client'
import React, { useState } from 'react';

const MODULES = [
    { key: 'einlagenfinder', label: 'Einlagenfinder' },
    { key: 'skiFinder', label: 'Ski Finder' },
    { key: 'shoeFinder', label: 'Shoe Finder' },
];

const QUESTIONS = [
    'Für welchen Einsatz sollen die Einlagen verwendet werden?',
    'Für welchen Sportschuh verwenden Sie die Einlagen?',
    'Welches Aktivitätslevel trifft am besten auf Sie zu?',
    'Haben Sie gesundheitliche Probleme (z. B. Diabetes), die Ihre Fußgesundheit beeinflussen?',
    'Wie viel wiegen Sie ungefähr?',
    'Haben Sie Schmerzen? Wenn ja, markieren Sie bitte die betroffenen Bereiche auf dem 3D-Modell.',
    'Haben Sie weitere relevante Beschwerden oder Schmerzen?',
    'Haben Sie Probleme mit Gleichgewicht, Gang oder Beweglichkeit?',
    'Welche Erwartungen oder Ziele haben Sie mit den Einlagen?',
    'Haben Sie eine bevorzugte Farbe für den Überzug Ihrer Einlagen?',
];

export default function SoftwareScanstationPage() {
    const [selectedModules, setSelectedModules] = useState(['einlagenfinder']);
    const [showModuleWarning, setShowModuleWarning] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(QUESTIONS[0]);
    const [selectedLanguage, setSelectedLanguage] = useState('Deutsch');
    
    // Track original values to detect changes
    const [originalModules] = useState(['einlagenfinder']);
    const [originalQuestion] = useState(QUESTIONS[0]);
    const [originalLanguage] = useState('Deutsch');
    
    // Check if there are any changes
    const hasChanges = 
        JSON.stringify(selectedModules.sort()) !== JSON.stringify(originalModules.sort()) ||
        selectedQuestion !== originalQuestion ||
        selectedLanguage !== originalLanguage;

    const handleModuleToggle = (key: string) => {
        let newSelected;
        if (selectedModules.includes(key)) {
            newSelected = selectedModules.filter((k) => k !== key);
            if (newSelected.length === 0) {
                setShowModuleWarning(true);
                return;
            }
        } else {
            newSelected = [...selectedModules, key];
        }
        setSelectedModules(newSelected);
        setShowModuleWarning(false);
    };

    return (
        <div >
            <h1 className='text-2xl font-bold mb-2'>
                Scanstation – Softwaremodul
            </h1>
            <div className='text-lg mb-8'>
                Verwalten Sie hier die Einstellungen Ihrer Scanstation Software.
            </div>

            {/* Module Selection */}
            <div className='mb-8'>
                <div className='font-semibold mb-3'>Sichtbare Module auswählen</div>
                <div className='flex gap-6 mb-2'>
                    {MODULES.map((mod) => {
                        const selected = selectedModules.includes(mod.key);
                        // For demo: all modules accessible
                        const hasAccess = true;
                        return (
                            <div
                                key={mod.key}
                                className={`flex items-center cursor-pointer transition-all duration-200 rounded-lg px-6 py-3 min-w-[160px] border-2 ${selected
                                    ? 'bg-green-50 border-[#62A07C] shadow-md'
                                    : 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm'
                                    } ${!hasAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => hasAccess && handleModuleToggle(mod.key)}
                            >
                                {/* Custom Checkbox */}
                                <div className={`relative w-5 h-5 mr-3 rounded border-2 transition-all duration-200 ${selected
                                    ? 'bg-[#62A07C] border-[#62A07C]/50'
                                    : 'bg-white border-gray-400'
                                    }`}>
                                    {selected && (
                                        <svg
                                            className="absolute inset-0 w-full h-full text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span className={`font-medium ${selected ? 'text-[#62A07C]' : 'text-gray-700'}`}>
                                    {mod.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
                {showModuleWarning && (
                    <div className='text-red-500 mt-2 font-semibold flex items-center'>
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className='text-sm'> Mindestens ein Modul muss ausgewählt sein.</p>
                    </div>
                )}
            </div>

            {/* Insole Finder Question Selection as Dropdown */}
            <div className='mb-8'>
                <div className='font-semibold mb-3'>
                    Fragen für den Einlagenfinder auswählen
                </div>
                <select
                    value={selectedQuestion}
                    onChange={e => setSelectedQuestion(e.target.value)}
                    className='w-full p-3 text-base border border-gray-300 rounded-lg mb-2 focus:outline-none transition-all duration-200'
                >
                    {QUESTIONS.map(q => (
                        <option key={q} value={q}>{q}</option>
                    ))}
                </select>
            </div>

            {/* Language Selection as Dropdown */}
            <div className='mb-8'>
                <div className='font-semibold mb-3'>
                    Sprache wählen
                </div>
                <select
                    value={selectedLanguage}
                    onChange={e => setSelectedLanguage(e.target.value)}
                    className='w-44 p-3 text-base border border-gray-300 rounded-lg focus:outline-none  transition-all duration-200'
                >
                    <option value="Deutsch">Deutsch</option>
                    <option value="Englisch">Englisch</option>
                </select>
            </div>

            {/* Save Button - Only show when there are changes */}
            {hasChanges && (
                <div className='flex justify-end'>
                    <button
                        onClick={() => {
                            // Save functionality here
                            console.log('Saving settings:', {
                                selectedModules,
                                selectedQuestion,
                                selectedLanguage
                            });
                            // You can add API call or other save logic here
                            alert('Einstellungen gespeichert!');
                        }}
                        className='bg-[#62A07C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4A8A6A] transition-all duration-200 shadow-md hover:shadow-lg'
                    >
                        Speichern
                    </button>
                </div>
            )}
        </div>
    );
}

