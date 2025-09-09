import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScanData } from '@/types/scan'
import { useUpdateCustomerInfo } from '@/hooks/customer/useUpdateCustomerInfo'
import toast from 'react-hot-toast'

interface UserInfoUpdateModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  scanData: ScanData | null
  onInfoUpdate?: () => void
}

export default function UserInfoUpdateModal({ isOpen, onOpenChange, scanData, onInfoUpdate }: UserInfoUpdateModalProps) {
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

  const { updateCustomerInfo, isUpdating, error } = useUpdateCustomerInfo()

  useEffect(() => {
    if (scanData) {
      setVorname(scanData.vorname || '')
      setNachname(scanData.nachname || '')
      setEmail(scanData.email || '')
      setTelefonnummer(scanData.telefonnummer || '')
      setWohnort(scanData.wohnort || '')
      setMitarbeiter(scanData.mitarbeiter || '')
      setVersorgung(scanData.versorgung || '')
      setDatumAuftrag(scanData.datumAuftrag || '')
      setGeschaeftsstandort(scanData.geschaeftsstandort || '')
      setFertigstellungBis(scanData.fertigstellungBis || '')
      setBezahlt(scanData.bezahlt || '')
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
      // Handle custom prices
      const finalFootPrice = footAnalysisPrice === 'custom' ? customFootPrice : footAnalysisPrice
      const finalInsolePrice = insoleSupplyPrice === 'custom' ? customInsolePrice : insoleSupplyPrice

      const parsedFoot = Number(finalFootPrice)
      const parsedInsole = Number(finalInsolePrice)

      const updateData = {
        vorname,
        nachname,
        email,
        telefonnummer,
        wohnort,
        mitarbeiter,
        versorgung,
        datumAuftrag,
        geschaeftsstandort,
        fertigstellungBis,
        bezahlt,
        fußanalyse: isNaN(parsedFoot) ? 0 : parsedFoot,
        einlagenversorgung: isNaN(parsedInsole) ? 0 : parsedInsole
      }

      const success = await updateCustomerInfo(scanData.id, updateData)

      if (success) {
        toast.success('Customer information updated successfully!')
        onInfoUpdate?.()
        onOpenChange(false)
      } else {
        toast.error('Failed to update customer information')
      }
    } catch (err) {
      toast.error('Error updating customer information')
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
                <Input
                  placeholder="Johannes"
                  value={mitarbeiter}
                  onChange={(e) => setMitarbeiter(e.target.value)}
                />
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
                  onChange={(e) => setDatumAuftrag(e.target.value)}
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
                  onChange={(e) => setFertigstellungBis(e.target.value)}
                />
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
                    <SelectValue placeholder="Preis auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Kostenlos</SelectItem>
                    <SelectItem value="25">25€</SelectItem>
                    <SelectItem value="30">30€</SelectItem>
                    <SelectItem value="35">35€</SelectItem>
                    <SelectItem value="40">40€</SelectItem>
                    <SelectItem value="45">45€</SelectItem>
                    <SelectItem value="50">50€</SelectItem>
                    <SelectItem value="55">55€</SelectItem>
                    <SelectItem value="60">60€</SelectItem>
                    <SelectItem value="65">65€</SelectItem>
                    <SelectItem value="70">70€</SelectItem>
                    <SelectItem value="75">75€</SelectItem>
                    <SelectItem value="80">80€</SelectItem>
                    <SelectItem value="85">85€</SelectItem>
                    <SelectItem value="90">90€</SelectItem>
                    <SelectItem value="95">95€</SelectItem>
                    <SelectItem value="100">100€</SelectItem>
                    <SelectItem value="custom">Andere (manuell eingeben)</SelectItem>
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
                    <SelectValue placeholder="Preis auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Kostenlos</SelectItem>
                    <SelectItem value="80">80€</SelectItem>
                    <SelectItem value="90">90€</SelectItem>
                    <SelectItem value="100">100€</SelectItem>
                    <SelectItem value="110">110€</SelectItem>
                    <SelectItem value="120">120€</SelectItem>
                    <SelectItem value="130">130€</SelectItem>
                    <SelectItem value="140">140€</SelectItem>
                    <SelectItem value="150">150€</SelectItem>
                    <SelectItem value="160">160€</SelectItem>
                    <SelectItem value="170">170€</SelectItem>
                    <SelectItem value="180">180€</SelectItem>
                    <SelectItem value="190">190€</SelectItem>
                    <SelectItem value="200">200€</SelectItem>
                    <SelectItem value="220">220€</SelectItem>
                    <SelectItem value="240">240€</SelectItem>
                    <SelectItem value="250">250€</SelectItem>
                    <SelectItem value="280">280€</SelectItem>
                    <SelectItem value="300">300€</SelectItem>
                    <SelectItem value="custom">Andere (manuell eingeben)</SelectItem>
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
