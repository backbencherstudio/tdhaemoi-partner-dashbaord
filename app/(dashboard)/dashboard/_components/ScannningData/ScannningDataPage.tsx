'use client'
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { RiArrowDownSLine } from 'react-icons/ri';
import userload from '@/public/images/scanning/userload.png'
import userImg from '@/public/images/scanning/user.png'
import { MdZoomOutMap } from 'react-icons/md';
import { TfiReload } from 'react-icons/tfi';
import QuestionSection from '../Scanning/QuestionSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import { updateSingleCustomer } from '@/apis/customerApis';
import toast from 'react-hot-toast';
import { User2 } from 'lucide-react';
import AddCustomerModal from '@/components/AddCustomerModal/AddCustomerModal';
import leftImage from '@/public/images/left.png';
import rightImage from '@/public/images/right.png';
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

export default function ScannningDataPage({ scanData }: { scanData: ScanData }) {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImg, setModalImg] = useState<string | null>(null);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalType, setModalType] = useState<'image' | 'stl' | null>(null);
    const [stlUrl, setStlUrl] = useState<string | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    // State for editable scan data
    const [editableData, setEditableData] = useState({
        fusslange1: scanData.fusslange1,
        fusslange2: scanData.fusslange2,
        fussbreite1: scanData.fussbreite1,
        fussbreite2: scanData.fussbreite2,
        kugelumfang1: scanData.kugelumfang1,
        kugelumfang2: scanData.kugelumfang2,
        rist1: scanData.rist1,
        rist2: scanData.rist2,
        zehentyp1: scanData.zehentyp1,
        zehentyp2: scanData.zehentyp2,
    });

    // Check if any field has changed
    const [originalData, setOriginalData] = useState(editableData);
    const isChanged = Object.keys(editableData).some(
        (key) => editableData[key as keyof typeof editableData] !== originalData[key as keyof typeof originalData]
    );

    // Handle input changes
    const handleInputChange = (field: string, value: string) => {
        setEditableData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle save changes
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const handleSaveChanges = async () => {
        setSaving(true);
        setSaveError(null);
        try {
            const formData = new FormData();
            Object.entries(editableData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            await updateSingleCustomer(scanData.id, formData);
            setOriginalData(editableData);
            toast.success('Scan data updated successfully!');
        } catch (err: any) {
            setSaveError(err.message || 'Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    // Helper to open modal with image
    const openModal = (img: string | null, title: string) => {
        setModalImg(img);
        setModalTitle(title);
        setModalType('image');
        setStlUrl(null);
        setModalOpen(true);
    };
    // Helper to open modal with STL
    const openStlModal = (stl: string | null, title: string) => {
        setStlUrl(stl);
        setModalTitle(title);
        setModalType('stl');
        setModalImg(null);
        setModalOpen(true);
    };

    // handle versorgungs page
    const handleVersorgungsPage = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push('/dashboard/versorgungs');
    };

    // handle update user modal
    const handleUpdateUser = () => {
        setIsUpdateModalOpen(true);
    };

    // handle customer update submission
    const handleCustomerUpdate = async (customerData: any) => {
        try {
            console.log('Customer updated:', customerData);
            toast.success('Customer updated successfully!');
            setIsUpdateModalOpen(false);
            // Optionally refresh the page or update the scanData
            window.location.reload();
        } catch (error) {
            console.error('Error updating customer:', error);
            toast.error('Failed to update customer');
        }
    };

    const StlModelViewer = dynamic(() => import('@/components/StlModelViewer'), { ssr: false });

    return (
        <>
            {/* Modal for image or STL preview using shadcn Dialog */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-md w-full">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold mb-4">{modalTitle}</DialogTitle>
                    </DialogHeader>
                    {modalType === 'image' && (modalImg ? (
                        <img src={modalImg} alt={modalTitle} className="max-w-full max-h-96 mx-auto" />
                    ) : (
                        <div className="w-full h-60 flex items-center justify-center text-gray-400 border border-dashed border-gray-300">No Preview</div>
                    ))}
                    {modalType === 'stl' && (stlUrl ? (
                        <StlModelViewer url={stlUrl} />
                    ) : (
                        <div className="w-full h-60 flex items-center justify-center text-gray-400 border border-dashed border-gray-300">No 3D Preview</div>
                    ))}
                </DialogContent>
            </Dialog>
            <div className='flex items-center justify-end mb-8'>
                <button
                    onClick={handleUpdateUser}
                    className='bg-[#4A8A6A] cursor-pointer flex items-center justify-center gap-1 text-white px-2 py-1 rounded hover:bg-[#4A8A6A]/80 transition text-sm'
                >
                    <User2 className='text-white' size={20} />
                    Update User
                </button>
            </div>
            <div className='flex flex-col md:flex-row justify-between items-start mb-6 gap-4'>
                <div className='w-full md:w-7/12'>
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="font-bold text-xl capitalize">{scanData.vorname} {scanData.nachname}</div>
                    </div>

                    <div className='mb-10'>
                        <div className="mb-2 flex items-center gap-2">
                            <span>Scan {new Date(scanData.createdAt).toLocaleDateString()}</span>
                            <RiArrowDownSLine className='text-gray-900 text-2xl' />
                        </div>
                        <div className="flex gap-8 mt-4">
                            {/* Versorgung starten */}
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={handleVersorgungsPage}
                                    className="p-5 flex items-center justify-center rounded-2xl border border-black bg-white hover:bg-gray-100 transition cursor-pointer"
                                >
                                    <Image src={userload} alt="Versorgung starten" width={70} height={70} />
                                </button>
                                <span className="mt-2 text-center text-sm font-normal">Versorgung starten</span>
                            </div>
                            {/* Kundendaten -historie */}
                            <div className="flex flex-col items-center">
                                <Link
                                    href={`/dashboard/customer-history/${scanData.id}`}
                                    className="p-5 cursor-pointer flex items-center justify-center rounded-2xl border border-black bg-white hover:bg-gray-100 transition"
                                >
                                    <Image src={userImg} alt="Kundendaten -historie" width={60} height={60} />
                                </Link>
                                <span className="mt-2 text-center text-sm font-normal">Kundendaten -historie</span>
                            </div>
                        </div>
                    </div>

                    {/* image section */}
                    <div className="flex flex-col lg:flex-row justify-between items-center">
                        <div className="flex-1 mb-6 lg:mb-0 flex flex-col items-center">
                            <div className="w-50 max-w-sm">
                                <Image
                                    src={leftImage}
                                    alt="Left foot scan"
                                    width={300}
                                    height={500}
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>


                        {/* scan data section */}
                        <div className="flex-1 mx-2 ">
                            <div className='flex items-center justify-center gap-5 mb-5'>
                                <div className='border border-gray-500 rounded p-1 cursor-pointer hover:bg-gray-100 transition'>
                                    <MdZoomOutMap className='text-gray-600 text-4xl' />
                                </div>
                                <div className='border border-gray-500 rounded p-1 cursor-pointer hover:bg-gray-100 transition'>
                                    <TfiReload className='text-gray-600 text-4xl' />
                                </div>

                                {isChanged && (
                                    <button
                                        onClick={handleSaveChanges}
                                        className='bg-[#4A8A6A] cursor-pointer text-white px-2 py-1 rounded hover:bg-[#4A8A6A]/80 transition text-sm'
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                )}
                                {saveError && (
                                    <span className='ml-2 text-red-600 text-xs'>{saveError}</span>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mx-2">
                                <div>
                                    <div className="text-center text-gray-600 text-sm">Fusslänge</div>
                                    <div className="border border-gray-300 text-center py-1">
                                        <input
                                            type="text"
                                            value={editableData.fusslange1}
                                            onChange={(e) => handleInputChange('fusslange1', e.target.value)}
                                            className="w-full text-center border-none outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-center text-gray-600 text-sm">Fusslänge</div>
                                    <div className="border border-gray-300 text-center py-1">
                                        <input
                                            type="text"
                                            value={editableData.fusslange2}
                                            onChange={(e) => handleInputChange('fusslange2', e.target.value)}
                                            className="w-full text-center border-none outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="text-center text-gray-600 text-sm">Fussbreite</div>
                                    <div className="border border-gray-300 text-center py-1">
                                        <input
                                            type="text"
                                            value={editableData.fussbreite1}
                                            onChange={(e) => handleInputChange('fussbreite1', e.target.value)}
                                            className="w-full text-center border-none outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-center text-gray-600 text-sm">Fussbreite</div>
                                    <div className="border border-gray-300 text-center py-1">
                                        <input
                                            type="text"
                                            value={editableData.fussbreite2}
                                            onChange={(e) => handleInputChange('fussbreite2', e.target.value)}
                                            className="w-full text-center border-none outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="text-center text-gray-600 text-sm">Kugelumfang</div>
                                    <div className="border border-gray-300 text-center py-1">
                                        <input
                                            type="text"
                                            value={editableData.kugelumfang1}
                                            onChange={(e) => handleInputChange('kugelumfang1', e.target.value)}
                                            className="w-full text-center border-none outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-center text-gray-600 text-sm">Kugelumfang</div>
                                    <div className="border border-gray-300 text-center py-1 relative">
                                        <input
                                            type="text"
                                            value={editableData.kugelumfang2}
                                            onChange={(e) => handleInputChange('kugelumfang2', e.target.value)}
                                            className="w-full text-center border-none outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="text-center text-gray-600 text-sm">Rist</div>
                                    <div className="border border-gray-300 text-center py-1">
                                        <input
                                            type="text"
                                            value={editableData.rist1}
                                            onChange={(e) => handleInputChange('rist1', e.target.value)}
                                            className="w-full text-center border-none outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-center text-gray-600 text-sm">Rist</div>
                                    <div className="border border-gray-300 text-center py-1">
                                        <input
                                            type="text"
                                            value={editableData.rist2}
                                            onChange={(e) => handleInputChange('rist2', e.target.value)}
                                            className="w-full text-center border-none outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="text-center text-gray-600 text-sm">Zehentyp</div>
                                    <div className="border border-gray-300 text-center py-1">
                                        <input
                                            type="text"
                                            value={editableData.zehentyp1}
                                            onChange={(e) => handleInputChange('zehentyp1', e.target.value)}
                                            className="w-full text-center border-none outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-center text-gray-600 text-sm">Zehentyp</div>
                                    <div className="border border-gray-300 text-center py-1">
                                        <input
                                            type="text"
                                            value={editableData.zehentyp2}
                                            onChange={(e) => handleInputChange('zehentyp2', e.target.value)}
                                            className="w-full text-center border-none outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 mb-6 lg:mb-0 flex flex-col items-center">
                            <div className="w-50 max-w-sm">
                                <Image
                                    src={rightImage}
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
                    <QuestionSection customer={scanData} />
                </div>
            </div>

            {/* button section */}
            <div className="mt-8 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                <div className="flex justify-center md:justify-start">
                    <div className="flex flex-wrap space-x-2">
                        <button className="border border-gray-300 cursor-pointer bg-white hover:bg-gray-100 px-4 py-1 text-sm my-1" onClick={() => openModal(scanData.picture_10, 'Fersenneigung (Links)')}>Fersenneigung</button>
                        <button className="border border-gray-300 cursor-pointer bg-[#62A07C] hover:bg-gray-100 px-4 py-1 text-sm relative my-1" onClick={() => openModal(scanData.picture_23, 'Plantaransicht (Links)')}>Plantaransicht</button>
                        <button className="border border-gray-300 cursor-pointer  bg-white hover:bg-gray-100 px-4 py-1 text-sm my-1" onClick={() => openStlModal(scanData.threed_model_left, '3D-Modell (Links)')}>3D-Modell</button>
                        <button className="border border-gray-300 cursor-pointer bg-white hover:bg-gray-100 px-4 py-1 text-sm my-1" onClick={() => openModal(scanData.picture_17, 'Sohlen Index (Links)')}>Sohlen Index</button>
                    </div>
                </div>

                <div className="flex justify-center md:justify-end">
                    <div className="flex flex-wrap space-x-2">
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1" onClick={() => openModal(scanData.picture_11, 'Fersenneigung (Rechts)')}>Fersenneigung</button>
                        <button className="border border-gray-300 bg-[#62A07C] px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1" onClick={() => openModal(scanData.picture_24, 'Plantaransicht (Rechts)')}>Plantaransicht</button>
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1" onClick={() => openStlModal(scanData.threed_model_right, '3D-Modell (Rechts)')}>3D-Modell</button>
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1" onClick={() => openModal(scanData.picture_16, 'Sohlen Index (Rechts)')}>Sohlen Index</button>
                    </div>
                </div>
            </div>

            {/* Update Customer Modal */}
            <AddCustomerModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onSubmit={handleCustomerUpdate}
                mode="update"
                customerId={scanData.id}
            />
        </>
    )
}
