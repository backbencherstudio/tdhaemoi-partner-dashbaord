'use client'
import React, { useState, useEffect, useRef } from 'react'
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
import useDebounce from '@/hooks/useDebounce'
import { searchCustomers } from '@/apis/customerApis'


interface CustomerData {
    nameKunde: string;
    Telefon: string;
    Geburtsdatum: string;
    Geschäftstandort: string;
    createdAt: string;
    id: string;
    email: string;
}

interface SuggestionItem {
    id: string;
    name: string;
    phone: string;
    email: string;
    location: string;
}

export default function Customers() {
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [searchName, setSearchName] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

    // Auto-suggestion states
    const [nameSuggestions, setNameSuggestions] = useState<SuggestionItem[]>([]);
    const [phoneSuggestions, setPhoneSuggestions] = useState<SuggestionItem[]>([]);
    const [emailSuggestions, setEmailSuggestions] = useState<SuggestionItem[]>([]);
    const [showNameSuggestions, setShowNameSuggestions] = useState(false);
    const [showPhoneSuggestions, setShowPhoneSuggestions] = useState(false);
    const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
    const [suggestionLoading, setSuggestionLoading] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestionItem | null>(null);

    // Debounced search values
    const debouncedName = useDebounce(searchName, 300);
    const debouncedPhone = useDebounce(searchPhone, 300);
    const debouncedEmail = useDebounce(searchEmail, 300);

    // Refs for dropdown positioning
    const nameInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);

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

    // Fetch suggestions for name field
    useEffect(() => {
        if (debouncedName && debouncedName.length > 1) {
            fetchSuggestions(debouncedName, 'name');
        } else {
            setNameSuggestions([]);
            setShowNameSuggestions(false);
        }
    }, [debouncedName]);

    // Fetch suggestions for phone field
    useEffect(() => {
        if (debouncedPhone && debouncedPhone.length > 2 && !selectedSuggestion) {
            fetchSuggestions(debouncedPhone, 'phone');
        } else {
            setPhoneSuggestions([]);
            setShowPhoneSuggestions(false);
        }
    }, [debouncedPhone, selectedSuggestion]);

    // Fetch suggestions for email field
    useEffect(() => {
        if (debouncedEmail && debouncedEmail.length > 2 && !selectedSuggestion) {
            fetchSuggestions(debouncedEmail, 'email');
        } else {
            setEmailSuggestions([]);
            setShowEmailSuggestions(false);
        }
    }, [debouncedEmail, selectedSuggestion]);

    // Function to fetch suggestions from API
    const fetchSuggestions = async (searchTerm: string, type: 'name' | 'phone' | 'email') => {
        try {
            setSuggestionLoading(true);
            const nameParam = type === 'name' ? searchTerm : '';
            const phoneParam = type === 'phone' ? searchTerm : '';
            const emailParam = type === 'email' ? searchTerm : '';

            const response = await searchCustomers(searchTerm, 1, 10, nameParam, emailParam, phoneParam);

            if (response && response.data) {
                const suggestions = response.data.map((customer: any) => {
                    const mappedCustomer = {
                        id: customer.id,
                        name: customer.name || customer.nameKunde || `${customer.vorname || ''} ${customer.nachname || ''}`.trim(),
                        phone: customer.phone || customer.Telefon || customer.telefon || '',
                        email: customer.email || '',
                        location: customer.location || customer.Geschäftstandort || customer.wohnort || ''
                    };
                    return mappedCustomer;
                });

                if (type === 'name') {
                    setNameSuggestions(suggestions);
                    setShowNameSuggestions(suggestions.length > 0);
                } else if (type === 'phone') {
                    setPhoneSuggestions(suggestions);
                    setShowPhoneSuggestions(suggestions.length > 0);
                } else if (type === 'email') {
                    setEmailSuggestions(suggestions);
                    setShowEmailSuggestions(suggestions.length > 0);
                }
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setSuggestionLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);

        try {
            if (!searchName && !searchPhone && !searchEmail) {
                setSelectedCustomer(null);
                setNotFound(false);
                setLoading(false);
                return;
            }

            // If we have a selected suggestion, use it directly
            if (selectedSuggestion) {
                const foundCustomer: CustomerData = {
                    id: selectedSuggestion.id,
                    nameKunde: selectedSuggestion.name,
                    Telefon: selectedSuggestion.phone,
                    email: selectedSuggestion.email,
                    Geburtsdatum: '',
                    Geschäftstandort: selectedSuggestion.location,
                    createdAt: new Date().toISOString()
                };

                setSelectedCustomer(foundCustomer);
                setNotFound(false);
                setLoading(false);
                return;
            }

            // If no suggestion selected, try API search
            let response = null;

            // First try: Search by name if available
            if (searchName) {
                response = await searchCustomers(searchName, 1, 10, searchName, '', '');
            }

            // If no result and phone available, try phone search
            if ((!response || !response.data || response.data.length === 0) && searchPhone) {
                response = await searchCustomers(searchPhone, 1, 10, '', '', searchPhone);
            }

            // If no result and email available, try email search  
            if ((!response || !response.data || response.data.length === 0) && searchEmail) {
                response = await searchCustomers(searchEmail, 1, 10, '', searchEmail, '');
            }

            // If still no result, try general search
            if (!response || !response.data || response.data.length === 0) {
                const searchTerm = searchName || searchPhone || searchEmail;
                response = await searchCustomers(searchTerm, 1, 10, searchName || '', searchEmail || '', searchPhone || '');
            }

            if (response && response.data && response.data.length > 0) {
                const customer = response.data[0];
                const foundCustomer: CustomerData = {
                    id: customer.id,
                    nameKunde: customer.name || customer.nameKunde || `${customer.vorname || ''} ${customer.nachname || ''}`.trim(),
                    Telefon: customer.phone || customer.Telefon || customer.telefon || '',
                    email: customer.email || '',
                    Geburtsdatum: customer.Geburtsdatum || '',
                    Geschäftstandort: customer.location || customer.Geschäftstandort || customer.wohnort || '',
                    createdAt: customer.createdAt || new Date().toISOString()
                };

                setSelectedCustomer(foundCustomer);
                setNotFound(false);
            } else {
                setSelectedCustomer(null);
                setNotFound(true);
            }
        } catch (error) {
            console.error('Error searching customers:', error);
            setSelectedCustomer(null);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestion: SuggestionItem) => {

        // Set all field values
        setSearchName(suggestion.name || '');
        setSearchPhone(suggestion.phone || '');
        setSearchEmail(suggestion.email || '');

        // Store the selected suggestion for later use
        setSelectedSuggestion(suggestion);

        // Hide all suggestions
        setShowNameSuggestions(false);
        setShowPhoneSuggestions(false);
        setShowEmailSuggestions(false);

        // Clear suggestion arrays to prevent auto-showing
        setNameSuggestions([]);
        setPhoneSuggestions([]);
        setEmailSuggestions([]);

        // Clear any previous card display
        setSelectedCustomer(null);
        setNotFound(false);

    };

    // Handle clicking outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                nameInputRef.current && !nameInputRef.current.contains(event.target as Node) &&
                phoneInputRef.current && !phoneInputRef.current.contains(event.target as Node) &&
                emailInputRef.current && !emailInputRef.current.contains(event.target as Node)
            ) {
                setShowNameSuggestions(false);
                setShowPhoneSuggestions(false);
                setShowEmailSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // handle scan view function
    const handleScanView = (id: string) => {
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
                id: Date.now().toString(), // Generate unique ID as string
                nameKunde: `${customerData.vorname} ${customerData.nachname}`,
                Telefon: customerData.telefon || '',
                Geburtsdatum: '', // Not provided in form
                Geschäftstandort: customerData.wohnort || '',
                createdAt: new Date().toISOString(),
                email: customerData.email || '',
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
                <div className='flex items-center gap-4'>

                    <div className='flex items-center gap-2 cursor-pointer' onClick={handleAddCustomerClick}>
                        <h1 className='text-xl font-semibold'>Add Customer</h1>
                        <HiPlus className='text-4xl font-semibold text-black border border-gray-500 rounded-full p-1' />
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center">
                {/* Left side - Search form */}
                <div className="space-y-5">
                    {/* Name Input with Suggestions */}
                    <div className="relative">
                        <Input
                            ref={nameInputRef}
                            placeholder="Name"
                            className='border border-gray-500 rounded-md'
                            value={searchName}
                            onChange={(e) => {
                                setSearchName(e.target.value);
                                setShowNameSuggestions(true);
                                setSelectedSuggestion(null); // Clear selected suggestion
                            }}
                            onFocus={() => setShowNameSuggestions(nameSuggestions.length > 0)}
                        />
                        {showNameSuggestions && nameSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {nameSuggestions.map((suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // Prevent input blur
                                            handleSuggestionSelect(suggestion);
                                        }}
                                    >
                                        <div className="font-medium text-sm">{suggestion.name}</div>
                                        <div className="text-xs text-gray-500">{suggestion.email}</div>
                                        <div className="text-xs text-gray-500">{suggestion.phone}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {suggestionLoading && showNameSuggestions && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    <span className="ml-2 text-sm text-gray-500">Suche...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Phone Input with Suggestions */}
                    <div className="relative">
                        <Input
                            ref={phoneInputRef}
                            placeholder="Telefon"
                            className='border border-gray-500 rounded-md'
                            value={searchPhone}
                            onChange={(e) => {
                                setSearchPhone(e.target.value);
                                setSelectedSuggestion(null); // Clear selected suggestion when manually typing
                            }}
                            onFocus={() => !selectedSuggestion && setShowPhoneSuggestions(phoneSuggestions.length > 0)}
                        />
                        {showPhoneSuggestions && phoneSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {phoneSuggestions.map((suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // Prevent input blur
                                            handleSuggestionSelect(suggestion);
                                        }}
                                    >
                                        <div className="font-medium text-sm">{suggestion.name}</div>
                                        <div className="text-xs text-gray-500">{suggestion.email}</div>
                                        <div className="text-xs text-gray-500">{suggestion.phone}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {suggestionLoading && showPhoneSuggestions && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    <span className="ml-2 text-sm text-gray-500">Suche...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Email Input with Suggestions */}
                    <div className="relative">
                        <Input
                            ref={emailInputRef}
                            placeholder="Email"
                            className='border border-gray-500 rounded-md'
                            value={searchEmail}
                            onChange={(e) => {
                                setSearchEmail(e.target.value);
                                setSelectedSuggestion(null); // Clear selected suggestion when manually typing
                            }}
                            onFocus={() => !selectedSuggestion && setShowEmailSuggestions(emailSuggestions.length > 0)}
                        />
                        {showEmailSuggestions && emailSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {emailSuggestions.map((suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // Prevent input blur
                                            handleSuggestionSelect(suggestion);
                                        }}
                                    >
                                        <div className="font-medium text-sm">{suggestion.name}</div>
                                        <div className="text-xs text-gray-500">{suggestion.email}</div>
                                        <div className="text-xs text-gray-500">{suggestion.phone}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {suggestionLoading && showEmailSuggestions && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    <span className="ml-2 text-sm text-gray-500">Suche...</span>
                                </div>
                            </div>
                        )}
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
                                    {selectedCustomer.email && (
                                        <p>Email: {selectedCustomer.email}</p>
                                    )}
                                    {selectedCustomer.Telefon && (
                                        <p>Telefon: {selectedCustomer.Telefon}</p>
                                    )}
                                    <p>Erstellt am: {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                                    {selectedCustomer.Geschäftstandort && (
                                        <p>Ort: {selectedCustomer.Geschäftstandort}</p>
                                    )}
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


