"use client"
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Benutzerverwaltung from "@/components/DashboardSettings/Benutzerverwaltung";
import ProfileImage from "@/components/DashboardSettings/ProfileImage";
import { useAuth } from "@/contexts/AuthContext";
import { RiEdit2Line, RiAddLine, RiDeleteBin6Line } from "react-icons/ri";
import { useUpdatePartnerInfo } from "@/hooks/updatePartnerInfo/useUpdatePartnerInfo";
import toast from 'react-hot-toast'


export default function UserManagementAccessRights() {

  const { user, setUser } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [accountName, setAccountName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [absenderEmail, setAbsenderEmail] = useState("")
  const [hauptstandort, setHauptstandort] = useState<string[]>([])

  const [newLocation, setNewLocation] = useState("")
  const [busnessName, setBusnessName] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankNumber, setBankNumber] = useState("")
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)


  const { update, isLoading } = useUpdatePartnerInfo()

  useEffect(() => {
    setAccountName(user?.name ?? "")
    setPhoneNumber(user?.phone ?? "")
    setAbsenderEmail(user?.absenderEmail ?? "")
    setBusnessName(user?.busnessName ?? "")
    setHauptstandort(user?.hauptstandort ?? [])
    setBankName(user?.bankName ?? "")
    setBankNumber(user?.bankNumber ?? "")
    setPreviewImageUrl(user?.image ?? null)
  }, [user])

  const handleImageChange = (file: File, dataUrl: string) => {
    setSelectedImageFile(file)
    setPreviewImageUrl(dataUrl)
  }



  const addNewLocation = () => {
    if (newLocation.trim() && !hauptstandort.includes(newLocation.trim())) {
      setHauptstandort([...hauptstandort, newLocation.trim()])
      setNewLocation("")
    }
  }

  const removeLocation = (locationToRemove: string) => {
    setHauptstandort(hauptstandort.filter(location => location !== locationToRemove))
  }

  const handleToggle = async () => {
    if (isEditing) {
      try {
        const res = await update({
          name: accountName,
          hauptstandort,
          phone: phoneNumber,
          absenderEmail,
          busnessName,
          bankName,
          bankNumber,
          image: selectedImageFile
        })
        if (user) {
          const newImage = (res?.user?.image as string) || previewImageUrl || user.image || null
          setUser({
            ...user,
            name: accountName,
            hauptstandort: hauptstandort,
            phone: phoneNumber,
            absenderEmail: absenderEmail,
            busnessName: busnessName,
            bankName: bankName,
            bankNumber: bankNumber,
            image: newImage
          })
        }
        toast.success('Profil erfolgreich aktualisiert')
      } catch (e: any) {
        toast.error(e?.message || 'Aktualisierung fehlgeschlagen')
        return
      }
    }
    setIsEditing(prev => !prev)
  }

  const handleCancel = () => {
    // revert local changes and exit edit
    setAccountName(user?.name ?? "")
    setHauptstandort(user?.hauptstandort ?? [])
    setNewLocation("")
    setPhoneNumber(user?.phone ?? "")
    setAbsenderEmail(user?.absenderEmail ?? "")
    setBusnessName(user?.busnessName ?? "")
    setBankName(user?.bankName ?? "")
    setBankNumber(user?.bankNumber ?? "")
    setSelectedImageFile(null)
    setPreviewImageUrl(user?.image ?? null)
    setIsEditing(false)
  }

  return (
    <div className="relative pt-10">
      <div className="absolute right-0 top-0 flex items-center gap-2 z-20">
        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-md border border-gray-200 bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            title="Änderungen verwerfen"
          >
            Abbrechen
          </button>
        )}
        <button
          type="button"
          aria-label={isEditing ? "Fertig" : "Bearbeiten"}
          title={isEditing ? "Fertig" : "Bearbeiten"}
          className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-md border text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${isEditing ? 'bg-[#4a8a6a] text-white border-[#4a8a6a] hover:bg-[#4a8a6a]/80' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
          onClick={handleToggle}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isEditing ? (
            isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Speichern…
              </>
            ) : (
              <>
                <RiEdit2Line className="text-base" />
                Fertig
              </>
            )
          ) : (
            <>
              <RiEdit2Line className="text-base" />
              Bearbeiten
            </>
          )}
        </button>
      </div>

      {/* Profile Image (extracted) */}
      <ProfileImage src={previewImageUrl ?? user?.image ?? null} editable={isEditing} onChange={handleImageChange} />

      {/* Partner ID */}
      <div className="text-center flex flex-col items-center mb-14 mt-5">
        <h1 className="font-bold text-lg tracking-wide mb-1">Partner ID</h1>
        <Input
          value={user?.id ?? ''}
          readOnly
          className="w-80 text-center bg-gray-100 border border-gray-200 rounded-lg mt-1 text-base font-semibold text-gray-700 py-2 tracking-wide cursor-not-allowed"
        />

      </div>


      {/* Business Account Form */}
      <div className="flex flex-col gap-4">
        {/* login and business name */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Geschäftsname</label>
            <Input
              type="text"
              value={busnessName}
              onChange={(e) => setBusnessName(e.target.value)}
              readOnly={!isEditing}
              className={`${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''} w-full`}
            />
          </div>

          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Log In Email</label>
            <Input
              type="email"
              className="w-full bg-gray-100 cursor-not-allowed"
              readOnly
              value={user?.email ?? ''}
            />

          </div>
        </div>


        {/* account name and create account button */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 w-full">

          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Hauptstandort</label>

            {/* Main field with locations and add input */}
            <div className={`min-h-[40px] border rounded-md p-2 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} flex flex-wrap gap-1`}>
              {/* Display selected locations */}
              {hauptstandort.map((location, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                >
                  {location}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeLocation(location)}
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      <RiDeleteBin6Line className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}

              {/* Add new location input - only show when editing */}
              {isEditing && (
                <div className="flex items-center gap-1">
                  <Input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Add location..."
                    className="border border-gray-300 shadow-sm p-1 h-auto text-sm min-w-[120px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addNewLocation()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addNewLocation}
                    disabled={!newLocation.trim() || hauptstandort.includes(newLocation.trim())}
                    className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Add location"
                  >
                    <RiAddLine className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Show placeholder when no locations */}
              {hauptstandort.length === 0 && !isEditing && (
                <span className="text-gray-500 text-sm">No locations added</span>
              )}
            </div>

          </div>
          <div className="w-full md:w-1/2">
            <label className="block text sm font-medium mb-1">Account-Name / Mitarbeiternamen</label>
            <Input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              readOnly={!isEditing}
              className={`${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''} w-full`}
            />
          </div>

        </div>

        {/* email and phone number of business */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Absender-E-Mail für Kundenmails</label>
            <Input
              type="email"
              value={absenderEmail}
              onChange={(e) => setAbsenderEmail(e.target.value)}
              readOnly={!isEditing}
              className={`${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''} w-full`}
            />
          </div>

          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Telefonnummer Geschäft</label>
            <Input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              readOnly={!isEditing}
              className={`${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''} w-full`}
            />
          </div>
        </div>

        {/* bank name and iban */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Bankname für den Empfang von Auszahlungen durch FeetF1rst</label>
            <Input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              readOnly={!isEditing || (user?.bankName !== null && user?.bankName !== "")}
              className={`${(!isEditing || (user?.bankName !== null && user?.bankName !== "")) ? 'bg-gray-100 cursor-not-allowed' : ''} w-full`}
            />
            {user?.bankName !== null && user?.bankName !== "" ? (
              <>
                <p className="text-xs text-gray-500 mt-1">
                  This field cannot be changed manually. If you believe the information is incorrect or needs to be updated, please click "Send Request to FeetF1rst" to submit a change request. Our team will review and update the data accordingly.
                </p>
                <button
                  type="button"
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Send Request to FeetF1rst
                </button>
              </>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Enter your bank name for receiving payments from FeetF1rst.
              </p>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">IBAN für den Empfang von Auszahlungen durch FeetF1rst</label>
            <Input
              type="text"
              value={bankNumber}
              onChange={(e) => setBankNumber(e.target.value)}
              readOnly={!isEditing || (user?.bankNumber !== null && user?.bankNumber !== "")}
              className={`${(!isEditing || (user?.bankNumber !== null && user?.bankNumber !== "")) ? 'bg-gray-100 cursor-not-allowed' : ''} w-full`}
            />
            {user?.bankNumber !== null && user?.bankNumber !== "" ? (
              <>
                <p className="text-xs text-gray-500 mt-1">
                  This field cannot be changed manually. If you believe the information is incorrect or needs to be updated, please click "Send Request to FeetF1rst" to submit a change request. Our team will review and update the data accordingly.
                </p>
                <button
                  type="button"
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Send Request to FeetF1rst
                </button>
              </>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Enter your IBAN for receiving payments from FeetF1rst.
              </p>
            )}
          </div>
        </div>
      </div>
      {/* User Management Section (extracted) */}
      <Benutzerverwaltung />
    </div>
  );
}
