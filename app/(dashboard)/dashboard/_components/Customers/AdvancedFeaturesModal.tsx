import React, { useState, useEffect } from 'react'
import { ScanData } from '@/types/scan'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useSingleCustomer } from '@/hooks/customer/useSingleCustomer'
import { useUpdateCustomerInfo } from '@/hooks/customer/useUpdateCustomerInfo'
import toast from 'react-hot-toast'

interface AdvancedFeaturesModalProps {
    scanData: ScanData;
    trigger: React.ReactNode;
}

export default function AdvancedFeaturesModal({ scanData, trigger }: AdvancedFeaturesModalProps) {
    // Use the hooks for customer data and updates
    const { customer, loading, error, refreshCustomer } = useSingleCustomer(scanData.id)
    const { updateCustomerInfo, isUpdating, error: updateError } = useUpdateCustomerInfo()

    // State for modal form data - only the 5 specific fields
    const [modalFormData, setModalFormData] = useState({
        kundeSteuernummer: '',
        diagnose: '',
        kodexeMassschuhe: '',
        kodexeEinlagen: '',
        sonstiges: ''
    });

    // Update modal form data when customer data changes
    useEffect(() => {
        if (customer) {
            setModalFormData({
                kundeSteuernummer: customer.kundeSteuernummer || '',
                diagnose: customer.diagnose || '',
                kodexeMassschuhe: customer.kodexeMassschuhe || '',
                kodexeEinlagen: customer.kodexeEinlagen || '',
                sonstiges: customer.sonstiges || ''
            });
        }
    }, [customer]);

    // Handle form input changes
    const handleInputChange = (field: string, value: string) => {
        setModalFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle form submission
    const handleFormSubmit = async () => {
        if (!customer?.id) return;

        try {
            const success = await updateCustomerInfo(customer.id, modalFormData);
            if (success) {
                // Refresh customer data to get updated information
                await refreshCustomer();
                toast.success('Kundendaten erfolgreich aktualisiert');
            }
        } catch (err) {
            console.error('Failed to update customer:', err);
        }
    };

    // Handle reset
    const handleReset = () => {
        if (customer) {
            setModalFormData({
                kundeSteuernummer: customer.kundeSteuernummer || '',
                diagnose: customer.diagnose || '',
                kodexeMassschuhe: customer.kodexeMassschuhe || '',
                kodexeEinlagen: customer.kodexeEinlagen || '',
                sonstiges: customer.sonstiges || ''
            });
        }
    };

    if (loading) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#62A07C] mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading customer data...</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (error) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <div className="text-center py-8">
                        <p className="text-red-600">Error: {error}</p>
                        <Button onClick={() => refreshCustomer()} className="mt-4">
                            Retry
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Erweiterte Kundendaten - {customer?.vorname} {customer?.nachname}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Kunde Steuernummer */}
                    <div className="space-y-2">
                        <Label htmlFor="kundeSteuernummer" className="text-sm font-medium">
                            Kunde Steuernummer
                        </Label>
                        <Input
                            id="kundeSteuernummer"
                            placeholder="Kunde Steuernummer"
                            value={modalFormData.kundeSteuernummer}
                            onChange={(e) => handleInputChange('kundeSteuernummer', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Diagnose */}
                    <div className="space-y-2">
                        <Label htmlFor="diagnose" className="text-sm font-medium">
                            Diagnose
                        </Label>
                        <Input
                            id="diagnose"
                            placeholder="Diagnose"
                            value={modalFormData.diagnose}
                            onChange={(e) => handleInputChange('diagnose', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Kodexe Massschuhe */}
                    <div className="space-y-2">
                        <Label htmlFor="kodexeMassschuhe" className="text-sm font-medium">
                            Kodexe Massschuhe
                        </Label>
                        <Input
                            id="kodexeMassschuhe"
                            placeholder="Kodexe Massschuhe"
                            value={modalFormData.kodexeMassschuhe}
                            onChange={(e) => handleInputChange('kodexeMassschuhe', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Kodexe Einlagen */}
                    <div className="space-y-2">
                        <Label htmlFor="kodexeEinlagen" className="text-sm font-medium">
                            Kodexe Einlagen
                        </Label>
                        <Input
                            id="kodexeEinlagen"
                            placeholder="Kodexe Einlagen"
                            value={modalFormData.kodexeEinlagen}
                            onChange={(e) => handleInputChange('kodexeEinlagen', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Sonstiges */}
                    <div className="space-y-2">
                        <Label htmlFor="sonstiges" className="text-sm font-medium">
                            Sonstiges
                        </Label>
                        <Textarea
                            id="sonstiges"
                            placeholder="Sonstiges"
                            value={modalFormData.sonstiges}
                            onChange={(e) => handleInputChange('sonstiges', e.target.value)}
                            className="w-full min-h-[100px] resize-none"
                        />
                    </div>

                    {/* Error Display */}
                    {updateError && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-600 text-sm">{updateError}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className='flex justify-end'>
                        <Button
                            onClick={handleFormSubmit}
                            className="bg-[#62A07C] cursor-pointer transform duration-300 hover:bg-[#4A8A6A]"
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Speichern...' : 'Speichern'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
