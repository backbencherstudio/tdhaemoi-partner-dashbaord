'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { X, Upload, FileImage, File, FileText } from 'lucide-react'
import { addCustomer, getSingleCustomer, updateSingleCustomer } from '@/apis/customerApis'

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

interface AddCustomerModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: CustomerFormData) => void
    mode?: 'add' | 'update'
    customerId?: string
    initialData?: Partial<CustomerFormData>
}

export default function AddCustomerModal({ isOpen, onClose, onSubmit, mode = 'add', customerId, initialData }: AddCustomerModalProps) {
    const [filePreviews, setFilePreviews] = useState<FilePreview[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loadingCustomerData, setLoadingCustomerData] = useState(false)
    const [existingFiles, setExistingFiles] = useState<Record<string, string>>({})

    const form = useForm<CustomerFormData>({
        defaultValues: {
            vorname: initialData?.vorname || '',
            nachname: initialData?.nachname || '',
            email: initialData?.email || '',
            telefon: initialData?.telefon || '',
            wohnort: initialData?.wohnort || '',
        },
    })

    // Load customer data when in update mode
    useEffect(() => {
        const loadCustomerData = async () => {
            if (mode === 'update' && customerId && isOpen) {
                setLoadingCustomerData(true)
                try {
                    const response = await getSingleCustomer(customerId)
                    // Access data from the response structure
                    const customerData = response.data || response

                    // console.log('Loaded customer data:', customerData)

                    // Update form with customer data
                    form.reset({
                        vorname: customerData.vorname || '',
                        nachname: customerData.nachname || '',
                        email: customerData.email || '',
                        telefon: customerData.telefonnummer || '',
                        wohnort: customerData.wohnort || '',
                    })

                    // Store existing file URLs
                    const fileUrls: Record<string, string> = {}
                    if (customerData.picture_10) fileUrls.picture_10 = customerData.picture_10
                    if (customerData.picture_11) fileUrls.picture_11 = customerData.picture_11
                    if (customerData.picture_16) fileUrls.picture_16 = customerData.picture_16
                    if (customerData.picture_17) fileUrls.picture_17 = customerData.picture_17
                    if (customerData.picture_23) fileUrls.picture_23 = customerData.picture_23
                    if (customerData.picture_24) fileUrls.picture_24 = customerData.picture_24
                    if (customerData.threed_model_left) fileUrls.threed_model_left = customerData.threed_model_left
                    if (customerData.threed_model_right) fileUrls.threed_model_right = customerData.threed_model_right

                    setExistingFiles(fileUrls)
                } catch (error) {
                    // console.error('Error loading customer data:', error)
                } finally {
                    setLoadingCustomerData(false)
                }
            }
        }

        loadCustomerData()
    }, [mode, customerId, isOpen, form])

    // Reset form and file previews when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            // Clear form and file previews when modal closes
            form.reset({
                vorname: '',
                nachname: '',
                email: '',
                telefon: '',
                wohnort: '',
            })
            setFilePreviews([])
            setExistingFiles({})
        }
    }, [isOpen, form])

    const handleFileUpload = (fieldName: keyof CustomerFormData, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Update form value
        form.setValue(fieldName, file)

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
    }

    const removeFile = (fieldName: keyof CustomerFormData) => {
        form.setValue(fieldName, undefined)
        setFilePreviews(prev => prev.filter(p => p.fieldName !== fieldName))
        // Also remove from existing files if it exists
        setExistingFiles(prev => {
            const updated = { ...prev }
            delete updated[fieldName]
            return updated
        })
    }

    const getFileIcon = (fileName: string) => {
        if (fileName.includes('picture')) {
            return <FileImage className="w-4 h-4" />
        } else if (fileName.includes('threed_model')) {
            return <File className="w-4 h-4" />
        } else if (fileName.includes('csv')) {
            return <FileText className="w-4 h-4" />
        }
        return <File className="w-4 h-4" />
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

    const handleSubmit = async (data: CustomerFormData) => {
        // Manual validation
        if (!data.vorname.trim()) {
            form.setError('vorname', { message: 'Vorname ist erforderlich' })
            return
        }
        if (!data.nachname.trim()) {
            form.setError('nachname', { message: 'Nachname ist erforderlich' })
            return
        }
        if (!data.email.trim()) {
            form.setError('email', { message: 'E-Mail-Adresse ist erforderlich' })
            return
        }
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            form.setError('email', { message: 'Ungültige E-Mail-Adresse' })
            return
        }

        setIsSubmitting(true)
        try {
            // Create FormData to handle file uploads
            const formData = new FormData();

            // Add customer information
            formData.append('vorname', data.vorname);
            formData.append('nachname', data.nachname);
            formData.append('email', data.email);
            formData.append('telefon', data.telefon || '');
            formData.append('wohnort', data.wohnort || '');

            // Add files if they exist
            if (data.picture_10) {
                formData.append('picture_10', data.picture_10);
            }
            if (data.picture_11) {
                formData.append('picture_11', data.picture_11);
            }
            if (data.picture_16) {
                formData.append('picture_16', data.picture_16);
            }
            if (data.picture_17) {
                formData.append('picture_17', data.picture_17);
            }
            if (data.picture_23) {
                formData.append('picture_23', data.picture_23);
            }
            if (data.picture_24) {
                formData.append('picture_24', data.picture_24);
            }
            if (data.threed_model_left) {
                formData.append('threed_model_left', data.threed_model_left);
            }
            if (data.threed_model_right) {
                formData.append('threed_model_right', data.threed_model_right);
            }
            if (data.csvFile) {
                formData.append('csvFile', data.csvFile);
            }

            // Call the appropriate API based on mode
            let response;
            if (mode === 'update' && customerId) {
                response = await updateSingleCustomer(customerId, formData);
                // console.log('Update API Response:', response);
            } else {
                response = await addCustomer(formData);
                // console.log('Add API Response:', response);
            }

            // Call the parent onSubmit for any additional handling
            await onSubmit(data)

            form.reset()
            setFilePreviews([])
            onClose()
        } catch (error) {
            // console.error('Error submitting customer:', error)
            // You might want to show an error message to the user here
        } finally {
            setIsSubmitting(false)
        }
    }

    const fileFields: (keyof CustomerFormData)[] = [
        'picture_10',
        'picture_11',
        'picture_16',
        'picture_17',
        'picture_23',
        'picture_24',
        'csvFile'
    ]

    const threeDModelFields: (keyof CustomerFormData)[] = [
        'threed_model_left',
        'threed_model_right'
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {mode === 'update' ? 'Update Customer' : 'Manually Add a Customer'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Customer Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="vorname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Vorname *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Vorname eingeben"
                                                className="border border-gray-300 rounded-md"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nachname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Nachname *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nachname eingeben"
                                                className="border border-gray-300 rounded-md"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">E-Mail-Adresse *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="email@example.com"
                                                className="border border-gray-300 rounded-md"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="telefon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Telefonnummer</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="+49 123 456789"
                                                className="border border-gray-300 rounded-md"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="wohnort"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel className="text-sm font-medium">Wohnort</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Stadt, PLZ"
                                                className="border border-gray-300 rounded-md"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* File Upload Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Scan Files Upload</h3>

                            {/* 3D Model Files - Side by Side */}
                            <div className="space-y-2">
                                {/* <Label className="text-sm font-medium">3D Model Files</Label> */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {threeDModelFields.map((fieldName) => {
                                        const preview = filePreviews.find(p => p.fieldName === fieldName)
                                        const fieldValue = form.watch(fieldName) as File | undefined
                                        const existingFileUrl = existingFiles[fieldName]

                                        return (
                                            <div key={fieldName} className="space-y-2">
                                                <Label className="text-sm font-medium">{getFileLabel(fieldName)}</Label>

                                                {!fieldValue && !existingFileUrl ? (
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                                                        <input
                                                            type="file"
                                                            accept={getFileAccept(fieldName)}
                                                            onChange={(e) => handleFileUpload(fieldName, e)}
                                                            className="hidden"
                                                            id={`file-${fieldName}`}
                                                        />
                                                        <label htmlFor={`file-${fieldName}`} className="cursor-pointer">
                                                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                                            <p className="text-xs text-gray-600">Upload {getFileLabel(fieldName)}</p>
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="border border-gray-200 rounded-lg p-3 relative group">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(fieldName)}
                                                            className="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>

                                                        <div className="flex items-center space-x-2">
                                                            {getFileIcon(fieldName)}
                                                            <div className="flex-1 min-w-0">
                                                                {fieldValue ? (
                                                                    <>
                                                                        <p className="text-xs font-medium truncate">
                                                                            {fieldValue.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {(fieldValue.size / 1024 / 1024).toFixed(2)} MB
                                                                        </p>
                                                                    </>
                                                                ) : existingFileUrl ? (
                                                                    <>
                                                                        <p className="text-xs font-medium truncate">
                                                                            Existing {getFileLabel(fieldName)}
                                                                        </p>
                                                                        <p className="text-xs text-blue-600 truncate">
                                                                            {existingFileUrl}
                                                                        </p>
                                                                    </>
                                                                ) : null}
                                                            </div>
                                                        </div>

                                                        {/* Replace file option */}
                                                        {existingFileUrl && (
                                                            <div className="mt-2">
                                                                <input
                                                                    type="file"
                                                                    accept={getFileAccept(fieldName)}
                                                                    onChange={(e) => handleFileUpload(fieldName, e)}
                                                                    className="hidden"
                                                                    id={`file-replace-${fieldName}`}
                                                                />
                                                                <label htmlFor={`file-replace-${fieldName}`} className="text-xs text-blue-600 cursor-pointer hover:underline">
                                                                    Replace file
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Other Files */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Picture Files & CSV</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {fileFields.map((fieldName) => {
                                        const preview = filePreviews.find(p => p.fieldName === fieldName)
                                        const fieldValue = form.watch(fieldName) as File | undefined
                                        const existingFileUrl = existingFiles[fieldName]

                                        return (
                                            <div key={fieldName} className="space-y-2">
                                                <Label className="text-sm font-medium">{getFileLabel(fieldName)}</Label>

                                                {!fieldValue && !existingFileUrl ? (
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                                                        <input
                                                            type="file"
                                                            accept={getFileAccept(fieldName)}
                                                            onChange={(e) => handleFileUpload(fieldName, e)}
                                                            className="hidden"
                                                            id={`file-${fieldName}`}
                                                        />
                                                        <label htmlFor={`file-${fieldName}`} className="cursor-pointer">
                                                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                                            <p className="text-xs text-gray-600">Upload {getFileLabel(fieldName)}</p>
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="border border-gray-200 rounded-lg p-3 relative group">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(fieldName)}
                                                            className="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>

                                                        <div className="flex items-center space-x-2">
                                                            {getFileIcon(fieldName)}
                                                            <div className="flex-1 min-w-0">
                                                                {fieldValue ? (
                                                                    <>
                                                                        <p className="text-xs font-medium truncate">
                                                                            {fieldValue.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {(fieldValue.size / 1024 / 1024).toFixed(2)} MB
                                                                        </p>
                                                                    </>
                                                                ) : existingFileUrl ? (
                                                                    <>
                                                                        <p className="text-xs font-medium truncate">
                                                                            Existing {getFileLabel(fieldName)}
                                                                        </p>
                                                                        <p className="text-xs text-blue-600 truncate">
                                                                            {existingFileUrl.split('/').pop()}
                                                                        </p>
                                                                    </>
                                                                ) : null}
                                                            </div>
                                                        </div>

                                                        {/* Image Preview */}
                                                        {preview?.preview ? (
                                                            <div className="mt-2">
                                                                <img
                                                                    src={preview.preview}
                                                                    alt="Preview"
                                                                    className="w-full h-20 object-cover rounded border"
                                                                />
                                                            </div>
                                                        ) : existingFileUrl && fieldName.includes('picture') ? (
                                                            <div className="mt-2">
                                                                <img
                                                                    src={existingFileUrl}
                                                                    alt="Existing Preview"
                                                                    className="w-full h-20 object-cover rounded border"
                                                                />
                                                            </div>
                                                        ) : null}

                                                        {/* Replace file option */}
                                                        {existingFileUrl && !fieldValue && (
                                                            <div className="mt-2">
                                                                <input
                                                                    type="file"
                                                                    accept={getFileAccept(fieldName)}
                                                                    onChange={(e) => handleFileUpload(fieldName, e)}
                                                                    className="hidden"
                                                                    id={`file-replace-${fieldName}`}
                                                                />
                                                                <label htmlFor={`file-replace-${fieldName}`} className="text-xs text-blue-600 cursor-pointer hover:underline">
                                                                    Replace file
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Abbrechen
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || loadingCustomerData}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                        {mode === 'update' ? 'Updating...' : 'Speichern...'}
                                    </>
                                ) : loadingCustomerData ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                        Loading...
                                    </>
                                ) : (
                                    mode === 'update' ? 'Update Customer' : 'Kunde hinzufügen'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 