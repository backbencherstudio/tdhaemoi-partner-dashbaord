import { useCallback, useEffect, useRef, useState } from 'react'
import { getAllEmployees, searchEmployee } from '@/apis/employeeaApis'
import useDebounce from '@/hooks/useDebounce'

interface EmployeeSuggestion {
    id: string
    employeeName: string
    email?: string
}

export function useSearchEmployee(initialLimit: number = 50) {
    const [searchText, setSearchText] = useState('')
    const [suggestions, setSuggestions] = useState<EmployeeSuggestion[]>([])
    const [loading, setLoading] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const debouncedText = useDebounce(searchText, 300)

    const fetchInitial = useCallback(async () => {
        setLoading(true)
        try {
            const res = await getAllEmployees(1, initialLimit)
            const list = (res?.data || []).map((e: any) => ({
                id: e.id || e._id,
                employeeName: e.employeeName || e.name,
                email: e.email,
            }))
            setSuggestions(list)
        } finally {
            setLoading(false)
        }
    }, [initialLimit])

    useEffect(() => {
        fetchInitial()
    }, [fetchInitial])

    const doSearch = useCallback(async (text: string) => {
        if (!text) {
            // show initial list
            fetchInitial()
            return
        }
        setLoading(true)
        try {
            const res = await searchEmployee(1, initialLimit, text)
            const list = (res?.data || []).map((e: any) => ({
                id: e.id || e._id,
                employeeName: e.employeeName || e.name,
                email: e.email,
            }))
            setSuggestions(list)
        } finally {
            setLoading(false)
        }
    }, [initialLimit, fetchInitial])

    const handleChange = useCallback((value: string) => {
        setSearchText(value)
        setShowSuggestions(true)
    }, [])

    useEffect(() => {
        if (!showSuggestions) return
        doSearch(debouncedText)
    }, [debouncedText, doSearch, showSuggestions])

    const clearSearch = useCallback(() => {
        setSearchText('')
        setShowSuggestions(false)
    }, [])

    return {
        searchText,
        setSearchText,
        suggestions,
        loading,
        showSuggestions,
        setShowSuggestions,
        handleChange,
        clearSearch,
        inputRef,
    }
}

export default useSearchEmployee


