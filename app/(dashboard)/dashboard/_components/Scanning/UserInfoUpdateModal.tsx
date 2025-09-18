import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScanData } from '@/types/scan'
import { usePriceManagement } from '@/hooks/priceManagement/usePriceManagement'
import { useCreateOrder } from '@/hooks/orders/useCreateOrder'
import { useUpdateCustomerInfo } from '@/hooks/customer/useUpdateCustomerInfo'
import { useSearchEmployee } from '@/hooks/employee/useSearchEmployee'
import toast from 'react-hot-toast'
import { ChevronDown, Check } from 'lucide-react'

interface UserInfoUpdateModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  scanData: ScanData | null
  onInfoUpdate?: () => void
  onContinue?: () => void
  onCustomerUpdate?: (updatedCustomer: any) => void
  onShowOrderConfirmation?: () => void
}

export default function UserInfoUpdateModal({ isOpen, onOpenChange, scanData, onInfoUpdate, onContinue, onShowOrderConfirmation }: UserInfoUpdateModalProps) {
  // Customer Information State
  const [vorname, setVorname] = useState('')
  const [nachname, setNachname] = useState('')
  const [email, setEmail] = useState('')
  const [telefonnummer, setTelefonnummer] = useState('')
  const [wohnort, setWohnort] = useState('')
  const [mitarbeiter, setMitarbeiter] = useState('')
  const [versorgung, setVersorgung] = useState('')
  const [datumAuftrag, setDatumAuftrag] = useState('')
  const [geschaeftsstandort, setGeschaeftsstandort] = useState('')
  const [fertigstellungBis, setFertigstellungBis] = useState('')
  const [bezahlt, setBezahlt] = useState('')

  // Price State
  const [footAnalysisPrice, setFootAnalysisPrice] = useState<string>('')
  const [insoleSupplyPrice, setInsoleSupplyPrice] = useState<string>('')
  const [customFootPrice, setCustomFootPrice] = useState<string>('')
  const [customInsolePrice, setCustomInsolePrice] = useState<string>('')

  const { prices, loading: pricesLoading, fetchPrices } = usePriceManagement()
  const { customOrderCreates, isCreating } = useCreateOrder()
  const { updateCustomerInfo, isUpdating } = useUpdateCustomerInfo()

  // Employee search functionality
  const {
    searchText,
    suggestions: employeeSuggestions,
    loading: employeeLoading,
    setShowSuggestions,
    handleChange: handleEmployeeSearchChange,
  } = useSearchEmployee()

  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false)

  useEffect(() => {
    if (scanData) {
      setVorname(scanData.vorname || '')
      setNachname(scanData.nachname || '')
      setEmail(scanData.email || '')
      setTelefonnummer(scanData.telefonnummer || '')
      setWohnort(scanData.wohnort || '')
      // prefer workshopNote.employeeName
      const employeeName = (scanData as any)?.workshopNote?.employeeName
      setMitarbeiter(employeeName || scanData.mitarbeiter || '')
      setVersorgung(scanData.versorgung || '')
      // Datum des Auftrags defaults to today if not provided
      const today = new Date().toISOString().slice(0, 10)
      setDatumAuftrag((scanData as any)?.datumAuftrag || today)
      // Geschäftsstandort from partner when sameAsBusiness is true; else blank
      const sameAsBusiness = (scanData as any)?.workshopNote?.sameAsBusiness
      const partnerHauptstandort = (scanData as any)?.partner?.hauptstandort
      setGeschaeftsstandort(sameAsBusiness ? (partnerHauptstandort || '') : '')
      // Fertigstellung bis from workshopNote.completionDays if present
      const completionDays = (scanData as any)?.workshopNote?.completionDays as string | undefined
      const formattedCompletion = completionDays ? completionDays.slice(0, 10) : ''
      const currentOrderDate = (scanData as any)?.datumAuftrag || today
      const existingDeliveryDate = formattedCompletion || scanData.fertigstellungBis || ''
      
      // If no existing delivery date and order date is today, set minimum delivery date
      if (!existingDeliveryDate && currentOrderDate === today) {
        const minimumDelivery = new Date(today)
        minimumDelivery.setDate(minimumDelivery.getDate() + 5)
        setFertigstellungBis(minimumDelivery.toISOString().slice(0, 10))
      } else {
        setFertigstellungBis(existingDeliveryDate)
      }
      setBezahlt(scanData.bezahlt || '')
      setFootAnalysisPrice(
        typeof scanData.fußanalyse === 'number' ? String(scanData.fußanalyse) : (scanData.fußanalyse || '')
      )
      setInsoleSupplyPrice(
        typeof scanData.einlagenversorgung === 'number' ? String(scanData.einlagenversorgung) : (scanData.einlagenversorgung || '')
      )
    }
  }, [scanData, isOpen])

  // Fetch prices when modal opens (only once)
  useEffect(() => {
    if (isOpen && prices.length === 0) {
      fetchPrices(1, 100)
    }
  }, [isOpen, fetchPrices, prices.length])

  // Handle employee selection
  const handleEmployeeSelect = (employeeName: string) => {
    setMitarbeiter(employeeName)
    setIsEmployeeDropdownOpen(false)
  }

  // Handle dropdown open/close
  const handleDropdownChange = (open: boolean) => {
    setIsEmployeeDropdownOpen(open)
    setShowSuggestions(open)
  }

  // Helper function to calculate minimum delivery date (5 days from order date)
  const getMinimumDeliveryDate = (orderDate: string) => {
    const order = new Date(orderDate)
    const minimumDelivery = new Date(order)
    minimumDelivery.setDate(order.getDate() + 5)
    return minimumDelivery.toISOString().slice(0, 10)
  }

  // Handle order date change and validate delivery date
  const handleOrderDateChange = (newOrderDate: string) => {
    setDatumAuftrag(newOrderDate)
    
    if (newOrderDate) {
      const minimumDeliveryDate = getMinimumDeliveryDate(newOrderDate)
      
      // If current delivery date is earlier than minimum, update it
      if (!fertigstellungBis || new Date(fertigstellungBis) < new Date(minimumDeliveryDate)) {
        setFertigstellungBis(minimumDeliveryDate)
      }
    }
  }

  // Validate delivery date when it changes
  const handleDeliveryDateChange = (newDeliveryDate: string) => {
    if (datumAuftrag && newDeliveryDate) {
      const minimumDeliveryDate = getMinimumDeliveryDate(datumAuftrag)
      
      // If selected delivery date is earlier than minimum, show warning and set minimum
      if (new Date(newDeliveryDate) < new Date(minimumDeliveryDate)) {
        toast.error(`Fertigstellung muss mindestens 5 Tage nach Auftragsdatum sein. Minimum: ${minimumDeliveryDate}`)
        setFertigstellungBis(minimumDeliveryDate)
        return
      }
    }
    setFertigstellungBis(newDeliveryDate)
  }

  const handleSave = async () => {
    if (!scanData?.id) {
      toast.error('Customer ID not found')
      return
    }

    try {
      const parsedFoot = Number(footAnalysisPrice)
      const parsedInsole = Number(insoleSupplyPrice)

      // First update prices on the customer record
      const priceUpdateSuccess = await updateCustomerInfo(scanData.id, {
        fußanalyse: isNaN(parsedFoot) ? 0 : parsedFoot,
        einlagenversorgung: isNaN(parsedInsole) ? 0 : parsedInsole
      })

      if (!priceUpdateSuccess) {
        toast.error('Preis-Update fehlgeschlagen')
        return
      }

      const auftragsIso = datumAuftrag ? `${datumAuftrag}T00:00:00.000Z` : undefined
      const fertigIso = fertigstellungBis ? `${fertigstellungBis}T00:00:00.000Z` : undefined
      const payload = {
        kundenName: `${vorname} ${nachname}`.trim(),
        auftragsDatum: auftragsIso,
        wohnort: wohnort || undefined,
        telefon: telefonnummer || undefined,
        email: email || undefined,
        geschaeftsstandort: geschaeftsstandort || undefined,
        mitarbeiter: mitarbeiter || undefined,
        fertigstellungBis: fertigIso,
        versorgung: versorgung || undefined,
        bezahlt: Boolean(bezahlt === 'Ja' || bezahlt === 'true' || bezahlt === 'True'),
        fussanalysePreis: isNaN(parsedFoot) ? 0 : parsedFoot,
        einlagenversorgungPreis: isNaN(parsedInsole) ? 0 : parsedInsole,
      }

      const res = await customOrderCreates(scanData.id, payload)
      const createdId = (res as any)?.data?.id ?? (res as any)?.id
      if (createdId) {
        try { localStorage.setItem('werkstattzettelId', createdId) } catch { }
      }

      onOpenChange(false)
      onShowOrderConfirmation?.()
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || err?.message || 'Speichern fehlgeschlagen'
      toast.error(apiMessage)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-bold">Werkstattzettel</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Customer Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Name Kunde</Label>
                <Input
                  placeholder="Einkaufspreis"
                  value={`${vorname} ${nachname}`.trim()}
                  onChange={(e) => {
                    const fullName = e.target.value
                    const nameParts = fullName.split(' ')
                    setVorname(nameParts[0] || '')
                    setNachname(nameParts.slice(1).join(' ') || '')
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Wohnort</Label>
                <Input
                  placeholder="Hamburg"
                  value={wohnort}
                  onChange={(e) => setWohnort(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">E-Mail</Label>
                <Input
                  type="email"
                  placeholder="Mustermann.Max@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Mitarbeiter</Label>
                <Popover open={isEmployeeDropdownOpen} onOpenChange={handleDropdownChange}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isEmployeeDropdownOpen}
                      className="w-full justify-between font-normal"
                    >
                      <span className="truncate">
                        {mitarbeiter || "Mitarbeiter auswählen..."}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <div className="p-2">
                      <Input
                        placeholder="Mitarbeiter suchen..."
                        value={searchText}
                        onChange={(e) => handleEmployeeSearchChange(e.target.value)}
                        className="w-full"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {employeeLoading ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          Lade Mitarbeiter...
                        </div>
                      ) : employeeSuggestions.length > 0 ? (
                        <div className="py-1">
                          {employeeSuggestions.map((employee) => (
                            <div
                              key={employee.id}
                              className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors duration-150 ${mitarbeiter === employee.employeeName
                                  ? 'bg-blue-50 hover:bg-blue-100 border-l-2 border-blue-500'
                                  : 'hover:bg-gray-100'
                                }`}
                              onClick={() => handleEmployeeSelect(employee.employeeName)}
                            >
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className={`text-sm font-medium truncate ${mitarbeiter === employee.employeeName
                                    ? 'text-blue-900'
                                    : 'text-gray-900'
                                  }`}>
                                  {employee.employeeName}
                                </span>
                                {employee.email && (
                                  <span className={`text-xs truncate ${mitarbeiter === employee.employeeName
                                      ? 'text-blue-600'
                                      : 'text-gray-500'
                                    }`}>
                                    {employee.email}
                                  </span>
                                )}
                              </div>
                              {mitarbeiter === employee.employeeName && (
                                <Check className="h-4 w-4 text-blue-600 ml-2 flex-shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                          Keine Mitarbeiter gefunden
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Versorgung</Label>
                <Input
                  placeholder="Rohling 339821769, mit Pelotte"
                  value={versorgung}
                  onChange={(e) => setVersorgung(e.target.value)}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Datum des Auftrags</Label>
                <Input
                  type="date"
                  placeholder="01.02.2025"
                  value={datumAuftrag}
                  onChange={(e) => handleOrderDateChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Telefon</Label>
                <Input
                  placeholder="+49 432 234 23"
                  value={telefonnummer}
                  onChange={(e) => setTelefonnummer(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Geschäftstandort</Label>
                <Input
                  placeholder="Bremen"
                  value={geschaeftsstandort}
                  onChange={(e) => setGeschaeftsstandort(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Fertigstellung bis</Label>
                <Input
                  type="date"
                  placeholder="10.02.2025"
                  value={fertigstellungBis}
                  onChange={(e) => handleDeliveryDateChange(e.target.value)}
                  min={datumAuftrag ? getMinimumDeliveryDate(datumAuftrag) : undefined}
                />
                {/* {datumAuftrag && (
                  <p className="text-xs text-gray-500">
                    Minimum: {getMinimumDeliveryDate(datumAuftrag)} (5 Tage nach Auftragsdatum)
                  </p>
                )} */}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Bezahlt</Label>
                <Select value={bezahlt} onValueChange={setBezahlt}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ja" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ja">Ja</SelectItem>
                    <SelectItem value="Nein">Nein</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Preise</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Fußanalyse</Label>
                <Select value={footAnalysisPrice} onValueChange={setFootAnalysisPrice}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={pricesLoading ? "Lade Preise..." : "Preis auswählen"} />
                  </SelectTrigger>
                  <SelectContent>

                    {prices.map((price) => (
                      <SelectItem className='cursor-pointer' key={`foot-${price.id}`} value={String(price.fußanalyse)}>
                        {price.fußanalyse}€
                      </SelectItem>
                    ))}

                  </SelectContent>
                </Select>
                {footAnalysisPrice === 'custom' && (
                  <Input
                    type="number"
                    placeholder="Preis eingeben"
                    value={customFootPrice}
                    onChange={(e) => setCustomFootPrice(e.target.value)}
                    className="w-full mt-2"
                  />
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Einlagenversorgung</Label>
                <Select value={insoleSupplyPrice} onValueChange={setInsoleSupplyPrice}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={pricesLoading ? "Lade Preise..." : "Preis auswählen"} />
                  </SelectTrigger>
                  <SelectContent >
                    {prices.map((price) => (
                      <SelectItem className='cursor-pointer' key={`insole-${price.id}`} value={String(price.einlagenversorgung)}>
                        {price.einlagenversorgung}€
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {insoleSupplyPrice === 'custom' && (
                  <Input
                    type="number"
                    placeholder="Preis eingeben"
                    value={customInsolePrice}
                    onChange={(e) => setCustomInsolePrice(e.target.value)}
                    className="w-full mt-2"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Display intentionally removed; toast handles errors */}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            className='cursor-pointer'
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating || isUpdating}
          >
            Abbrechen
          </Button>
          <Button type="button" className='cursor-pointer' onClick={handleSave} disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? 'loading...' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
