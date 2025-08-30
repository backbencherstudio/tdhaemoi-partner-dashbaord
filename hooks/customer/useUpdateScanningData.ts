import { useState } from 'react'
import { updateSingleScannerFile } from '@/apis/customerApis'

interface UseUpdateScanningDataReturn {
    isUpdating: boolean
    error: string | null
    updateScanningData: (customerId: string, screenerId: string, fileData: FormData) => Promise<boolean>
}

export const useUpdateScanningData = (): UseUpdateScanningDataReturn => {
    const [isUpdating, setIsUpdating] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const updateScanningData = async (
        customerId: string, 
        screenerId: string, 
        fileData: FormData
    ): Promise<boolean> => {
        setIsUpdating(true)
        setError(null)

        try {
            const response = await updateSingleScannerFile(customerId, screenerId, fileData)
            
            if (response.success) {
                return true
            } else {
                setError(response.message || 'Failed to update scanning data')
                return false
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred while updating scanning data'
            setError(errorMessage)
            return false
        } finally {
            setIsUpdating(false)
        }
    }

    return {
        isUpdating,
        error,
        updateScanningData
    }
}
