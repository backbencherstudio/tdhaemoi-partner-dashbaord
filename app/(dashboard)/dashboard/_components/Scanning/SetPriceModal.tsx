import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScanData } from '@/types/scan'
import { useUpdateCustomerInfo } from '@/hooks/customer/useUpdateCustomerInfo'
import toast from 'react-hot-toast'

interface SetPriceModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    scanData: ScanData | null
    onPriceUpdate?: () => void
}

export default function SetPriceModal({ isOpen, onOpenChange, scanData, onPriceUpdate }: SetPriceModalProps) {
    const [vatInclusive, setVatInclusive] = useState(true)
    const [footAnalysisPrice, setFootAnalysisPrice] = useState<string>('')
    const [insoleSupplyPrice, setInsoleSupplyPrice] = useState<string>('')

    const { updateCustomerInfo, isUpdating, error } = useUpdateCustomerInfo()

    useEffect(() => {
        if (scanData) {
            setFootAnalysisPrice(
                typeof scanData.fußanalyse === 'number' ? String(scanData.fußanalyse) : (scanData.fußanalyse || '')
            )
            setInsoleSupplyPrice(
                typeof scanData.einlagenversorgung === 'number' ? String(scanData.einlagenversorgung) : (scanData.einlagenversorgung || '')
            )
        }
    }, [scanData, isOpen])

    const handleSave = async () => {
        if (!scanData?.id) {
            toast.error('Customer ID not found')
            return
        }

        try {
            const parsedFoot = Number(footAnalysisPrice)
            const parsedInsole = Number(insoleSupplyPrice)

            const updateData = {
                fußanalyse: isNaN(parsedFoot) ? 0 : parsedFoot,
                einlagenversorgung: isNaN(parsedInsole) ? 0 : parsedInsole
            }

            const success = await updateCustomerInfo(scanData.id, updateData)

            if (success) {
                toast.success('Prices updated successfully!')
                onPriceUpdate?.()
                onOpenChange(false)
            } else {
                toast.error('Failed to update prices')
            }
        } catch (err) {
            toast.error('Error updating prices')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Preisverwaltung</DialogTitle>
                    {scanData && (
                        <p className="text-sm text-gray-600 mt-1">
                            Kunde: <span className="font-medium">{scanData.vorname} {scanData.nachname}</span>
                        </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                        Legen Sie Standardpreise an, um sie später bei Aufträgen schnell auszuwählen.
                    </p>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                    {/* VAT Section */}
                    {/* <div className="space-y-3">
                        <Label className="text-base font-semibold">Mehrwertsteuer</Label>
                        <div className="space-y-2 flex items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    className='cursor-pointer'
                                    id="vat-inclusive"
                                    checked={vatInclusive}
                                    onChange={(e) => setVatInclusive(e.target.checked)}
                                    tabIndex={-1}
                                    onFocus={(e) => e.target.blur()}
                                />
                                <Label htmlFor="vat-inclusive">Preise inkl. MwSt. anzeigen</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    className='cursor-pointer'
                                    id="vat-exclusive"
                                    checked={!vatInclusive}
                                    onChange={(e) => setVatInclusive(!e.target.checked)}
                                    tabIndex={-1}
                                    onFocus={(e) => e.target.blur()}
                                />
                                <Label htmlFor="vat-exclusive">Preise exkl. MwSt. anzeigen</Label>
                            </div>
                        </div>
                    </div> */}

                    {/* Foot Analysis Section */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Fußanalyse</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="number"
                                placeholder="Preis eingeben"
                                value={footAnalysisPrice}
                                onChange={(e) => setFootAnalysisPrice(e.target.value)}
                                className="flex-1"
                            />

                        </div>
                    </div>

                    {/* Insole Supply Section */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Einlagenversorgung</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="number"
                                placeholder="Preis eingeben"
                                value={insoleSupplyPrice}
                                onChange={(e) => setInsoleSupplyPrice(e.target.value)}
                                className="flex-1"
                            />

                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                    <Button
                        type="button"
                        className='cursor-pointer'
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isUpdating}
                    >
                        Abbrechen
                    </Button>
                    <Button type="button" className='cursor-pointer' onClick={handleSave} disabled={isUpdating}>
                        {isUpdating ? 'Speichern...' : 'Speichern'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
