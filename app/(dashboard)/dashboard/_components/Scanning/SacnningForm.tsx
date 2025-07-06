import React, { useState } from 'react';
import { BiSolidEdit } from 'react-icons/bi';
import { RiArrowDownSLine } from 'react-icons/ri';
import { ImSpinner2 } from 'react-icons/im';

const diagnosisOptions = [
    "Plantarfasziitis",
    "Fersensporn",
    "Spreizfuß",
    "Senkfuß",
    "Plattfuß",
    "Hohlfuß",
    "Knickfuß",
    "Knick-Senkfuß",
    "Hallux valgus",
    "Hallux rigidus",
    "Hammerzehen / Krallenzehen",
    "Morton-Neurom",
    "Fußarthrose",
    "Stressfrakturen im Fußbereich",
    "Diabetisches Fußsyndrom"
];

export default function SacnningForm() {
    // Dropdown
    const [showDiagnosisDropdown, setShowDiagnosisDropdown] = useState(false);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState("");

    // Editable fields
    const [diagnosis, setDiagnosis] = useState(
        "Der Kunde hat eine starken Unterschied der Fusslänge zwischen beiden Füßen. Dazu rechts eine stärkere Fersenneigung. Der Index der Plantarsohle ist etwas zu niedrig und es tendiert zu einem leichten Hohlfuss."
    );
    const [editingDiagnosis, setEditingDiagnosis] = useState(false);
    const [supply, setSupply] = useState(
        "Rohling 339821769, mit Pelotte Nr. 10 und Micro Elastisch"
    );
    const [editingSupply, setEditingSupply] = useState(false);

    // Button section
    const [selectedEinlage, setSelectedEinlage] = useState<'Alltagseinlage' | 'Sporteinlage' | 'Businesseinlage'>('Sporteinlage');

    // Checkboxes
    const [manualEntry, setManualEntry] = useState(false);
    const [fromFeetFirst, setFromFeetFirst] = useState(false);

    // Loading state
    const [isSaving, setIsSaving] = useState(false);

    // Handlers
    const handleDiagnosisSelect = (diagnosis: string) => {
        setSelectedDiagnosis(diagnosis);
        setShowDiagnosisDropdown(false);
    };
    const handleDiagnosisEdit = () => setEditingDiagnosis(true);
    const handleDiagnosisBlur = () => setEditingDiagnosis(false);
    const handleSupplyEdit = () => setEditingSupply(true);
    const handleSupplyBlur = () => setEditingSupply(false);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        console.log({
            selectedDiagnosis,
            selectedEinlage,
            diagnosis,
            supply,
            manualEntry,
            fromFeetFirst
        });
        await new Promise(res => setTimeout(res, 1500));
        setIsSaving(false);
    };

    return (
        <div>
            <form className='mt-10' onSubmit={handleFormSubmit}>
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 w-full">
                    {/* Diagnosis Dropdown */}
                    <div className=" w-full md:w-1/2">
                        <div className="relative">
                            <div
                                className="p-2 border border-gray-300 rounded cursor-pointer flex justify-between items-center"
                                onClick={() => setShowDiagnosisDropdown(!showDiagnosisDropdown)}
                            >
                                <span className={selectedDiagnosis ? '' : 'text-gray-400'}>{selectedDiagnosis || "Diagnose auswählen"}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {showDiagnosisDropdown && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                                    {diagnosisOptions.map((option, index) => (
                                        <div
                                            key={index}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleDiagnosisSelect(option)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* button section */}
                    <div className="w-full md:w-1/2">
                        <div className="flex space-x-4 justify-end">
                            <button
                                type="button"
                                className={`border cursor-pointer border-gray-400 px-6 py-2 rounded text-sm font-semibold hover:bg-gray-100 ${selectedEinlage === 'Alltagseinlage' ? 'bg-gray-200' : 'bg-white'}`}
                                onClick={() => setSelectedEinlage('Alltagseinlage')}
                            >
                                Alltagseinlage
                            </button>
                            <button
                                type="button"
                                className={`border cursor-pointer border-gray-400 px-6 py-2 rounded text-sm font-semibold hover:bg-gray-100 ${selectedEinlage === 'Sporteinlage' ? 'bg-gray-200' : 'bg-white'}`}
                                onClick={() => setSelectedEinlage('Sporteinlage')}
                            >
                                Sporteinlage
                            </button>
                            <button
                                type="button"
                                className={`border cursor-pointer border-gray-400 px-6 py-2 rounded text-sm font-semibold hover:bg-gray-100 ${selectedEinlage === 'Businesseinlage' ? 'bg-gray-200' : 'bg-white'}`}
                                onClick={() => setSelectedEinlage('Businesseinlage')}
                            >
                                Businesseinlage
                            </button>
                        </div>
                    </div>
                </div>

                {/* Diagnosis and Supply Editable Fields */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold">Ausführliche Diagnose</h3>
                            <button
                                type="button"
                                onClick={handleDiagnosisEdit}
                                className="ml-3 cursor-pointer"
                            >
                                <BiSolidEdit className='text-gray-900 text-xl' />
                            </button>
                        </div>
                        {editingDiagnosis ? (
                            <textarea
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                onBlur={handleDiagnosisBlur}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                autoFocus
                            />
                        ) : (
                            <div className="p-2 border border-gray-300 rounded min-h-[100px]">
                                {diagnosis}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold">Versorgung</h3>
                            <button
                                type="button"
                                onClick={handleSupplyEdit}
                                className="ml-3 cursor-pointer"
                            >
                                <BiSolidEdit className='text-gray-900 text-xl' />
                            </button>
                        </div>
                        {editingSupply ? (
                            <textarea
                                value={supply}
                                onChange={(e) => setSupply(e.target.value)}
                                onBlur={handleSupplyBlur}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                autoFocus
                            />
                        ) : (
                            <div className="p-2 border border-gray-300 rounded min-h-[100px]">
                                {supply}
                            </div>
                        )}
                    </div>
                </div>

                {/* Checkbox Section (Schuhmodell wählen) */}
                <div className="flex flex-col md:flex-row md:items-start md:space-x-8 mb-8 mt-8">
                    <div className="mb-2 md:mb-0 min-w-max font-semibold flex items-center" style={{ fontWeight: 600 }}>
                        Schuhmodell wählen (optional aber empfohlen)
                    </div>
                    <div className="flex flex-col space-y-3">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" className="w-5 h-5" checked={manualEntry} onChange={e => setManualEntry(e.target.checked)} />
                            <span>Manuell eintragen (Marke + Modell + Größe)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" className="w-5 h-5" checked={fromFeetFirst} onChange={e => setFromFeetFirst(e.target.checked)} />
                            <span>Aus FeetFirst Bestand wählen</span>
                        </label>
                    </div>
                </div>

                {/* Checkbox and Save Button Section */}
                <div className="my-16">
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-black text-white rounded-full px-12 py-2 text-sm font-semibold focus:outline-none hover:bg-gray-800 transition-colors flex items-center justify-center min-w-[160px]"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <span className="flex items-center">
                                    <ImSpinner2 className="animate-spin mr-2 text-2xl" />
                                    Speichern...
                                </span>
                            ) : (
                                'Speichern'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
