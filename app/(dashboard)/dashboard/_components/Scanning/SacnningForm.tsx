import React, { useState, useEffect } from 'react';
import { BiSolidEdit } from 'react-icons/bi';
import { ImSpinner2 } from 'react-icons/im';
import { TiArrowSortedDown } from "react-icons/ti";
import { getAllVersorgungen } from '@/apis/versorgungApis';
import { addCustomerVersorgung, detailsDiagnosis } from '@/apis/customerApis';
import toast from 'react-hot-toast';
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

// Mapping from display names to API values for diagnosis
const diagnosisMapping: { [key: string]: string } = {
    "Plantarfasziitis": "PLANTARFASZIITIS",
    "Fersensporn": "FERSENSPORN",
    "Spreizfuß": "SPREIZFUSS",
    "Senkfuß": "SENKFUSS",
    "Plattfuß": "PLATTFUSS",
    "Hohlfuß": "HOHLFUSS",
    "Knickfuß": "KNICKFUSS",
    "Knick-Senkfuß": "KNICK_SENKFUSS",
    "Hallux valgus": "HALLUX_VALGUS",
    "Hallux rigidus": "HALLUX_RIGIDUS",
    "Hammerzehen / Krallenzehen": "HAMMERZEHEN_KRALLENZEHEN",
    "Morton-Neurom": "MORTON_NEUROM",
    "Fußarthrose": "FUSSARTHROSE",
    "Stressfrakturen im Fußbereich": "STRESSFRAKTUREN_IM_FUSS",
    "Diabetisches Fußsyndrom": "DIABETISCHES_FUSSSYNDROM"
};



interface Customer {
    id: string;
    vorname?: string;
    nachname?: string;
    email?: string;
    ausfuhrliche_diagnose?: any;
}

interface ScanningFormProps {
    customer?: Customer;
}

export default function SacnningForm({ customer }: ScanningFormProps) {
    // Dropdown
    const [showDiagnosisDropdown, setShowDiagnosisDropdown] = useState(false);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState("");
    const [showSupplyDropdown, setShowSupplyDropdown] = useState(false);

    // API State
    const [versorgungData, setVersorgungData] = useState<any[]>([]);
    const [loadingVersorgung, setLoadingVersorgung] = useState(false);
    const [hasDataLoaded, setHasDataLoaded] = useState(false);
    const [selectedVersorgungId, setSelectedVersorgungId] = useState<string | null>(null);

    // Editable fields
    const [diagnosis, setDiagnosis] = useState("");
    const [editingDiagnosis, setEditingDiagnosis] = useState(false);
    const [supply, setSupply] = useState(
        "Rohling 339821769, mit Pelotte Nr. 10 und Micro Elastisch"
    );
    const [editingSupply, setEditingSupply] = useState(false);

    // Button section
    const [selectedEinlage, setSelectedEinlage] = useState<'Alltagseinlage' | 'Sporteinlage' | 'Businesseinlage'>('Alltagseinlage');

    // Checkboxes
    const [manualEntry, setManualEntry] = useState(false);
    const [fromFeetFirst, setFromFeetFirst] = useState(false);

    // Loading state
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingDiagnosis, setIsSavingDiagnosis] = useState(false);

    // Load default data when component mounts
    useEffect(() => {
        // Load default Alltagseinlage data on component mount
        const statusMap = {
            'Alltagseinlage': 'Alltagseinlagen',
            'Sporteinlage': 'Sporteinlagen',
            'Businesseinlage': 'Businesseinlagen'
        };
        fetchVersorgungData(statusMap[selectedEinlage]);
    }, []); // Empty dependency array means this runs only once on mount

    // Initialize diagnosis field from customer prop data
    useEffect(() => {
        if (customer?.ausfuhrliche_diagnose) {
            setDiagnosis(customer.ausfuhrliche_diagnose);
        }
    }, [customer?.ausfuhrliche_diagnose]);

    // Handlers
    const handleDiagnosisSelect = (diagnosis: string) => {
        setSelectedDiagnosis(diagnosis);
        setShowDiagnosisDropdown(false);
        
        // Automatically fetch versorgung data based on diagnosis and current button selection
        if (diagnosis && diagnosisMapping[diagnosis]) {
            const statusMap = {
                'Alltagseinlage': 'Alltagseinlagen',
                'Sporteinlage': 'Sporteinlagen',
                'Businesseinlage': 'Businesseinlagen'
            };
            // Fetch with both diagnosis and current status
            fetchVersorgungDataByDiagnosis(diagnosisMapping[diagnosis], statusMap[selectedEinlage]);
        }
    };


    const handleVersorgungCardSelect = async (item: any) => {
        setSupply(item.versorgung);
        setSelectedVersorgungId(item.id);
        setShowSupplyDropdown(false);

        // Auto-save to customer if customer data is provided
        if (customer?.id && item.id) {
            try {
                await addCustomerVersorgung(customer.id, item.id);
                toast.success(`Versorgung zu ${customer.vorname || 'Kunde'} hinzugefügt`);
            } catch (error) {
                console.error('Error assigning versorgung to customer:', error);
                toast.error('Fehler beim Zuweisen der Versorgung');
            }
        }
    };

    const fetchVersorgungData = async (status: string) => {
        setLoadingVersorgung(true);
        try {
            const response = await getAllVersorgungen(status, 1, 10, '');
            setVersorgungData(response.data || []);
            setHasDataLoaded(true);
        } catch (error) {
            console.error('Error fetching versorgung data:', error);
            setVersorgungData([]);
        } finally {
            setLoadingVersorgung(false);
        }
    };

    const fetchVersorgungDataByDiagnosis = async (diagnosisStatus: string, status: string = '') => {
        setLoadingVersorgung(true);
        try {
            // Fetch data based on diagnosis_status and optionally status (combined filtering)
            const response = await getAllVersorgungen(status, 1, 10, diagnosisStatus);
            setVersorgungData(response.data || []);
            setHasDataLoaded(true);
        } catch (error) {
            console.error('Error fetching versorgung data by diagnosis:', error);
            setVersorgungData([]);
        } finally {
            setLoadingVersorgung(false);
        }
    };

    const handleEinlageButtonClick = (einlageType: 'Alltagseinlage' | 'Sporteinlage' | 'Businesseinlage') => {
        setSelectedEinlage(einlageType);
        setSelectedVersorgungId(null); // Reset selection when changing category
        
        // Map button types to API status values
        const statusMap = {
            'Alltagseinlage': 'Alltagseinlagen',
            'Sporteinlage': 'Sporteinlagen',
            'Businesseinlage': 'Businesseinlagen'
        };
        
        // Check if diagnosis is selected
        if (selectedDiagnosis && diagnosisMapping[selectedDiagnosis]) {
            // If diagnosis is selected, fetch by BOTH diagnosis_status AND status (combined filtering)
            fetchVersorgungDataByDiagnosis(diagnosisMapping[selectedDiagnosis], statusMap[einlageType]);
        } else {
            // If no diagnosis selected, fetch by status only (default behavior)
            fetchVersorgungData(statusMap[einlageType]);
        }
    };
    const handleDiagnosisEdit = () => setEditingDiagnosis(true);
    
    const handleDiagnosisBlur = async () => {
        setEditingDiagnosis(false);
        
        // Auto-save diagnosis if customer exists
        if (customer?.id && diagnosis.trim()) {
            setIsSavingDiagnosis(true);
            try {
                await detailsDiagnosis(customer.id, diagnosis);
                toast.success('Diagnose erfolgreich gespeichert');
            } catch (error) {
                console.error('Error saving diagnosis:', error);
                toast.error('Fehler beim Speichern der Diagnose');
            } finally {
                setIsSavingDiagnosis(false);
            }
        }
    };
    const handleSupplyEdit = () => setEditingSupply(true);
    const handleSupplyBlur = () => setEditingSupply(false);
    const handleSupplyDropdownToggle = () => setShowSupplyDropdown(!showSupplyDropdown);

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
            <div className='mt-10'>
                <div className="flex flex-col lg:flex-row gap-6 lg:justify-between lg:items-center mb-10 w-full">
                    {/* Diagnosis Dropdown */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative">
                            <div
                                className="p-3 sm:p-2 border border-gray-300 rounded cursor-pointer flex justify-between items-center min-h-[44px]"
                                onClick={() => setShowDiagnosisDropdown(!showDiagnosisDropdown)}
                            >
                                <span className={`text-sm sm:text-base truncate pr-2 ${selectedDiagnosis ? '' : 'text-gray-400'}`}>
                                    {selectedDiagnosis || "Diagnose auswählen"}
                                </span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {selectedDiagnosis && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedDiagnosis("");
                                                setVersorgungData([]);
                                                setHasDataLoaded(false);
                                            }}
                                            className="text-gray-400 hover:text-gray-600 text-sm p-1 hover:bg-gray-100 rounded"
                                            title="Diagnose löschen"
                                        >
                                            ✕
                                        </button>
                                    )}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            {showDiagnosisDropdown && (
                                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                                    {diagnosisOptions.map((option, index) => (
                                        <div
                                            key={index}
                                            className="p-3 sm:p-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base border-b border-gray-100 last:border-b-0"
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
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:justify-end">
                            <button
                                type="button"
                                className={`border cursor-pointer border-gray-400 px-3 sm:px-4 lg:px-6 py-2 sm:py-2 rounded text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors min-h-[44px] flex-1 sm:flex-none ${selectedEinlage === 'Alltagseinlage' ? 'bg-gray-200 border-gray-600' : 'bg-white'}`}
                                onClick={() => handleEinlageButtonClick('Alltagseinlage')}
                            >
                                <span className="sm:hidden">Alltag</span>
                                <span className="hidden sm:inline">Alltagseinlage</span>
                            </button>
                            <button
                                type="button"
                                className={`border cursor-pointer border-gray-400 px-3 sm:px-4 lg:px-6 py-2 sm:py-2 rounded text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors min-h-[44px] flex-1 sm:flex-none ${selectedEinlage === 'Sporteinlage' ? 'bg-gray-200 border-gray-600' : 'bg-white'}`}
                                onClick={() => handleEinlageButtonClick('Sporteinlage')}
                            >
                                <span className="sm:hidden">Sport</span>
                                <span className="hidden sm:inline">Sporteinlage</span>
                            </button>
                            <button
                                type="button"
                                className={`border cursor-pointer border-gray-400 px-3 sm:px-4 lg:px-6 py-2 sm:py-2 rounded text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors min-h-[44px] flex-1 sm:flex-none ${selectedEinlage === 'Businesseinlage' ? 'bg-gray-200 border-gray-600' : 'bg-white'}`}
                                onClick={() => handleEinlageButtonClick('Businesseinlage')}
                            >
                                <span className="sm:hidden">Business</span>
                                <span className="hidden sm:inline">Businesseinlage</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Diagnosis and Supply Editable Fields */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Versorgung */}
                    <div className="relative">
                        <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold">Ausführliche Diagnose</h3>
                            <button
                                type="button"
                                onClick={handleDiagnosisEdit}
                                className="ml-3 cursor-pointer"
                                disabled={isSavingDiagnosis}
                            >
                                <BiSolidEdit className='text-gray-900 text-xl' />
                            </button>
                            {isSavingDiagnosis && (
                                <div className="ml-2 flex items-center">
                                    <ImSpinner2 className="animate-spin text-blue-500 text-sm" />
                                    <span className="ml-1 text-sm text-blue-600">Speichern...</span>
                                </div>
                            )}
                        </div>
                        {editingDiagnosis ? (
                            <textarea
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                onBlur={handleDiagnosisBlur}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                placeholder="Geben Sie hier die ausführliche Diagnose ein..."
                                autoFocus
                            />
                        ) : (
                            <div className="p-2 border border-gray-300 rounded min-h-[100px] cursor-pointer" onClick={handleDiagnosisEdit}>
                                {diagnosis || (
                                    <span className="text-gray-400 italic">
                                        Klicken Sie hier oder auf das Bearbeiten-Symbol, um eine ausführliche Diagnose hinzuzufügen...
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">Versorgung</h3>
                            <div className='flex items-center justify-center'>
                                <button
                                    type="button"
                                    onClick={handleSupplyDropdownToggle}
                                    className='cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors'
                                >
                                    <TiArrowSortedDown className={`text-gray-900 text-3xl transition-transform ${showSupplyDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSupplyEdit}
                                    className="ml-3 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                                >
                                    <BiSolidEdit className='text-gray-900 text-xl' />
                                </button>
                            </div>
                        </div>

                        {/* Supply Dropdown */}
                        {showSupplyDropdown && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-auto mb-2">
                                <div className="p-3 bg-gray-50 border-b border-gray-200">
                                    <div className="text-sm font-semibold text-gray-700">
                                        {selectedDiagnosis ? 
                                            `${selectedDiagnosis} - ${selectedEinlage}` : 
                                            `${selectedEinlage} Optionen`
                                        } {hasDataLoaded && `(${versorgungData.length} gefunden)`}
                                    </div>
                                    {selectedDiagnosis && (
                                        <div className="text-xs text-blue-600 mt-1">
                                            Diagnosebasierte Auswahl für {selectedEinlage}
                                        </div>
                                    )}
                                </div>

                                {loadingVersorgung ? (
                                    <div className="p-8 text-center">
                                        <ImSpinner2 className="animate-spin text-2xl text-gray-500 mx-auto mb-2" />
                                        <div className="text-sm text-gray-500">Lade Daten...</div>
                                    </div>
                                ) : hasDataLoaded && versorgungData.length > 0 ? (
                                    // Show API Data
                                    versorgungData.map((item, index) => {
                                        const isSelected = selectedVersorgungId === item.id;
                                        return (
                                            <div
                                                key={item.id || index}
                                                className={`p-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 ${isSelected
                                                        ? 'bg-blue-50 border-l-4 border-l-blue-500 shadow-sm'
                                                        : 'hover:bg-gray-50'
                                                    }`}
                                                onClick={() => handleVersorgungCardSelect(item)}
                                            >
                                                <div className={`font-semibold mb-2 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                                    {item.name}
                                                    {isSelected && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            Ausgewählt
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                                                    <div><span className="font-medium">Rohling:</span> {item.rohlingHersteller}</div>
                                                    <div><span className="font-medium">Artikel:</span> {item.artikelHersteller}</div>
                                                </div>
                                                <div className={`text-sm mb-1 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                                    <span className="font-medium">Versorgung:</span> {item.versorgung}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    <span className="font-medium">Material:</span> {item.material}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : hasDataLoaded && versorgungData.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <div className="text-sm">Keine Daten für {selectedEinlage} gefunden</div>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <div className="text-sm">Bitte wählen Sie eine Einlage-Kategorie aus</div>
                                    </div>
                                )}
                            </div>
                        )}

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
            </div>
        </div>
    );
}

