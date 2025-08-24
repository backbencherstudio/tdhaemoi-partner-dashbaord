'use client'
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSingleCustomer } from '@/hooks/customer/useSingleCustomer'
import NoteAdd from '@/components/CustomerHistory/NoteAdd/NoteAdd';
import Link from 'next/link';
import Image from 'next/image';
import emailImg from '@/public/CustomerHistory/email.png';
import folderImg from '@/public/CustomerHistory/folder.png';
import LegImg from '@/public/CustomerHistory/leg.png';
import ShoePurchasesMade from '@/components/CustomerHistory/ShoePurchasesMade/ShoePurchasesMade';
import TreatmentsCarriedOut from '@/components/CustomerHistory/TreatmentsCarriedOut/TreatmentsCarriedOut';
import ScansPromoted from '@/components/CustomerHistory/ScansPromoted/ScansPromoted';
import Reviews from '@/components/CustomerHistory/Reviews/Reviews';
import userload from '@/public/images/scanning/userload.png'
import scanImg from '@/public/images/history/scan.png'
import AdvancedFeaturesModal from '@/app/(dashboard)/dashboard/_components/Customers/AdvancedFeaturesModal'

export default function CustomerHistory() {
    const params = useParams();
    const router = useRouter();
    const { customer: scanData, loading, error } = useSingleCustomer(String(params.id));
    const [activeTab, setActiveTab] = useState<'scans' | 'shoes' | 'versorgungen' | 'reviews'>('scans');


    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!scanData) return <div className="p-4">Customer not found</div>;

    const handleVersorgung = () => {
        router.push('/dashboard/versorgungs');
    }

    return (
        <div className="p-4 space-y-6">

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{scanData.vorname} {scanData.nachname}</h1>
            </div>


            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button className="bg-[#62A07C] text-white px-6 py-2 rounded border border-black">
                    Stammdaten
                </button>

                {/* Erweitert Button with Modal */}
                <AdvancedFeaturesModal
                    scanData={scanData}
                    trigger={
                        <button className="bg-gray-300 cursor-pointer text-black px-6 py-2 rounded hover:bg-gray-400 transition">
                            Erweitert
                        </button>
                    }
                />
            </div>

            {/* Basic Customer Info*/}
            <div className="space-y-6 mb-6">
                {/* Gender Selection */}
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 border px-4 py-2 rounded-md bg-gray-50">
                        <input
                            type="radio"
                            name="geschlecht"
                            checked={scanData.geschlecht === 'Mann'}
                            readOnly
                            className="cursor-pointer"
                        />
                        <span className="text-sm font-medium">Mann</span>
                    </label>
                    <label className="flex items-center gap-2 border px-4 py-2 rounded-md bg-gray-50">
                        <input
                            type="radio"
                            name="geschlecht"
                            checked={scanData.geschlecht === 'Frau'}
                            readOnly
                            className="cursor-pointer"
                        />
                        <span className="text-sm font-medium">Frau</span>
                    </label>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md border-gray-300 bg-gray-50"
                            value={scanData.vorname || '-'}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nachname</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md border-gray-300 bg-gray-50"
                            value={scanData.nachname || '-'}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Geburtsdatum</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md border-gray-300 bg-gray-50"
                            value={scanData.geburtsdatum || '-'}
                            readOnly
                        />
                    </div>
                </div>

                {/* Contact and Address */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md border-gray-300 bg-gray-50"
                            value={scanData.email || '-'}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Straße</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md border-gray-300 bg-gray-50"
                            value={scanData.strasse || '-'}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Land</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md border-gray-300 bg-gray-50"
                            value={scanData.land || '-'}
                            readOnly
                        />
                    </div>
                </div>

                {/* Additional Location and Contact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ort</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md border-gray-300 bg-gray-50"
                            value={scanData.wohnort || '-'}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md border-gray-300 bg-gray-50"
                            value={scanData.telefonnummer || '-'}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kunden-ID</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md border-gray-300 bg-gray-50"
                            value={scanData.id || '-'}
                            readOnly
                        />
                    </div>
                </div>
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
                        className="p-2 flex items-center justify-center rounded-2xl border border-black bg-white hover:bg-gray-100 transition cursor-pointer"
                    >
                        <Image src={scanImg} alt="Versorgung starten" width={70} height={70} />
                    </button>
                    <span className="mt-2 text-center text-sm font-normal">Scan durchführen</span>
                </div>
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

            {/* Responsive Button Group */}
            <div className="-mx-4">
                <div className="overflow-x-auto flex-nowrap py-6 px-4 w-full min-w-0 scrollbar-hide">
                    <div className="flex gap-4 min-w-max mx-auto md:justify-center">
                        <button
                            className={`min-w-[220px] cursor-pointer px-6 py-2 border border-black font-semibold text-center text-sm md:text-base rounded transition-all shadow-sm ${activeTab === 'scans' ? 'bg-white' : 'bg-gray-200'}`}
                            onClick={() => setActiveTab('scans')}
                        >
                            DURCHGEFÜHRTE SCANS
                        </button>
                        <button
                            className={`min-w-[220px] cursor-pointer px-6 py-2 border border-black font-semibold text-center text-sm md:text-base rounded transition-all ${activeTab === 'shoes' ? 'bg-white' : 'bg-gray-200'}`}
                            onClick={() => setActiveTab('shoes')}
                        >
                            DURCHGEFÜHRTE SCHUHKÄUFE
                        </button>
                        <button
                            className={`min-w-[220px] cursor-pointer px-6 py-2 border border-black font-semibold text-center text-sm md:text-base rounded transition-all ${activeTab === 'versorgungen' ? 'bg-white' : 'bg-gray-200'}`}
                            onClick={() => setActiveTab('versorgungen')}
                        >
                            DURCHGEFÜHRTE VERSORGUNGEN
                        </button>
                        <button
                            className={`min-w-[220px] cursor-pointer px-6 py-2 border border-black font-semibold text-center text-sm md:text-base rounded transition-all ${activeTab === 'reviews' ? 'bg-white' : 'bg-gray-200'}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            BEWERTUNGEN
                        </button>
                        <div className="min-w-[16px]" />
                    </div>
                </div>
            </div>

            {/* Tab content */}
            <div>
                {activeTab === 'scans' && <ScansPromoted />}
                {activeTab === 'shoes' && <ShoePurchasesMade />}
                {activeTab === 'versorgungen' && <TreatmentsCarriedOut />}
                {activeTab === 'reviews' && <Reviews />}
            </div>
        </div>
    )
}
