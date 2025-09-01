import { useState, useCallback } from 'react';
import { searchCustomers } from '@/apis/customerApis';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    location: string;
    createdAt: string;
}

interface SearchResponse {
    success: boolean;
    message: string;
    data: Customer[];
}

export const useFootExercises = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowSuggestions(false);
            return;
        }

        setIsSearching(true);
        try {
            const response: SearchResponse = await searchCustomers(
                query, // searchData
                1, // page
                10, // limit
                query, // name
                query, // email
                '' // phone
            );
            
            if (response.success && response.data) {
                setSearchResults(response.data);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error('Error searching customers:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleCustomerSelect = useCallback((customer: Customer) => {
        setSelectedCustomer(customer);
        setSearchQuery(customer.name);
        setShowSuggestions(false);
        setSearchResults([]);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedCustomer(null);
        setSearchQuery('');
        setSearchResults([]);
        setShowSuggestions(false);
    }, []);

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        selectedCustomer,
        isSearching,
        showSuggestions,
        handleSearch,
        handleCustomerSelect,
        clearSelection,
        setShowSuggestions
    };
};
