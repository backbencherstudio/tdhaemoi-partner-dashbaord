'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import NoteAdd from '@/components/CustomerHistory/NoteAdd/NoteAdd';
import Link from 'next/link';
import Image from 'next/image';
import emailImg from '@/public/CustomerHistory/email.png';
import shoesImg from '@/public/CustomerHistory/shoes.png';
import logo from '@/public/CustomerHistory/logo.png';
import folderImg from '@/public/CustomerHistory/folder.png';
import LegImg from '@/public/CustomerHistory/leg.png';
import ShoePurchasesMade from '@/components/CustomerHistory/ShoePurchasesMade/ShoePurchasesMade';
import TreatmentsCarriedOut from '@/components/CustomerHistory/TreatmentsCarriedOut/TreatmentsCarriedOut';
import ScansPromoted from '@/components/CustomerHistory/ScansPromoted/ScansPromoted';
import Reviews from '@/components/CustomerHistory/Reviews/Reviews';
import userload from '@/public/images/scanning/userload.png'
import scanImg from '@/public/images/history/scan.png'

interface CustomerData {
    nameKunde: string;
    EMail: string;
    Address?: string;
    Cap?: string;
    Wohnort?: string;
    Telefon?: string;
    Geschäftstandort?: string;
    Country?: string;
    Geburtsdatum: string;
    id: number;
    createdAt: string;
    Geschlecht?: string;
}

export default function CustomerHistory() {
    const params = useParams();
    const [customerData, setCustomerData] = useState<CustomerData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await fetch('/data/userData.json');
                const data = await response.json();
                const customer = data.find((item: CustomerData) => item.id === Number(params.id));
                setCustomerData(customer || null);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching customer data:', error);
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [params.id]);

    const handleInputChange = (key: keyof CustomerData, value: string) => {
        if (customerData) {
            setCustomerData({
                ...customerData,
                [key]: value
            });
        }
    };

    // Helper to split nameKunde into first and last name
    function splitName(fullName: string) {
        const parts = fullName.split(' ');
        return {
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' ') || '',
        };
    }

    // Helper to format date as DD.MM.YYYY
    function formatDate(dateStr: string) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('de-DE');
    }

    if (loading) return <div>Loading...</div>;
    if (!customerData) return <div>Customer not found</div>;

    const { firstName, lastName } = splitName(customerData.nameKunde);


    const handleVersorgung = () => {
        router.push('/dashboard/versorgungs');
    }

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-3xl font-bold mb-0">Benutzer {customerData.nameKunde}</h1>
            <p className="text-sm mb-4">Kunde seit {formatDate(customerData.createdAt)}</p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button className="bg-[#62A07C] text-white px-6 py-2 rounded border border-black">Stammdaten</button>
                <button className="bg-gray-300 text-black px-6 py-2 rounded">Erweitert</button>
            </div>

            {/* Gender selection */}
            <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 border px-4 py-2 rounded-md">
                    <input
                        type="radio"
                        name="geschlecht"
                        checked={customerData.Geschlecht === 'Mann'}
                        readOnly
                    />
                    Mann
                </label>
                <label className="flex items-center gap-2 border px-4 py-2 rounded-md">
                    <input
                        type="radio"
                        name="geschlecht"
                        checked={customerData.Geschlecht === 'Frau'}
                        readOnly
                    />
                    Frau
                </label>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    className="p-2 border rounded-md border-gray-500"
                    placeholder="Vorname"
                    value={firstName}
                    readOnly
                />
                <input
                    type="text"
                    className="p-2 border rounded-md border-gray-500"
                    placeholder="Nachname"
                    value={lastName}
                    readOnly
                />
                <input
                    type="text"
                    className="p-2 border rounded-md border-gray-500"
                    placeholder="Geburtsdatum"
                    value={customerData.Geburtsdatum}
                    readOnly
                />
                <input
                    type="text"
                    className="p-2 border rounded-md border-gray-500"
                    placeholder="E-Mail"
                    value={customerData.EMail}
                    readOnly
                />
                <input
                    type="text"
                    className="p-2 border rounded-md border-gray-500"
                    placeholder="Adresse"
                    value={customerData.Wohnort}
                    readOnly
                />
                <input
                    type="text"
                    className="p-2 border rounded-md border-gray-500"
                    placeholder="Land"
                    value={customerData.Country || ''}
                    readOnly
                />
                <input
                    type="text"
                    className="p-2 border rounded-md border-gray-500"
                    placeholder="Ort"
                    value={customerData.Geschäftstandort || ''}
                    readOnly
                />
                <input
                    type="text"
                    className="p-2 border rounded-md border-gray-500"
                    placeholder="Telefon"
                    value={customerData.Telefon || ''}
                    readOnly
                />
            </div>

            <div className="flex gap-8 my-10">
                {/* Versorgung starten */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={handleVersorgung}
                        className="p-5 flex items-center justify-center rounded-2xl border border-black bg-white hover:bg-gray-100 transition cursor-pointer"
                    >
                        <Image src={userload} alt="Versorgung starten" width={70} height={70} />
                    </button>
                    <span className="mt-2 text-center text-sm font-normal">Scan ansehen-</span>
                    <span className="text-center text-sm font-normal"> Versorgung starten</span>
                </div>
                {/* Kundendaten -historie */}
                <div className="flex flex-col items-center">
                    <button
                        // onClick={handleVersorgungsPage}
                        className="p-2 flex items-center justify-center rounded-2xl border border-black bg-white hover:bg-gray-100 transition cursor-pointer"
                    >
                        <Image src={scanImg} alt="Versorgung starten" width={70} height={70} />
                    </button>
                    <span className="mt-2 text-center text-sm font-normal">Scan durchführen</span>
                </div>
            </div>

            {/* The rest of your page remains unchanged */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {/* <div>
                    <h3 className="font-semibold mb-2">Notizen</h3>
                    <div className="border rounded-lg p-4 border-gray-500">
                        <div className="h-32"></div>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Gesamt Auszufuhren</h3>
                    <div className="border rounded-lg p-4 border-gray-500">
                        <div className="h-32"></div>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Gesamt zu Verrechnen</h3>
                    <div className="border rounded-lg p-4 border-gray-500">
                        <div className="h-32"></div>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Nicht Bezahlte Rechnung</h3>
                    <div className="border rounded-lg p-4 border-gray-500">
                        <div className="h-32"></div>
                    </div>
                </div> */}
            </div>
            {/* note Table */}
            <NoteAdd />
            {/* some link button */}
            <div>
                <div className="mt-8  gap-10 flex text-center justify-center flex-wrap">


                    <div className="flex flex-col items-center">
                        <Link href="/dashboard/email" className="p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full  relative transition-all duration-300">
                            <Image src={emailImg} alt="Kundenordner" width={50} height={50} className='w-11 h-auto' />

                        </Link>
                        <span className="text-sm">Schuh reservieren</span>
                    </div>
                    {/* <div className="flex flex-col items-center">
                        <Link href="" className="p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full mb-2 relative transition-all duration-300">
                            <Image src={shoesImg} alt="Kundenordner" width={50} height={50} className='w-11 h-auto' />

                        </Link>
                        <span className="text-sm">Schuh reservieren</span>
                    </div> */}

                    {/* <div className="flex flex-col items-center">
                        <Link href="" className="p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full  relative transition-all duration-300">
                            <Image src={logo} alt="Kundendaten" width={50} height={50} className='w-10 h-auto' />
                        </Link>
                        <span className="text-sm">Zugang FeetF1rst App</span>
                    </div> */}

                    <div className="flex flex-col items-center">
                        <Link href=" " className="p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full relative transition-all duration-300">
                            <Image src={folderImg} alt="Schuhfinder" width={50} height={50} className='w-11 h-auto' />

                        </Link>
                        <span className="text-sm">Kundenordner</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <Link href="" className="p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full relative transition-all duration-300">
                            <Image src={LegImg} alt="Email" width={40} height={40} className='w-9 h-auto' />
                        </Link>
                        <span className="text-sm">Einlagenherstellung</span>
                    </div>


                </div>
            </div>

            {/* ShoePurchasesMade  */}

            <div>

                <ShoePurchasesMade />
                <ScansPromoted />
                <TreatmentsCarriedOut />
                <Reviews />
            </div>

        </div>
    )
}
