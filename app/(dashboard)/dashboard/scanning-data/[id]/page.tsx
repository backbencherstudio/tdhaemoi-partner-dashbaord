'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import fxImg from '@/public/images/scanning/fax.png'
import folderImg from '@/public/images/scanning/folder.png'
import userImg from '@/public/images/scanning/user.png'
import shoesImg from '@/public/images/scanning/shoes.png'
import emailImg from '@/public/images/scanning/email.png'
import logoImg from '@/public/images/scanning/logo.png'
import Link from 'next/link';
import SacnningForm from '../../_components/Scanning/SacnningForm';
import DataModal from '../../_components/Scanning/DataModal';
import ScannningDataPage from '../../_components/ScannningData/ScannningDataPage';
import { getSingleCustomer } from '@/apis/customerApis';
interface ScanData {
    id: string;
    vorname: string;
    nachname: string;
    email: string;
    telefonnummer: string;
    wohnort: string;
    picture_10: string;
    picture_23: string;
    threed_model_left: string;
    picture_17: string;
    picture_11: string;
    picture_24: string;
    threed_model_right: string;
    picture_16: string;
    fusslange1: string;
    fusslange2: string;
    fussbreite1: string;
    fussbreite2: string;
    kugelumfang1: string;
    kugelumfang2: string;
    rist1: string;
    rist2: string;
    zehentyp1: string;
    zehentyp2: string;
    archIndex1: string;
    archIndex2: string;
    createdAt: string;
    updatedAt: string;
}



export default function ScanningData() {
    const params = useParams();
    const [scanData, setScanData] = useState<ScanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [supply] = useState(
        "Rohling 339821769, mit Pelotte Nr. 10 und Micro Elastisch"
    );



    // Add this state for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchScanData = async () => {
            try {
                const data = await getSingleCustomer(String(params.id));
                setScanData(data.data); // Only set the customer object
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        fetchScanData();
    }, [params.id]);


    // Add this function to handle modal opening
    const handleWerkstattzettleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    };
    if (loading) return <div>Loading...</div>;
    if (!scanData) return <div>Scan not found</div>;



    return (
        <div className="p-4">
            <ScannningDataPage scanData={scanData} />
            <hr className='my-10 border-gray-500' />
            {/*  form section */}
            <SacnningForm />
            {/* Bottom Action Links */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center mb-20">
                <div className="flex flex-col items-center">
                    <div
                        onClick={handleWerkstattzettleClick}
                        className="p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full mb-2 relative transition-all duration-300"
                    >
                        <Image src={fxImg} alt="Werkstattzettel" width={50} height={50} className='w-11 h-auto' />
                    </div>
                    <span className="text-sm">Werkstattzettel<br />ausdrucken</span>
                </div>

                <div className="flex flex-col items-center">
                    <Link href="" className="p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full mb-2 relative transition-all duration-300">
                        <Image src={folderImg} alt="Kundenordner" width={50} height={50} className='w-10 h-auto' />

                    </Link>
                    <span className="text-sm">Kundenordner</span>
                </div>

                <div className="flex flex-col items-center">
                    <Link href={`/dashboard/customer-history/${scanData.id}`} className="p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full mb-2 relative transition-all duration-300">
                        <Image src={userImg} alt="Kundendaten" width={50} height={50} className='w-10 h-auto' />
                    </Link>
                    <span className="text-sm">Kundendaten und - historie</span>
                </div>

                <div className="flex flex-col items-center">
                    <Link href=" " className="p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full mb-2 relative transition-all duration-300">
                        <Image src={shoesImg} alt="Schuhfinder" width={50} height={50} className='w-12 h-auto' />

                    </Link>
                    <span className="text-sm">Shoe Finder</span>
                </div>

                <div className="flex flex-col items-center">
                    <Link href="/dashboard/email" className="p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full mb-2 relative transition-all duration-300">
                        <Image src={emailImg} alt="Email" width={50} height={50} className='w-11 h-auto' />
                    </Link>
                    <span className="text-sm">Email kontaktieren</span>
                </div>

                <div className="flex flex-col items-center">
                    <Link href="" className="p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full mb-2 relative transition-all duration-300">
                        <Image src={logoImg} alt="Zugang FeetFirst App" width={50} height={50} className='w-11 h-auto' />
                    </Link>
                    <span className="text-sm">Zugang FeetFirst<br />App</span>
                </div>
            </div>

            {/* Add the Modal */}
            <DataModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} scanData={{
                nameKunde: scanData ? `${scanData.vorname} ${scanData.nachname}` : '',
                Geschäftstandort: scanData ? scanData.wohnort : ''
            }} supply={supply} />
        </div>
    );
}