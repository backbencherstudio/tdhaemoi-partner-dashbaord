import React from 'react'

export default function BasicSettings() {
    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-8">Dashboard & Grundeinstellungen</h1>
            
            <section className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">Versandzeiten</h2>
                    <p className="text-sm text-gray-600">Define the standard shipping times for all orders</p>
                    <button className="mt-2 px-4 py-2 border rounded hover:bg-gray-50">Standardzeit festlegen</button>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">Versandkosten für den Kunden</h2>
                    <p className="text-sm text-gray-600">Set the default shipping fees that will be charged to customers</p>
                    <button className="mt-2 px-4 py-2 border rounded hover:bg-gray-50">Anzahl der Tage angeben</button>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">Produktionszeiten für Einlagenherstellung</h2>
                    <p className="text-sm text-gray-600">Select the standard production times for insoles</p>
                    <button className="mt-2 px-4 py-2 border rounded hover:bg-gray-50">Standardzeit auswählen</button>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">Ab wann Lagerstand gering sein soll</h2>
                    <p className="text-sm text-gray-600">Define when a product should be marked as having low stock</p>
                    <button className="mt-2 px-4 py-2 border rounded hover:bg-gray-50">Schwellenwert angeben</button>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">MITARBEITER für Einlagenherstellung</h2>
                    <p className="text-sm text-gray-600">Select employees</p>
                    <button className="mt-2 px-4 py-2 border rounded hover:bg-gray-50">Mitarbeiter auswählen</button>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">PREISE für Einlagen</h2>
                    <p className="text-sm text-gray-600">Set standard prices</p>
                    <button className="mt-2 px-4 py-2 border rounded hover:bg-gray-50">Standardpreis festlegen</button>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">GESCHÄFTSSTANDORTE</h2>
                    <p className="text-sm text-gray-600">Manage and configure your different business locations</p>
                    <button className="mt-2 px-4 py-2 border rounded hover:bg-gray-50">Bankonto und Rhythmus angeben</button>
                </div>
            </section>
        </div>
    )
}
