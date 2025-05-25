import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function BasicSettings() {
    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-8">Dashboard & Grundeinstellungen</h1>
            
            <section className="space-y-4">
                <div className='bg-white p-3 rounded-lg'>
                    <h2 className="text-lg font-semibold">Versandzeiten</h2>
                    <p className="text-sm text-gray-600">Define the standard shipping times for all orders</p>
                    <Select>
                        <SelectTrigger className="w-[280px] mt-2">
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

                <div className='bg-white p-3 rounded-lg'>
                    <h2 className="text-lg font-semibold">Versandkosten für den Kunden</h2>
                    <p className="text-sm text-gray-600">Set the default shipping fees that will be charged to customers</p>
                    <Select>
                        <SelectTrigger className="w-[280px] mt-2">
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

                <div className='bg-white p-3 rounded-lg'>
                    <h2 className="text-lg font-semibold">Errinerungen für den Versand</h2>
                    <p className="text-sm text-gray-600">Specify after how many days automatic shipping reminders should be triggered</p>
                    <Select>
                        <SelectTrigger className="w-[280px] mt-2">
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

                <div className='bg-white p-3 rounded-lg'>
                    <h2 className="text-lg font-semibold">Produktionszeiten für Einlagenherstellung</h2>
                    <p className="text-sm text-gray-600">Select the standard production times for insoles</p>
                    <Select>
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

                <div className='bg-white p-3 rounded-lg'>
                    <h2 className="text-lg font-semibold">Ab wann Lagerstand gering sein soll</h2>
                    <p className="text-sm text-gray-600">Define when a product should be marked as having low stock</p>
                    <Select>
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

                <div className='bg-white p-3 rounded-lg'>
                    <h2 className="text-lg font-semibold">MITARBEITER für Einlagenherstellung</h2>
                    <p className="text-sm text-gray-600">Select employees responsible for the production of insoles</p>
                    <Select>
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

                <div className='bg-white p-3 rounded-lg'>
                    <h2 className="text-lg font-semibold">PREISE für Einlagen</h2>
                    <p className="text-sm text-gray-600">Set standard prices for insole products</p>
                    <Select>
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

                <div className='bg-white p-3 rounded-lg'>
                    <h2 className="text-lg font-semibold">GESCHÄFTSSTANDORTE</h2>
                    <p className="text-sm text-gray-600">Manage and configure your different business locations</p>
                    <Select>
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
        </div>
    )
}
