import React from 'react';
import { BiSolidEdit } from 'react-icons/bi';
import { ImSpinner2 } from 'react-icons/im';
import { TiArrowSortedDown } from "react-icons/ti";
import ManualEntryModal from './ManualEntryModal';
import FeetFirstInventoryModal from './FeetFirstInventoryModal';
import { useScanningFormData } from '@/hooks/customer/useScanningFormData';
import Image from 'next/image';
import { useCreateOrder } from '@/hooks/orders/useCreateOrder';



interface Customer {
    id: string;
    vorname?: string;
    nachname?: string;
    email?: string;
    ausfuhrliche_diagnose?: any;
    versorgungen?: Array<{
        id: string;
        name: string;
        rohlingHersteller: string;
        artikelHersteller: string;
        versorgung: string;
        material: string;
        status: string;
        diagnosis_status: string | null;
        customerId: string;
        createdAt: string;
        updatedAt: string;
    }>;
}

interface ScanningFormProps {
    customer?: Customer;
    onCustomerUpdate?: (updatedCustomer: Customer) => void;
}

export default function SacnningForm({ customer, onCustomerUpdate }: ScanningFormProps) {
    const {
        diagnosisOptions,
        // dropdowns
        showDiagnosisDropdown,
        setShowDiagnosisDropdown,
        selectedDiagnosis,
        showSupplyDropdown,
        handleSupplyDropdownToggle,
        // api state
        versorgungData,
        loadingVersorgung,
        hasDataLoaded,
        selectedVersorgungId,
        // editable fields
        diagnosis,
        setDiagnosis,
        editingDiagnosis,
        supply,
        setSupply,
        editingSupply,
        // buttons
        selectedEinlage,
        // checkboxes
        manualEntry,
        fromFeetFirst,
        // manual entry modal
        showManualEntryModal,
        openManualEntryModal,
        handleManualEntryModalClose,
        handleManualEntryModalSave,
        manualEntryData,
        // feetfirst modal
        showFeetFirstModal,
        openFeetFirstModal,
        handleFeetFirstModalClose,
        handleFeetFirstModalSave,
        feetFirstData,
        // loadings
        isSaving,
        isSavingDiagnosis,
        // handlers
        handleDiagnosisSelect,
        handleVersorgungCardSelect,
        handleEinlageButtonClick,
        handleDiagnosisEdit,
        handleDiagnosisBlur,
        handleSupplyEdit,
        handleSupplyBlur,
        handleManualEntryCheckboxChange,
        handleFeetFirstCheckboxChange,
        handleFormSubmit,
        clearDiagnosisAndReloadOptions,
        resolveVersorgungIdFromText,
    } = useScanningFormData(customer, onCustomerUpdate);

    const { createOrder, isCreating } = useCreateOrder();

    const handleCreateOrderClick = async () => {
        const resolvedId = resolveVersorgungIdFromText();
        if (customer?.id && resolvedId) {
            await createOrder(customer.id, resolvedId);
        }
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
                                                clearDiagnosisAndReloadOptions();
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
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-5 h-5"
                                checked={manualEntry}
                                onChange={(e) => {
                                    handleManualEntryCheckboxChange(e.target.checked)
                                }}
                            />
                            <span>Manuell eintragen (Marke + Modell + Größe)</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-5 h-5"
                                checked={fromFeetFirst}
                                onChange={(e) => {
                                    handleFeetFirstCheckboxChange(e.target.checked)
                                }}
                            />
                            <span>Aus FeetFirst Bestand wählen</span>
                        </label>
                    </div>
                </div>

                {/* Manual Entry Data Display */}
                {manualEntry && (manualEntryData.marke || manualEntryData.modell || manualEntryData.kategorie || manualEntryData.grosse) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold text-blue-900">Manuell eingetragenes Schuhmodell</h4>
                            <button
                                onClick={openManualEntryModal}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Bearbeiten
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Marke:</span>
                                <div className="text-gray-900">{manualEntryData.marke || '-'}</div>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Modell:</span>
                                <div className="text-gray-900">{manualEntryData.modell || '-'}</div>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Kategorie:</span>
                                <div className="text-gray-900">{manualEntryData.kategorie || '-'}</div>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Größe:</span>
                                <div className="text-gray-900">{manualEntryData.grosse || '-'}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FeetFirst Inventory Data Display */}
                {fromFeetFirst && (feetFirstData.kategorie || feetFirstData.marke || feetFirstData.modell || feetFirstData.grosse) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold text-green-900">Aus FeetFirst-Bestand ausgewählt</h4>
                            <button
                                onClick={openFeetFirstModal}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                                Bearbeiten
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            {feetFirstData.image && (
                                <Image
                                    width={100}
                                    height={100}
                                    src={feetFirstData.image}
                                    alt={feetFirstData.modell}
                                    className="w-16 h-16 object-cover rounded-md"
                                    onError={(e) => {
                                        e.currentTarget.src = '/images/products/shoes.png';
                                    }}
                                />
                            )}
                            <div className="flex-1">
                                <div className="text-lg font-semibold text-gray-900 mb-2">
                                    {feetFirstData.kategorie} – {feetFirstData.marke} – {feetFirstData.modell} – Größe {feetFirstData.grosse}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Kategorie:</span>
                                        <div className="text-gray-900">{feetFirstData.kategorie || '-'}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Marke:</span>
                                        <div className="text-gray-900">{feetFirstData.marke || '-'}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Modell:</span>
                                        <div className="text-gray-900">{feetFirstData.modell || '-'}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Größe:</span>
                                        <div className="text-gray-900">{feetFirstData.grosse || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                <div className="flex justify-center">
                    <button
                        type="button"
                        className="bg-black text-white rounded-full px-12 py-2 text-sm font-semibold focus:outline-none hover:bg-gray-800 transition-colors flex items-center justify-center min-w-[160px]"
                        onClick={handleCreateOrderClick}
                        disabled={isSaving || isCreating}
                    >
                        {isSaving || isCreating ? 'Speichern...' : 'Speichern'}
                    </button>
                </div>
            </div>

            {/* Manual Entry Modal */}
            <ManualEntryModal
                isOpen={showManualEntryModal}
                onClose={handleManualEntryModalClose}
                onSave={handleManualEntryModalSave}
                initialData={manualEntryData}
            />

            {/* FeetFirst Inventory Modal */}
            <FeetFirstInventoryModal
                isOpen={showFeetFirstModal}
                onClose={handleFeetFirstModalClose}
                onSave={handleFeetFirstModalSave}
            />
        </div>
    );
}

