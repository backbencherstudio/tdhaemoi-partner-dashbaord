'use client'
import { useState } from 'react'
import { addCustomer } from '@/apis/customerApis'
import toast from 'react-hot-toast'

interface CustomerFormData {
    vorname: string
    nachname: string
    email: string
    telefon?: string
    wohnort?: string
    // Specific file fields
    picture_10?: File
    picture_23?: File
    threed_model_left?: File
    picture_17?: File
    picture_11?: File
    picture_24?: File
    threed_model_right?: File
    picture_16?: File
    csvFile?: File
}

interface FilePreview {
    file: File
    preview?: string
    fieldName: string
}

export const useAddCustomer = () => {
    const [filePreviews, setFilePreviews] = useState<FilePreview[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFileUpload = (fieldName: keyof CustomerFormData, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const preview = e.target?.result as string
                setFilePreviews(prev => {
                    const filtered = prev.filter(p => p.fieldName !== fieldName)
                    return [...filtered, { file, preview, fieldName }]
                })
            }
            reader.readAsDataURL(file)
        } else {
            setFilePreviews(prev => {
                const filtered = prev.filter(p => p.fieldName !== fieldName)
                return [...filtered, { file, fieldName }]
            })
        }

        return file
    }

    const removeFile = (fieldName: keyof CustomerFormData) => {
        setFilePreviews(prev => prev.filter(p => p.fieldName !== fieldName))
    }

    const getFileIcon = (fileName: string) => {
        if (fileName.includes('picture')) {
            return 'image'
        } else if (fileName.includes('threed_model')) {
            return '3d'
        } else if (fileName.includes('csv')) {
            return 'csv'
        }
        return 'file'
    }

    const getFileLabel = (fieldName: string) => {
        const labels: Record<string, string> = {
            picture_10: 'Picture 10',
            picture_23: 'Picture 23',
            threed_model_left: '3D Model Left (.stl)',
            picture_17: 'Picture 17',
            picture_11: 'Picture 11',
            picture_24: 'Picture 24',
            threed_model_right: '3D Model Right (.stl)',
            picture_16: 'Picture 16',
            csvFile: 'CSV File'
        }
        return labels[fieldName] || fieldName
    }

    const getFileAccept = (fieldName: string) => {
        if (fieldName.includes('picture')) {
            return '.jpg,.jpeg,.png,.gif'
        } else if (fieldName.includes('threed_model')) {
            return '.stl,.obj'
        } else if (fieldName.includes('csv')) {
            return '.csv'
        }
        return '*'
    }

    const validateForm = (data: CustomerFormData): string[] => {
        const errors: string[] = []
        
        if (!data.vorname.trim()) {
            errors.push('Vorname ist erforderlich')
        }
        if (!data.nachname.trim()) {
            errors.push('Nachname ist erforderlich')
        }
        if (!data.email.trim()) {
            errors.push('E-Mail-Adresse ist erforderlich')
        }
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('Ungültige E-Mail-Adresse')
        }

        return errors
    }

    const submitCustomer = async (data: CustomerFormData): Promise<boolean> => {
        // Validate form
        const validationErrors = validateForm(data)
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => toast.error(error))
            return false
        }

        setIsSubmitting(true)
        try {
            // Create FormData to handle file uploads
            const formData = new FormData()

            // Add customer information
            formData.append('vorname', data.vorname)
            formData.append('nachname', data.nachname)
            formData.append('email', data.email)
            formData.append('telefon', data.telefon || '')
            formData.append('wohnort', data.wohnort || '')

            // Add files if they exist
            if (data.picture_10) {
                formData.append('picture_10', data.picture_10)
            }
            if (data.picture_11) {
                formData.append('picture_11', data.picture_11)
            }
            if (data.picture_16) {
                formData.append('picture_16', data.picture_16)
            }
            if (data.picture_17) {
                formData.append('picture_17', data.picture_17)
            }
            if (data.picture_23) {
                formData.append('picture_23', data.picture_23)
            }
            if (data.picture_24) {
                formData.append('picture_24', data.picture_24)
            }
            if (data.threed_model_left) {
                formData.append('threed_model_left', data.threed_model_left)
            }
            if (data.threed_model_right) {
                formData.append('threed_model_right', data.threed_model_right)
            }
            if (data.csvFile) {
                formData.append('csvFile', data.csvFile)
            }

            // Call add customer API
            await addCustomer(formData)
            
            toast.success('Customer added successfully!')
            return true
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to add customer'
            toast.error(errorMessage)
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setFilePreviews([])
    }

    const getFileFields = (): (keyof CustomerFormData)[] => [
        'picture_10',
        'picture_11',
        'picture_16',
        'picture_17',
        'picture_23',
        'picture_24',
        'csvFile'
    ]

    const getThreeDModelFields = (): (keyof CustomerFormData)[] => [
        'threed_model_left',
        'threed_model_right'
    ]

    return {
        // State
        filePreviews,
        isSubmitting,
        
        // Actions
        handleFileUpload,
        removeFile,
        submitCustomer,
        resetForm,
        
        // Helpers
        getFileIcon,
        getFileLabel,
        getFileAccept,
        getFileFields,
        getThreeDModelFields
    }
}
