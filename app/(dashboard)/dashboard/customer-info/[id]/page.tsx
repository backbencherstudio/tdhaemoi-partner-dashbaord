'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useSingleCustomer } from '@/hooks/customer/useSingleCustomer'
import Image from 'next/image'
import ImagePreviewModal from '@/components/CustomerModal/ImagePreviewModal'
import userload from '@/public/images/scanning/userload.png'
import userImg from '@/public/images/scanning/user.png'
import { useRouter } from 'next/navigation'
import ScanDataDisplay from '@/components/Shared/ScanDataDisplay'
import Loading from '@/components/Shared/Loading'

export default function CustomerInfo() {
    const router = useRouter();
    const params = useParams();
    const { customer: scanData, loading, error } = useSingleCustomer(String(params.id));

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImg, setModalImg] = useState<string | null>(null);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalType, setModalType] = useState<'image' | 'stl' | null>(null);
    const [stlUrl, setStlUrl] = useState<string | null>(null);
    const [isVersorgungLoading, setIsVersorgungLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [filteredData, setFilteredData] = useState(scanData);
    const openModal = (img: string | null, title: string) => {
        setModalImg(img);
        setModalTitle(title);
        setModalType('image');
        setStlUrl(null);
        setModalOpen(true);
    };

    const openStlModal = (stl: string | null, title: string) => {
        setStlUrl(stl);
        setModalTitle(title);
        setModalType('stl');
        setModalImg(null);
        setModalOpen(true);
    };


    if (loading) return <div className="p-4 flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!scanData) return <div className="p-4">Customer not found</div>;

    // handle versorgungs page
    const handleVersorgungsPage = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsVersorgungLoading(true);
        router.push(`/dashboard/scanning-data/${scanData?.id}`);
    };

    // handle customer history page
    const handleHistoryPage = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsHistoryLoading(true);
        router.push(`/dashboard/customer-history/${scanData?.id}`);
    };

    return (
        <div className="p-4 pb-20">
            {/* Full Page Loading Overlay */}
            {(isVersorgungLoading || isHistoryLoading) && (
                <Loading
                    isFullPage={true}
                    message={isVersorgungLoading ? "Starting Versorgung..." : "Loading Customer History..."}
                />
            )}

            {/* Image Preview Modal */}
            <ImagePreviewModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                modalImg={modalImg}
                modalTitle={modalTitle}
                modalType={modalType}
                stlUrl={stlUrl}
            />

            <div className="mb-6">
                <h1 className="text-2xl font-bold capitalize">
                    {scanData.vorname} {scanData.nachname}
                </h1>

                <div className='mb-6'>
                    <div className="flex gap-8 mt-4">
                        {/* Versorgung starten */}
                        <div className="flex flex-col items-center">
                            <button
                                onClick={handleVersorgungsPage}
                                disabled={isVersorgungLoading}
                                className="p-5 flex items-center justify-center rounded-2xl border border-black bg-white hover:bg-gray-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Image src={userload} alt="Versorgung starten" width={70} height={70} />
                            </button>
                            <span className="mt-2 text-center text-sm font-normal">Versorgung starten</span>
                        </div>
                        {/* Kundendaten -historie */}
                        <div className="flex flex-col items-center">
                            <button
                                onClick={handleHistoryPage}
                                disabled={isHistoryLoading}
                                className="p-5 cursor-pointer flex items-center justify-center rounded-2xl border border-black bg-white hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Image src={userImg} alt="Kundendaten -historie" width={60} height={60} />
                            </button>
                            <span className="mt-2 text-center text-sm font-normal">Kundendaten -historie</span>
                        </div>
                    </div>
                </div>

                {/* Use the reusable ScanDataDisplay component */}
                <ScanDataDisplay
                    scanData={scanData}
                    isEditable={false}
                    onDataChange={setFilteredData}
                />
            </div>

            {/* button section - now using data directly from scanData */}
            <div className="mt-8 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                <div className="flex justify-center md:justify-start">
                    <div className="flex flex-wrap space-x-2">
                        <button className="border border-gray-300 cursor-pointer bg-white hover:bg-gray-100 px-4 py-1 text-sm my-1" onClick={() => openModal(filteredData?.picture_10 || null, 'Fersenneigung (Links)')}>Fersenneigung</button>
                        <button className="border border-gray-300 cursor-pointer bg-white hover:bg-gray-100 px-4 py-1 text-sm relative my-1" onClick={() => openModal(filteredData?.picture_23 || null, 'Plantaransicht (Links)')}>Plantaransicht</button>
                        <button className="border border-gray-300 cursor-pointer  bg-white hover:bg-gray-100 px-4 py-1 text-sm my-1" onClick={() => openStlModal(filteredData?.threed_model_left || null, '3D-Modell (Links)')}>3D-Modell</button>
                        <button className="border border-gray-300 cursor-pointer bg-white hover:bg-gray-100 px-4 py-1 text-sm my-1" onClick={() => openModal(filteredData?.picture_17 || null, 'Sohlen Index (Links)')}>Sohlen Index</button>
                    </div>
                </div>

                <div className="flex justify-center md:justify-end">
                    <div className="flex flex-wrap space-x-2">
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1" onClick={() => openModal(filteredData?.picture_11 || null, 'Fersenneigung (Rechts)')}>Fersenneigung</button>
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1" onClick={() => openModal(filteredData?.picture_24 || null, 'Plantaransicht (Rechts)')}>Plantaransicht</button>
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1" onClick={() => openStlModal(filteredData?.threed_model_right || null, '3D-Modell (Rechts)')}>3D-Modell</button>
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1" onClick={() => openModal(filteredData?.picture_16 || null, 'Sohlen Index (Rechts)')}>Sohlen Index</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
