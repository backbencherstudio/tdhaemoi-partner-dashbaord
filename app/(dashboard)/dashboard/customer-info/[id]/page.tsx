'use client'
import React, { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSingleCustomer } from '@/hooks/customer/useSingleCustomer'
import { ScanData } from '@/types/scan'
import Image from 'next/image'
import { MdZoomOutMap } from 'react-icons/md'
import { TfiReload } from 'react-icons/tfi'
import { RiArrowDownSLine } from 'react-icons/ri'
import ImagePreviewModal from '@/components/CustomerModal/ImagePreviewModal'
import Link from 'next/link'
import userload from '@/public/images/scanning/userload.png'
import userImg from '@/public/images/scanning/user.png'
import { useRouter } from 'next/navigation'

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

    // Date filter state
    const [selectedScanDate, setSelectedScanDate] = useState<string>('');
    const [showDateDropdown, setShowDateDropdown] = useState(false);

    // Zoom state
    const [isZoomed, setIsZoomed] = useState(false);

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

    // Toggle zoom mode
    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    // Use the data from hook
    const displayData = scanData;

    // Get all available scan dates from screenerFile
    const availableScanDates = useMemo(() => {
        if (!displayData?.screenerFile || !Array.isArray(displayData.screenerFile) || displayData.screenerFile.length === 0) {
            return [];
        }

        try {
            return displayData.screenerFile
                .filter(file => file && file.updatedAt) // Filter out invalid entries
                .map(file => ({
                    date: file.updatedAt,
                    id: file.id,
                    displayDate: new Date(file.updatedAt).toLocaleDateString()
                }))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by newest first
        } catch (error) {
            console.error('Error processing scan dates:', error);
            return [];
        }
    }, [displayData?.screenerFile]);

    // Get the selected scan data or default to latest
    const selectedScanData = useMemo(() => {
        if (!displayData?.screenerFile || !Array.isArray(displayData.screenerFile) || displayData.screenerFile.length === 0) {
            return null;
        }

        if (selectedScanDate) {
            return displayData.screenerFile.find(file => file.updatedAt === selectedScanDate);
        }

        // Default to latest scan - only reduce if array has items
        if (displayData.screenerFile.length > 0) {
            return displayData.screenerFile.reduce((latest, item) => {
                const latestDate = new Date(latest.updatedAt);
                const currentDate = new Date(item.updatedAt);
                return currentDate > latestDate ? item : latest;
            });
        }

        return null;
    }, [displayData?.screenerFile, selectedScanDate]);

    // Get data from selected scan or fallback to customer data
    const getLatestData = (fieldName: keyof Pick<ScanData, 'picture_10' | 'picture_23' | 'picture_11' | 'picture_24' | 'threed_model_left' | 'threed_model_right' | 'picture_17' | 'picture_16'>) => {
        if (selectedScanData && selectedScanData[fieldName]) {
            return selectedScanData[fieldName];
        }
        return displayData?.[fieldName] || null;
    };

    // Handle date selection
    const handleDateSelect = (date: string) => {
        setSelectedScanDate(date);
        setShowDateDropdown(false);
    };

    // Get display date for current selection
    const getCurrentDisplayDate = () => {
        if (selectedScanDate) {
            return new Date(selectedScanDate).toLocaleDateString();
        }
        if (selectedScanData) {
            return new Date(selectedScanData.updatedAt).toLocaleDateString();
        }
        return '-';
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!scanData) return <div className="p-4">Customer not found</div>;

    // handle versorgungs page
    const handleVersorgungsPage = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push(`/dashboard/scanning-data/${scanData?.id}`);
    };

    return (
        <div className="p-4 pb-20">
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

                {/* Date section with dropdown */}
                <div className="mt-2 relative">
                    <div
                        className={`flex w-fit items-center gap-2 p-2 rounded transition-colors ${availableScanDates.length > 0
                                ? 'cursor-pointer hover:bg-gray-100'
                                : 'cursor-not-allowed opacity-50'
                            }`}
                        onClick={() => availableScanDates.length > 0 && setShowDateDropdown(!showDateDropdown)}
                    >
                        <span className="text-gray-600 text-sm">
                            Scan Date: {getCurrentDisplayDate()}
                        </span>
                        {availableScanDates.length > 0 && (
                            <RiArrowDownSLine className={`text-gray-900 text-xl transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
                        )}
                    </div>

                    {/* Date Dropdown */}
                    {showDateDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-48">
                            {availableScanDates.length > 0 ? (
                                availableScanDates.map((scanDate) => (
                                    <div
                                        key={scanDate.id}
                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${selectedScanDate === scanDate.date ? 'bg-blue-50 text-blue-600' : ''
                                            }`}
                                        onClick={() => handleDateSelect(scanDate.date)}
                                    >
                                        {scanDate.displayDate}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-gray-500 text-sm">
                                    No scan dates available
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className='mb-10'>

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
                            href={`/dashboard/customer-history/${scanData?.id}`}
                            className="p-5 cursor-pointer flex items-center justify-center rounded-2xl border border-black bg-white hover:bg-gray-100 transition"
                        >
                            <Image src={userImg} alt="Kundendaten -historie" width={60} height={60} />
                        </Link>
                        <span className="mt-2 text-center text-sm font-normal">Kundendaten -historie</span>
                    </div>
                </div>
            </div>

            {/* Zoom Mode - Show only images when zoomed */}
            {isZoomed ? (
                <div className="relative mb-8">
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={toggleZoom}
                            className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg transition-all duration-300 ease-out flex items-center gap-1 md:gap-2 text-sm md:text-base"
                            title="Exit zoom mode"
                        >
                            <span>✕</span>
                            <span className="hidden sm:inline">Exit Zoom</span>
                        </button>
                    </div>

                    {/* Responsive image layout */}
                    <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-8">
                        {/* Left foot image - Responsive sizing */}
                        <div className="text-center w-full lg:w-auto">
                            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4 text-gray-700">Left Foot</h3>
                            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
                                {getLatestData('picture_23') ? (
                                    <Image
                                        src={getLatestData('picture_23')!}
                                        alt="Left foot scan - Plantaransicht"
                                        width={400}
                                        height={600}
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                ) : (
                                    <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm md:text-base">
                                        No left foot scan image available
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right foot image - Responsive sizing */}
                        <div className="text-center w-full lg:w-auto">
                            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4 text-gray-700">Right Foot</h3>
                            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
                                {getLatestData('picture_24') ? (
                                    <Image
                                        src={getLatestData('picture_24')!}
                                        alt="Right foot scan - Plantaransicht"
                                        width={400}
                                        height={600}
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                ) : (
                                    <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm md:text-base">
                                        No right foot scan image available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Normal Mode - Show images with data fields */
                <div className="flex flex-col lg:flex-row justify-between items-center">
                    {/* left image section */}
                    <div className="flex-1 mb-6 lg:mb-0 flex flex-col items-center">
                        <div className="w-60 max-w-md">
                            {getLatestData('picture_23') ? (
                                <Image
                                    src={getLatestData('picture_23')!}
                                    alt="Left foot scan - Plantaransicht"
                                    width={300}
                                    height={500}
                                    className="w-full h-auto"
                                />
                            ) : (
                                <div className="w-full h-[500px] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
                                    No left foot scan image available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* scan data section - READ ONLY */}
                    <div className="flex-1 mx-2 ">
                        <div className='flex items-center justify-center gap-5 mb-5'>
                            <div
                                className={`border border-gray-500 rounded p-1 cursor-pointer hover:bg-gray-100 transition ${isZoomed ? 'bg-blue-100 border-blue-500' : ''}`}
                                onClick={toggleZoom}
                                title={isZoomed ? "Exit zoom mode" : "Zoom images"}
                            >
                                <MdZoomOutMap className={`text-4xl ${isZoomed ? 'text-blue-600' : 'text-gray-600'}`} />
                            </div>
                            <div className='border border-gray-500 rounded p-1 cursor-pointer hover:bg-gray-100 transition'>
                                <TfiReload className='text-gray-600 text-4xl' />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mx-2">
                            <div>
                                <div className="text-center text-gray-600 text-sm">Fusslänge</div>
                                <div className="border border-gray-300 text-center py-1 bg-gray-50">
                                    <span className="text-gray-800">{scanData.fusslange1 || '-'}</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-center text-gray-600 text-sm">Fusslänge</div>
                                <div className="border border-gray-300 text-center py-1 bg-gray-50">
                                    <span className="text-gray-800">{scanData.fusslange2 || '-'}</span>
                                </div>
                            </div>

                            <div>
                                <div className="text-center text-gray-600 text-sm">Fussbreite</div>
                                <div className="border border-gray-300 text-center py-1 bg-gray-50">
                                    <span className="text-gray-800">{scanData.fussbreite1 || '-'}</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-center text-gray-600 text-sm">Fussbreite</div>
                                <div className="border border-gray-300 text-center py-1 bg-gray-50">
                                    <span className="text-gray-800">{scanData.fussbreite2 || '-'}</span>
                                </div>
                            </div>

                            <div>
                                <div className="text-center text-gray-600 text-sm">Kugelumfang</div>
                                <div className="border border-gray-300 text-center py-1 bg-gray-50">
                                    <span className="text-gray-800">{scanData.kugelumfang1 || '-'}</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-center text-gray-600 text-sm">Kugelumfang</div>
                                <div className="border border-gray-300 text-center py-1 bg-gray-50">
                                    <span className="text-gray-800">{scanData.kugelumfang2 || '-'}</span>
                                </div>
                            </div>

                            <div>
                                <div className="text-center text-gray-600 text-sm">Rist</div>
                                <div className="border border-gray-300 text-center py-1 bg-gray-50">
                                    <span className="text-gray-800">{scanData.rist1 || '-'}</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-center text-gray-600 text-sm">Rist</div>
                                <div className="border border-gray-300 text-center py-1 bg-gray-50">
                                    <span className="text-gray-800">{scanData.rist2 || '-'}</span>
                                </div>
                            </div>

                            <div>
                                <div className="text-center text-gray-600 text-sm">Zehentyp</div>
                                <div className="border border-gray-300 text-center py-1 bg-gray-50">
                                    <span className="text-gray-800">{scanData.zehentyp1 || '-'}</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-center text-gray-600 text-sm">Zehentyp</div>
                                <div className="border border-gray-300 text-center py-1 bg-gray-50">
                                    <span className="text-gray-800">{scanData.zehentyp2 || '-'}</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-center text-gray-600 text-sm">Arch Index</div>
                                <div className="border border-gray-300 text-center py-1 bg-gray-50">
                                    <span className="text-gray-800">{scanData.archIndex1 || '-'}</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-center text-gray-600 text-sm">Arch Index</div>
                                <div className="border border-gray-300 text-center py-1 bg-gray-50">
                                    <span className="text-gray-800">{scanData.archIndex2 || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* right image section */}
                    <div className="flex-1 mb-6 lg:mb-0 flex flex-col items-center">
                        <div className="w-60 max-w-md">
                            {getLatestData('picture_24') ? (
                                <Image
                                    src={getLatestData('picture_24')!}
                                    alt="Right foot scan - Plantaransicht"
                                    width={300}
                                    height={500}
                                    className="w-full h-auto"
                                />
                            ) : (
                                <div className="w-full h-[500px] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
                                    No right foot scan image available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* button section - now using latest data sorted by updatedAt */}
            <div className="mt-8 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                <div className="flex justify-center md:justify-start">
                    <div className="flex flex-wrap space-x-2">
                        <button className="border border-gray-300 cursor-pointer bg-white hover:bg-gray-100 px-4 py-1 text-sm my-1" onClick={() => openModal(getLatestData('picture_10'), 'Fersenneigung (Links)')}>Fersenneigung</button>
                        <button className="border border-gray-300 cursor-pointer bg-white hover:bg-gray-100 px-4 py-1 text-sm relative my-1" onClick={() => openModal(getLatestData('picture_23'), 'Plantaransicht (Links)')}>Plantaransicht</button>
                        <button className="border border-gray-300 cursor-pointer  bg-white hover:bg-gray-100 px-4 py-1 text-sm my-1" onClick={() => openStlModal(getLatestData('threed_model_left'), '3D-Modell (Links)')}>3D-Modell</button>
                        <button className="border border-gray-300 cursor-pointer bg-white hover:bg-gray-100 px-4 py-1 text-sm my-1" onClick={() => openModal(getLatestData('picture_17'), 'Sohlen Index (Links)')}>Sohlen Index</button>
                    </div>
                </div>

                <div className="flex justify-center md:justify-end">
                    <div className="flex flex-wrap space-x-2">
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1" onClick={() => openModal(getLatestData('picture_11'), 'Fersenneigung (Rechts)')}>Fersenneigung</button>
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1" onClick={() => openModal(getLatestData('picture_24'), 'Plantaransicht (Rechts)')}>Plantaransicht</button>
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1" onClick={() => openStlModal(getLatestData('threed_model_right'), '3D-Modell (Rechts)')}>3D-Modell</button>
                        <button className="border border-gray-300 bg-white px-4 hover:bg-gray-100 cursor-pointer py-1 text-sm my-1" onClick={() => openModal(getLatestData('picture_16'), 'Sohlen Index (Rechts)')}>Sohlen Index</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
