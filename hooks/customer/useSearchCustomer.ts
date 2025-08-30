'use client'

import { useState, useEffect, useRef } from 'react'
import { searchCustomers } from '@/apis/customerApis'
import useDebounce from '@/hooks/useDebounce'

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

export const useSearchCustomer = () => {
    // Search input states
    const [searchName, setSearchName] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchEmail, setSearchEmail] = useState('');

    // Search result states
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(false);

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

    // Main search function
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

    // Clear search results
    const clearSearch = () => {
        setSelectedCustomer(null);
        setNotFound(false);
        setSelectedSuggestion(null);
        setSearchName('');
        setSearchPhone('');
        setSearchEmail('');
        setNameSuggestions([]);
        setPhoneSuggestions([]);
        setEmailSuggestions([]);
        setShowNameSuggestions(false);
        setShowPhoneSuggestions(false);
        setShowEmailSuggestions(false);
    };

    // Handle name input change
    const handleNameChange = (value: string) => {
        setSearchName(value);
        setShowNameSuggestions(true);
        setSelectedSuggestion(null);
    };

    // Handle phone input change
    const handlePhoneChange = (value: string) => {
        setSearchPhone(value);
        setSelectedSuggestion(null);
    };

    // Handle email input change
    const handleEmailChange = (value: string) => {
        setSearchEmail(value);
        setSelectedSuggestion(null);
    };

    return {
        // Search input states
        searchName,
        searchPhone,
        searchEmail,
        
        // Search result states
        selectedCustomer,
        notFound,
        loading,
        
        // Suggestion states
        nameSuggestions,
        phoneSuggestions,
        emailSuggestions,
        showNameSuggestions,
        showPhoneSuggestions,
        showEmailSuggestions,
        suggestionLoading,
        selectedSuggestion,
        
        // Refs
        nameInputRef,
        phoneInputRef,
        emailInputRef,
        
        // Actions
        setSearchName,
        setSearchPhone,
        setSearchEmail,
        setSelectedCustomer,
        handleSearch,
        handleSuggestionSelect,
        clearSearch,
        handleNameChange,
        handlePhoneChange,
        handleEmailChange,
        
        // Suggestion visibility controls
        setShowNameSuggestions,
        setShowPhoneSuggestions,
        setShowEmailSuggestions
    };
};
