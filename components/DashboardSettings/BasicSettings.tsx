'use client'
import React, { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function BasicSettings() {
    // Define the type for the field keys
    type FieldKey = 'firstName' | 'lastName' | 'dob' | 'email' | 'phone' | 'address';
    
    // Initial state for required fields
    const initialRequiredFields = {
        firstName: false,
        lastName: false,
        dob: false,
        email: false,
        phone: false,
        address: false,
    };

    // Initial state for shipping settings
    const initialShippingSettings = {
        shippingTime: '',
        shippingCost: '',
        shippingReminder: '',
        productionTime: '',
        lowStockThreshold: '',
        employees: '',
        prices: '',
        businessLocation: ''
    };

    // State for required fields
    const [requiredFields, setRequiredFields] = useState<Record<FieldKey, boolean>>(initialRequiredFields);

    // State for shipping settings
    const [shippingSettings, setShippingSettings] = useState(initialShippingSettings);

    // State to track if there are any changes
    const [hasChanges, setHasChanges] = useState(false);

    // Check for changes whenever states change
    useEffect(() => {
        const requiredFieldsChanged = JSON.stringify(requiredFields) !== JSON.stringify(initialRequiredFields);
        const shippingSettingsChanged = JSON.stringify(shippingSettings) !== JSON.stringify(initialShippingSettings);
        
        setHasChanges(requiredFieldsChanged || shippingSettingsChanged);
    }, [requiredFields, shippingSettings]);

    const handleCheckboxChange = (field: FieldKey) => {
        setRequiredFields(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleShippingSettingChange = (setting: keyof typeof shippingSettings, value: string) => {
        setShippingSettings(prev => ({
            ...prev,
            [setting]: value,
        }));
    };

    const handleSaveSettings = () => {
        // Here you would typically save to your backend/API
        console.log('Saving settings:', { requiredFields, shippingSettings });
        // Add your API call here
        alert('Einstellungen gespeichert!');
        setHasChanges(false);
    };

    const handleResetSettings = () => {
        setRequiredFields(initialRequiredFields);
        setShippingSettings(initialShippingSettings);
        setHasChanges(false);
    };

    return (
        <div className="py-8">
            {/* Customer Data & Management – Required Fields */}
            <div className="bg-white p-6 rounded-lg mb-10 shadow-sm">
                <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
                    Kundendaten & Verwaltung
                </h1>
                <p className="text-base font-semibold mb-3 mt-2">Pflichtfelder definieren</p>
                <div className="space-y-2 ml-2">
                    <label className="flex items-center text-base">
                        <input type="checkbox" checked={requiredFields.firstName} onChange={() => handleCheckboxChange('firstName')} className="mr-2 w-4 h-4" />
                        Vorname
                    </label>
                    <label className="flex items-center text-base">
                        <input type="checkbox" checked={requiredFields.lastName} onChange={() => handleCheckboxChange('lastName')} className="mr-2 w-4 h-4" />
                        Nachname
                    </label>
                    <label className="flex items-center text-base">
                        <input type="checkbox" checked={requiredFields.dob} onChange={() => handleCheckboxChange('dob')} className="mr-2 w-4 h-4" />
                        Geburtsdatum
                    </label>
                    <label className="flex items-center text-base">
                        <input type="checkbox" checked={requiredFields.email} onChange={() => handleCheckboxChange('email')} className="mr-2 w-4 h-4" />
                        E-Mail Adresse
                    </label>
                    <label className="flex items-center text-base">
                        <input type="checkbox" checked={requiredFields.phone} onChange={() => handleCheckboxChange('phone')} className="mr-2 w-4 h-4" />
                        Telefonnummer
                    </label>
                    <label className="flex items-center text-base">
                        <input type="checkbox" checked={requiredFields.address} onChange={() => handleCheckboxChange('address')} className="mr-2 w-4 h-4" />
                        Adresse
                    </label>
                </div>
            </div>

            {/* Dashboard & Basic Configuration (Shipping Settings) */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold mb-6">Dashboard & Grundeinstellungen</h1>
                <section className="space-y-7">
                    <div>
                        <h2 className="text-lg font-semibold mb-1">Versandzeiten</h2>
                        <p className="text-sm text-gray-600 mb-2">Define the standard shipping times for all orders</p>
                        <Select value={shippingSettings.shippingTime} onValueChange={(value) => handleShippingSettingChange('shippingTime', value)}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Standardzeit auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1-2 Werktage</SelectItem>
                                <SelectItem value="2">2-3 Werktage</SelectItem>
                                <SelectItem value="3">3-5 Werktage</SelectItem>
                                <SelectItem value="4">5-7 Werktage</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-1">Versandkosten für den Kunden</h2>
                        <p className="text-sm text-gray-600 mb-2">Set the default shipping fees that will be charged to customers</p>
                        <Select value={shippingSettings.shippingCost} onValueChange={(value) => handleShippingSettingChange('shippingCost', value)}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Versandkosten auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="free">Kostenlos</SelectItem>
                                <SelectItem value="5">5 EUR</SelectItem>
                                <SelectItem value="7.5">7.50 EUR</SelectItem>
                                <SelectItem value="10">10 EUR</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-1">Erinnerungen für den Versand</h2>
                        <p className="text-sm text-gray-600 mb-2">Specify after how many days automatic shipping reminders should be triggered</p>
                        <Select value={shippingSettings.shippingReminder} onValueChange={(value) => handleShippingSettingChange('shippingReminder', value)}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Erinnerungszeit auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3">Nach 3 Tagen</SelectItem>
                                <SelectItem value="5">Nach 5 Tagen</SelectItem>
                                <SelectItem value="7">Nach 7 Tagen</SelectItem>
                                <SelectItem value="10">Nach 10 Tagen</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='bg-gray-50 p-3 rounded-lg'>
                        <h2 className="text-lg font-semibold">Produktionszeiten für Einlagenherstellung</h2>
                        <p className="text-sm text-gray-600">Select the standard production times for insoles</p>
                        <Select value={shippingSettings.productionTime} onValueChange={(value) => handleShippingSettingChange('productionTime', value)}>
                            <SelectTrigger className="w-[280px] mt-2">
                                <SelectValue placeholder="Produktionszeit auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3">3 Werktage</SelectItem>
                                <SelectItem value="5">5 Werktage</SelectItem>
                                <SelectItem value="7">7 Werktage</SelectItem>
                                <SelectItem value="10">10 Werktage</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='bg-gray-50 p-3 rounded-lg'>
                        <h2 className="text-lg font-semibold">Ab wann Lagerstand gering sein soll</h2>
                        <p className="text-sm text-gray-600">Define when a product should be marked as having low stock</p>
                        <Select value={shippingSettings.lowStockThreshold} onValueChange={(value) => handleShippingSettingChange('lowStockThreshold', value)}>
                            <SelectTrigger className="w-[280px] mt-2">
                                <SelectValue placeholder="Schwellenwert auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 Stück</SelectItem>
                                <SelectItem value="10">10 Stück</SelectItem>
                                <SelectItem value="15">15 Stück</SelectItem>
                                <SelectItem value="20">20 Stück</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='bg-gray-50 p-3 rounded-lg'>
                        <h2 className="text-lg font-semibold">MITARBEITER für Einlagenherstellung</h2>
                        <p className="text-sm text-gray-600">Select employees responsible for the production of insoles</p>
                        <Select value={shippingSettings.employees} onValueChange={(value) => handleShippingSettingChange('employees', value)}>
                            <SelectTrigger className="w-[280px] mt-2">
                                <SelectValue placeholder="Mitarbeiter auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alle Mitarbeiter</SelectItem>
                                <SelectItem value="qualified">Nur qualifizierte Mitarbeiter</SelectItem>
                                <SelectItem value="senior">Nur Senior Mitarbeiter</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='bg-gray-50 p-3 rounded-lg'>
                        <h2 className="text-lg font-semibold">PREISE für Einlagen</h2>
                        <p className="text-sm text-gray-600">Set standard prices for insole products</p>
                        <Select value={shippingSettings.prices} onValueChange={(value) => handleShippingSettingChange('prices', value)}>
                            <SelectTrigger className="w-[280px] mt-2">
                                <SelectValue placeholder="Standardpreis auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="100">100 EUR</SelectItem>
                                <SelectItem value="150">150 EUR</SelectItem>
                                <SelectItem value="200">200 EUR</SelectItem>
                                <SelectItem value="custom">Individueller Preis</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='bg-gray-50 p-3 rounded-lg'>
                        <h2 className="text-lg font-semibold">GESCHÄFTSSTANDORTE</h2>
                        <p className="text-sm text-gray-600">Manage and configure your different business locations</p>
                        <Select value={shippingSettings.businessLocation} onValueChange={(value) => handleShippingSettingChange('businessLocation', value)}>
                            <SelectTrigger className="w-[280px] mt-2">
                                <SelectValue placeholder="Standort auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="main">Hauptstandort</SelectItem>
                                <SelectItem value="branch1">Filiale 1</SelectItem>
                                <SelectItem value="branch2">Filiale 2</SelectItem>
                                <SelectItem value="add">Neuen Standort hinzufügen</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </section>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t">
                    {hasChanges && (
                        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
                            Einstellungen speichern
                        </Button>
                    )}
                    <Button onClick={handleResetSettings} variant="outline">
                        Zurücksetzen
                    </Button>
                </div>
            </div>
        </div>
    )
}
