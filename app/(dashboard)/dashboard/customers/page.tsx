'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import legsImg from '@/public/Kunden/legs.png'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X } from 'lucide-react'
import scanner3D from '@/public/Kunden/3d.png'
import userImg from '@/public/Kunden/user.png'
import LastScans from '@/components/LastScans/LastScans'
import { useRouter } from 'next/navigation'
import { HiPlus } from 'react-icons/hi'
import AddCustomerModal from '@/components/AddCustomerModal/AddCustomerModal'


interface CustomerData {
    nameKunde: string;
    Telefon: string;
    Geburtsdatum: string;
    Geschäftstandort: string;
    createdAt: string;
    id: number;
}

export default function Customers() {
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [searchName, setSearchName] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchDob, setSearchDob] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
    const router = useRouter();

    // Fetch customer data
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('/data/userData.json');
                const data = await response.json();
                setCustomers(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
        fetchCustomers();
    }, []);

    const handleSearch = () => {
        setLoading(true);

        setTimeout(() => {
            if (!searchName && !searchPhone && !searchDob) {
                setSelectedCustomer(null);
                setNotFound(false);
                setLoading(false);
                return;
            }

            const foundCustomer = customers.find(customer => {
                if (searchName && customer.nameKunde !== searchName) return false;
                if (searchPhone && customer.Telefon !== searchPhone) return false;
                if (searchDob && customer.Geburtsdatum !== searchDob) return false;
                return true;
            });

            if (foundCustomer) {
                setSelectedCustomer(foundCustomer);
                setNotFound(false);
            } else {
                setSelectedCustomer(null);
                setNotFound(true);
            }

            setLoading(false);
        }, 500);
    };
    // handle scan view function
    const handleScanView = (id: number) => {
        router.push(`/dashboard/scanning-data/${id}`);
    }

    // handle add customer modal
    const handleAddCustomerClick = () => {
        setIsAddCustomerModalOpen(true);
    }

    // handle customer submission
    const handleCustomerSubmit = async (customerData: any) => {
        try {
            // Create new customer object for local state
            const newCustomer: CustomerData = {
                id: Date.now(), // Generate unique ID
                nameKunde: `${customerData.vorname} ${customerData.nachname}`,
                Telefon: customerData.telefon || '',
                Geburtsdatum: '', // Not provided in form
                Geschäftstandort: customerData.wohnort || '',
                createdAt: new Date().toISOString(),
            };

            // Add to customers list
            setCustomers(prev => [newCustomer, ...prev]);

            // Close modal
            setIsAddCustomerModalOpen(false);
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    }

    return (
        <div className="">
            <div className='flex items-center justify-between gap-2 mb-6'>

                <h1 className="text-2xl font-bold">Kunden & Scans</h1>
                <div className='flex items-center gap-2 cursor-pointer' onClick={handleAddCustomerClick}>
                    <h1 className='text-xl font-semibold'>Manually Add a Customer</h1>
                    <HiPlus className='text-4xl font-semibold text-black border border-gray-500 rounded-full p-1' />
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center">
                {/* Left side - Search form */}
                <div className="space-y-5">
                    <div>
                        <Input
                            placeholder="Name"
                            className='border border-gray-500 rounded-md'
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            placeholder="Telefon"
                            className='border border-gray-500 rounded-md'
                            value={searchPhone}
                            onChange={(e) => setSearchPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            placeholder="Geburtsdatum (YYYY-MM-DD)"
                            className='border border-gray-500 rounded-md'
                            value={searchDob}
                            onChange={(e) => setSearchDob(e.target.value)}
                        />
                    </div>
                    <div className='flex justify-center'>
                        <Button
                            className="w-32 cursor-pointer flex items-center justify-center gap-2"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    Lädt...
                                </>
                            ) : (
                                "Suchen"
                            )}
                        </Button>

                    </div>

                </div>

                <div>

                    {/* Right side - Customer details card */}
                    {selectedCustomer ? (
                        <Card className="relative shadow-none border border-gray-500 bg-transparent">
                            <button className="absolute cursor-pointer right-2 top-2" onClick={() => setSelectedCustomer(null)}>
                                <X className="h-4 w-4" />
                            </button>
                            <CardContent className="pt-6 text-center">
                                <div className="flex justify-center mb-4">
                                    <Image
                                        src={legsImg}
                                        alt="Foot scan"
                                        width={200}
                                        height={100}
                                        className="object-contain"
                                    />
                                </div>
                                <h2 className="text-xl font-semibold text-green-600 mb-4">{selectedCustomer.nameKunde}</h2>
                                <div className="space-y-2 mb-6">
                                    <p>Erstellt am: {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                                    <p>Ort: {selectedCustomer.Geschäftstandort}</p>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <Button onClick={() => handleScanView(selectedCustomer.id)} variant="outline" className="flex items-center gap-2 cursor-pointer">
                                        <Image src={scanner3D} alt="Scan" width={20} height={20} />
                                        <span>Scan ansehen</span>
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                                        <Image src={userImg} alt="User" width={20} height={20} />
                                        <span>Kundeninfo</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : notFound ? (
                        <div className="text-center text-red-500">
                            Keine Ergebnisse gefunden
                        </div>
                    ) : null}
                </div>
            </div>

            {/* last scans component */}
            <LastScans />

            {/* Add Customer Modal */}
            <AddCustomerModal
                isOpen={isAddCustomerModalOpen}
                onClose={() => setIsAddCustomerModalOpen(false)}
                onSubmit={handleCustomerSubmit}
            />
        </div>
    )
}

