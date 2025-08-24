import React, { useState, useEffect } from 'react'
import { ScanData } from '@/types/scan'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface AdvancedFeaturesModalProps {
    scanData: ScanData;
    trigger: React.ReactNode;
}

export default function AdvancedFeaturesModal({ scanData, trigger }: AdvancedFeaturesModalProps) {
    // State for modal form data
    const [modalFormData, setModalFormData] = useState({
        kundeSteuernummer: '',
        diagnose: '',
        kodexeMassschuhe: '',
        kodexeEinlagen: '',
        sonstiges: ''
    });

    // Update modal form data when scanData changes
    useEffect(() => {
        if (scanData) {
            setModalFormData({
                kundeSteuernummer: scanData.kundeSteuernummer || '',
                diagnose: scanData.diagnose || '',
                kodexeMassschuhe: scanData.kodexeMassschuhe || '',
                kodexeEinlagen: scanData.kodexeEinlagen || '',
                sonstiges: scanData.sonstiges || ''
            });
        }
    }, [scanData]);

    // Handle form input changes
    const handleInputChange = (field: string, value: string) => {
        setModalFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle form submission
    const handleFormSubmit = () => {
        // Here you can add logic to save the form data
        console.log('Form data:', modalFormData);
        // You can call an API to update the customer data
    };

    // Handle reset
    const handleReset = () => {
        setModalFormData({
            kundeSteuernummer: scanData?.kundeSteuernummer || '',
            diagnose: scanData?.diagnose || '',
            kodexeMassschuhe: scanData?.kodexeMassschuhe || '',
            kodexeEinlagen: scanData?.kodexeEinlagen || '',
            sonstiges: scanData?.sonstiges || ''
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Erweiterte Kundendaten - {scanData.vorname} {scanData.nachname}
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

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={handleReset} className='cursor-pointer bg-gray-300 text-black'>
                            Reset
                        </Button>
                        <Button onClick={handleFormSubmit} className="bg-[#62A07C] cursor-pointer transform duration-300 hover:bg-[#4A8A6A]">
                            Speichern
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
