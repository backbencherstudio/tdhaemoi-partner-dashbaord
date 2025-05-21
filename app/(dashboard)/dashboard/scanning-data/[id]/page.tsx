'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { BiSolidEdit } from 'react-icons/bi';
import { RiArrowDownSLine } from 'react-icons/ri';

interface ScanData {
    id: number;
    nameKunde: string;
    createdAt: string;
    Geschäftstandort: string;
    Fusslänge: string;
    Fusslänge2: string;
    Fussbreite: string;
    Fussbreite2: string;
    Kugelumfang: string;
    Kugelumfang2: string;
    Rist: string;
    Rist2: string;
    Zehentyp: string;
    Zehentyp2: string;
}

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

export default function ScanningData() {
    const params = useParams();
    const [scanData, setScanData] = useState<ScanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDiagnosisDropdown, setShowDiagnosisDropdown] = useState(false);

    // For editable text fields
    const [diagnosis, setDiagnosis] = useState(
        "Der Kunde hat eine starken Unterschied der Fusslänge zwischen beiden Füßen. Dazu rechts eine stärkere Fersenneigung. Der Index der Plantarsohle ist etwas zu niedrig und es tendiert zu einem leichten Hohlfuss."
    );
    const [editingDiagnosis, setEditingDiagnosis] = useState(false);

    const [supply, setSupply] = useState(
        "Rohling 339821769, mit Pelotte Nr. 10 und Micro Elastisch"
    );
    const [editingSupply, setEditingSupply] = useState(false);

    const [selectedDiagnosis, setSelectedDiagnosis] = useState("");

    useEffect(() => {
        const fetchScanData = async () => {
            try {
                const response = await fetch('/data/userData.json');
                const data = await response.json();
                const scan = data.find((item: ScanData) => item.id === Number(params.id));
                setScanData(scan || {
                    id: 1,
                    nameKunde: "Haidacher Damian",
                    createdAt: "19.09.2025",
                    Geschäftstandort: "",
                    Fusslänge: "2876",
                    Fusslänge2: "2897",
                    Fussbreite: "108.9",
                    Fussbreite2: "108.7",
                    Kugelumfang: "254.9",
                    Kugelumfang2: "256.8",
                    Rist: "140.5",
                    Rist2: "150.6",
                    Zehentyp: "Ägyptisch",
                    Zehentyp2: "Griechisch"
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching scan data:', error);
                setLoading(false);
            }
        };

        fetchScanData();
    }, [params.id]);

    const handleDiagnosisEdit = () => {
        setEditingDiagnosis(true);
    };

    const handleDiagnosisBlur = () => {
        setEditingDiagnosis(false);
        // Here you could save the updated diagnosis to your backend
        console.log("Saving diagnosis:", diagnosis);
    };

    const handleSupplyEdit = () => {
        setEditingSupply(true);
    };

    const handleSupplyBlur = () => {
        setEditingSupply(false);
        // Here you could save the updated supply to your backend
        console.log("Saving supply:", supply);
    };

    const handleDiagnosisSelect = (diagnosis: string) => {
        setSelectedDiagnosis(diagnosis);
        setShowDiagnosisDropdown(false);
        // Here you could save the selected diagnosis to your backend
        console.log("Selected diagnosis:", diagnosis);
    };

    if (loading) return <div>Loading...</div>;
    if (!scanData) return <div>Scan not found</div>;

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                    <div className="font-bold text-xl">Benutzer {scanData.nameKunde}</div>
                </div>

                <div className="relative w-full md:w-64 ">
                    <input
                        type="text"
                        placeholder="Anderen Kunden suchen..."
                        className="border border-gray-600 rounded-md py-2 px-4 w-full"
                    />
                </div>
            </div>

            <div className="mb-2">
                <span>Scan {scanData.createdAt}</span>
            </div>

            {/* image section */}
            <div className="flex flex-col lg:flex-row justify-between items-center">
                <div className="flex-1 mb-6 lg:mb-0 flex flex-col items-center">
                    <div className="w-60 max-w-md">
                        <Image
                            src="/images/left.png"
                            alt="Left foot scan"
                            width={300}
                            height={500}
                            className="w-full h-auto"
                        />
                    </div>
                </div>

                <div className="flex-1 mx-2 ">
                    <div className="grid grid-cols-2 gap-2 mx-2">
                        <div>
                            <div className="text-center text-gray-600 text-sm">Fusslänge</div>
                            <div className="border border-gray-300 text-center py-1">
                                {scanData.Fusslänge}
                            </div>
                        </div>
                        <div>
                            <div className="text-center text-gray-600 text-sm">Fusslänge</div>
                            <div className="border border-gray-300 text-center py-1">
                                {scanData.Fusslänge2}
                            </div>
                        </div>

                        <div>
                            <div className="text-center text-gray-600 text-sm">Fussbreite</div>
                            <div className="border border-gray-300 text-center py-1">
                                {scanData.Fussbreite}
                            </div>
                        </div>
                        <div>
                            <div className="text-center text-gray-600 text-sm">Fussbreite</div>
                            <div className="border border-gray-300 text-center py-1">
                                {scanData.Fussbreite2}
                            </div>
                        </div>

                        <div>
                            <div className="text-center text-gray-600 text-sm">Kugelumfang</div>
                            <div className="border border-gray-300 text-center py-1">
                                {scanData.Kugelumfang}
                            </div>
                        </div>
                        <div>
                            <div className="text-center text-gray-600 text-sm">Kugelumfang</div>
                            <div className="border border-gray-300 text-center py-1 relative">
                                {scanData.Kugelumfang2}
                            </div>
                        </div>

                        <div>
                            <div className="text-center text-gray-600 text-sm">Rist</div>
                            <div className="border border-gray-300 text-center py-1">
                                {scanData.Rist}
                            </div>
                        </div>
                        <div>
                            <div className="text-center text-gray-600 text-sm">Rist</div>
                            <div className="border border-gray-300 text-center py-1">
                                {scanData.Rist2}
                            </div>
                        </div>

                        <div>
                            <div className="text-center text-gray-600 text-sm">Zehentyp</div>
                            <div className="border border-gray-300 text-center py-1">
                                {scanData.Zehentyp}
                            </div>
                        </div>
                        <div>
                            <div className="text-center text-gray-600 text-sm">Zehentyp</div>
                            <div className="border border-gray-300 text-center py-1">
                                {scanData.Zehentyp2}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="mb-6">
                            <div className="text-xs text-center mb-1 flex justify-between">
                                <span>Left</span>
                                <span>Right</span>
                            </div>
                            <div className="text-xs text-center font-bold">Heel Angle</div>
                            <div className="flex items-center justify-center mb-1">
                                <span className="text-xs mr-1">4 Eve</span>
                                <span className="text-xs ml-1">4 Eve</span>
                            </div>
                            <div className="flex h-4 overflow-hidden rounded-sm">
                                <div className="bg-teal-500 flex-1"></div>
                                <div className="bg-yellow-500 flex-1"></div>
                                <div className="bg-amber-600 flex-1"></div>
                                <div className="bg-red-600 flex-1"></div>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-center mb-1 flex justify-between">
                                <span>Left</span>
                                <span>Right</span>
                            </div>
                            <div className="text-xs text-center font-bold">Hallux Angle</div>
                            <div className="flex items-center justify-center mb-1">
                                <span className="text-xs mr-1">6.2</span>
                                <span className="text-xs ml-1">2.6</span>
                            </div>
                            <div className="flex h-4 overflow-hidden rounded-sm">
                                <div className="bg-teal-500 flex-1"></div>
                                <div className="bg-yellow-500 flex-1"></div>
                                <div className="bg-amber-600 flex-1"></div>
                                <div className="bg-red-600 flex-1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 mb-6 lg:mb-0 flex flex-col items-center">
                    <div className="w-60 max-w-md">
                        <Image
                            src="/images/right.png"
                            alt="Right foot scan"
                            width={300}
                            height={500}
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </div>


            {/* button section */}
            <div className="mt-8 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                <div className="flex justify-center md:justify-start">
                    <div className="flex flex-wrap space-x-2">
                        <button className="border border-gray-300 bg-white px-4 py-1 text-sm my-1">
                            Fersenneigung
                        </button>
                        <button className="border border-gray-300 bg-[#62A07C] px-4 py-1 text-sm relative my-1">
                            Plantaransicht
                        </button>
                        <button className="border border-gray-300 bg-white px-4 py-1 text-sm my-1">
                            3D-Modell
                        </button>
                        <button className="border border-gray-300 bg-white px-4 py-1 text-sm my-1">
                            Sohlen Index
                        </button>
                    </div>
                </div>

                <div className="flex justify-center md:justify-end">
                    <div className="flex flex-wrap space-x-2">
                        <button className="border border-gray-300 bg-white px-4 py-1 text-sm my-1">
                            Fersenneigung
                        </button>
                        <button className="border border-gray-300 bg-[#62A07C] px-4 py-1 text-sm my-1">
                            Plantaransicht
                        </button>
                        <button className="border border-gray-300 bg-white px-4 py-1 text-sm my-1">
                            3D-Modell
                        </button>
                        <button className="border border-gray-300 bg-white px-4 py-1 text-sm my-1">
                            Sohlen Index
                        </button>
                    </div>
                </div>
            </div>


            <hr className='my-10 border-gray-500' />

            {/* input section */}
            <div className=' mt-10'>
                {/* Diagnosis and Supply Editable Fields */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold">Ausführliche Diagnose</h3>
                            <button
                                onClick={handleDiagnosisEdit}
                                className="ml-3 "
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
                                onClick={handleSupplyEdit}
                                className="ml-3 "
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



                {/* Diagnosis Dropdown */}
                <div className="mb-8 relative">
                    <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold">Diagnose auswählen</h3>
                        <button
                            onClick={() => setShowDiagnosisDropdown(!showDiagnosisDropdown)}
                            className="ml-3 "
                        >
                            <RiArrowDownSLine className='text-gray-900 text-xl' />
                        </button>
                    </div>
                    <div className="relative">
                        <div
                            className="p-2 border border-gray-300 rounded cursor-pointer flex justify-between items-center"
                            onClick={() => setShowDiagnosisDropdown(!showDiagnosisDropdown)}
                        >
                            <span>{selectedDiagnosis || "Diagnose auswählen"}</span>
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


                {/* Bottom Action Links */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-gray-100 rounded-full mb-2 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>

                        </div>
                        <span className="text-sm">Werkstattzettel<br />ausdrucken</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-gray-100 rounded-full mb-2 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>

                        </div>
                        <span className="text-sm">Kundenordner</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-gray-100 rounded-full mb-2 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>

                        </div>
                        <span className="text-sm">Kundendaten und -<br />historie</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-gray-100 rounded-full mb-2 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                            </svg>

                        </div>
                        <span className="text-sm">Shoe Finder</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-gray-100 rounded-full mb-2 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>

                        </div>
                        <span className="text-sm">Email kontaktieren</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-gray-100 rounded-full mb-2 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>

                        </div>
                        <span className="text-sm">Zugang FeetFirst<br />App</span>
                    </div>
                </div>
            </div>
        </div>
    );
}