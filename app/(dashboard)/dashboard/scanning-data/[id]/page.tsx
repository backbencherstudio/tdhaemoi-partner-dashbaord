'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { RiArrowDownSLine } from 'react-icons/ri';
import fxImg from '@/public/images/scanning/fax.png'
import folderImg from '@/public/images/scanning/folder.png'
import userImg from '@/public/images/scanning/user.png'
import shoesImg from '@/public/images/scanning/shoes.png'
import emailImg from '@/public/images/scanning/email.png'
import logoImg from '@/public/images/scanning/logo.png'
import Link from 'next/link';
import SacnningForm from '../../_components/Scanning/SacnningForm';
import DataModal from '../../_components/Scanning/DataModal';
import QuestionSection from '../../_components/Scanning/QuestionSection';

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



export default function ScanningData() {
    const params = useParams();
    const [scanData, setScanData] = useState<ScanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [supply, setSupply] = useState(
        "Rohling 339821769, mit Pelotte Nr. 10 und Micro Elastisch"
    );


    // Add this state for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);

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


    // Add this function to handle modal opening
    const handleWerkstattzettleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    };
    if (loading) return <div>Loading...</div>;
    if (!scanData) return <div>Scan not found</div>;

    return (
        <div className="p-4">
            <div className='flex flex-col md:flex-row justify-between items-start mb-6 gap-4'>
                <div className='w-full md:w-7/12'>
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="font-bold text-xl">Benutzer {scanData.nameKunde}</div>
                    </div>

                    <div className="mb-2 flex items-center gap-2">
                        <span>Scan {scanData.createdAt}</span>
                        <RiArrowDownSLine className='text-gray-900 text-2xl' />
                    </div>

                    {/* image section */}
                    <div className="flex flex-col lg:flex-row justify-between items-center">
                        <div className="flex-1 mb-6 lg:mb-0 flex flex-col items-center">
                            <div className="w-50 max-w-sm">
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
                            <div className="w-50 max-w-sm">
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
                </div>
                <div className='w-full md:w-5/12'>
                    <QuestionSection />
                </div>
            </div>

            {/* button section */}
            <div className="mt-8 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                <div className="flex justify-center md:justify-start">
                    <div className="flex flex-wrap space-x-2">
                        <button className="border border-gray-300 cursor-pointer bg-white hover:bg-gray-100 px-4 py-1 text-sm my-1">
                            Fersenneigung
                        </button>
                        <button className="border border-gray-300 cursor-pointer bg-[#62A07C] hover:bg-gray-100 px-4 py-1 text-sm relative my-1">
                            Plantaransicht
                        </button>
                        <button className="border border-gray-300 cursor-pointer  bg-white hover:bg-gray-100 px-4 py-1 text-sm my-1">
                            3D-Modell
                        </button>
                        <button className="border border-gray-300 cursor-pointer bg-white hover:bg-gray-100 px-4 py-1 text-sm my-1">
                            Sohlen Index
                        </button>
                    </div>
                </div>

                <div className="flex justify-center md:justify-end">
                    <div className="flex flex-wrap space-x-2">
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1">
                            Fersenneigung
                        </button>
                        <button className="border border-gray-300 bg-[#62A07C] px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1">
                            Plantaransicht
                        </button>
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1">
                            3D-Modell
                        </button>
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1">
                            Sohlen Index
                        </button>
                    </div>
                </div>
            </div>
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
            <DataModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} scanData={scanData} supply={supply} />
        </div>
    );
}