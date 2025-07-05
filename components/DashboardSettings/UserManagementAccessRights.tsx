"use client"
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaCamera } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { RiUserAddLine } from "react-icons/ri";

export function ProfileAvatar({ logo, onLogoChange }: { logo: string | null, onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="relative w-28 h-28 mb-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-gray-200 shadow-md group cursor-pointer transition-all duration-200"
      tabIndex={0}
      onClick={() => fileInputRef.current?.click()}
      onKeyPress={e => { if (e.key === "Enter") fileInputRef.current?.click(); }}
      title="Logo hochladen"
    >
      {logo ? (
        <img
          src={logo}
          alt="Logo Preview"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-gray-300 text-4xl">+</span>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={onLogoChange}
      />
      {/* Camera Icon Overlay */}
      <div
        className="absolute bottom-3 right-3 bg-black/90 group-hover:bg-blue-600 border-2 border-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg transition-all duration-200"
        onClick={e => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        title="Logo ändern"
      >
        <FaCamera className="text-white text-lg" />
      </div>
    </div>
  );
}

export default function UserManagementAccessRights() {
  const [partnerId, setPartnerId] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // User management state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [expandedUserIndex, setExpandedUserIndex] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([
    {
      accountName: "Accountname 1",
      employeeName: "Mitarbeiter 1",
      email: "user1@example.com",
      password: "••••••••",
      financeAccess: true,
    },
    {
      accountName: "Accountname 2",
      employeeName: "Mitarbeiter 2",
      email: "user2@example.com",
      password: "••••••••",
      financeAccess: false,
    },
    {
      accountName: "Accountname 3",
      employeeName: "Mitarbeiter 3",
      email: "user3@example.com",
      password: "••••••••",
      financeAccess: true,
    },
  ]);
  // Add user form state
  const [newUser, setNewUser] = useState({
    accountName: "",
    employeeName: "",
    email: "",
    password: "",
    financeAccess: false,
  });

  useEffect(() => {
    let storedId = localStorage.getItem("partnerId");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("partnerId", storedId);
    }
    setPartnerId(storedId);
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="">
      {/* Profile Card */}
      <div className=" flex flex-col items-center relative">
        {/* Logo Avatar with Camera Icon */}
        <div className="relative mb-4">
          <div
            className="relative w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border-2 border-[#62A07C] overflow-hidden shadow-md group cursor-pointer transition-all duration-200"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyPress={e => { if (e.key === "Enter") fileInputRef.current?.click(); }}
            title="Logo hochladen"
          >
            {logo ? (
              <Image
                width={100}
                height={100}
                src={logo}
                alt="Logo Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-300 text-4xl">+</span>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
          {/* Camera Icon Overlay - positioned outside the overflow-hidden container */}
          <div
            className="absolute bottom-0 -right-0 bg-black/90 group-hover:bg-blue-600 border border-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer z-10"
            onClick={e => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            title="Logo ändern"
          >
            <FaCamera className="text-white text-lg" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center max-w-lg">Laden Sie hier Ihr Firmenlogo hoch, um es an verschiedenen Stellen wie Werkstattzetteln, Rechnungen und der Partnerübersicht anzuzeigen.</p>
      </div>

      {/* Partner ID */}
      <div className="text-center flex flex-col items-center mb-14 mt-5">
        <h1 className="font-bold text-lg tracking-wide mb-1">Partner ID</h1>
        <Input
          value={partnerId}
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
            <Input type="text" className="w-full" />
          </div>

          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Log In Email</label>
            <Input
              type="email"
              className="w-full bg-gray-100 cursor-not-allowed"
              readOnly
              value="partner@example.com"
            />

          </div>
        </div>

        {/* account name and create account button */}
        <div className="flex flex-col md:flex-row md:items-end gap-2 w-full">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Account-Name / Mitarbeiternamen</label>
            <Input type="text" className="w-full" />
          </div>
          <div className="w-full md:w-1/2">
            <button
              type="button"
              className="md:ml-4 cursor-pointer underline hover:text-blue-600 transition-colors"
              onClick={() => setShowAddUserModal(true)}
            >
              Neuen Account für Mitarbeiter erstellen
            </button>
          </div>
        </div>


        {/* main and other locations */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Hauptstandort</label>
            <Input type="text" className="w-full" />
          </div>

          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Weitere Standorte</label>
            <Input type="text" className="w-full" />
          </div>
        </div>

        {/* email and phone number of business */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Absender-E-Mail für Kundenmails</label>
            <Input type="email" className="w-full" />
          </div>

          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Telefonnummer Geschäft</label>
            <Input type="text" className="w-full" />
          </div>
        </div>

        {/* bank name and iban */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">Bankname für den Empfang von Auszahlungen durch FeetF1rst</label>
            <Input
              type="text"
              className="w-full bg-gray-100 cursor-not-allowed"
              readOnly
              value="Deutsche Bank"
            />
            <p className="text-xs text-gray-500 mt-1">
              This field  cannot be changed manually. If you believe the information is incorrect or needs to be updated, please click "Send Request to FeetF1rst" to submit a change request. Our team will review and update the data accordingly.
            </p>
            <button
              type="button"
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Send Request to FeetF1rst
            </button>
          </div>

          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">IBAN für den Empfang von Auszahlungen durch FeetF1rst</label>
            <Input
              type="text"
              className="w-full bg-gray-100 cursor-not-allowed"
              readOnly
              value="DE89 3704 0044 0532 0130 00"
            />
            <p className="text-xs text-gray-500 mt-1">
              This field cannot be changed manually. If you believe the information is incorrect or needs to be updated, please click "Send Request to FeetF1rst" to submit a change request. Our team will review and update the data accordingly.
            </p>
            <button
              type="button"
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Send Request to FeetF1rst
            </button>
          </div>
        </div>
      </div>


      {/* User Management Section */}
      <div className="my-16">
        <h2 className="font-bold text-2xl">Benutzerverwaltung</h2>
        <div className="mt-6">
          <div className="font-semibold text-lg mb-5 flex items-center gap-2">
            <span>Benutzer</span>
            <span
              className="text-xl cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setShowAddUserModal(true)}
              title="Neuen Benutzer hinzufügen"
            >
              <RiUserAddLine className="text-2xl" />
            </span>

          </div>
          <div className=" space-y-2">
            {users.map((user, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-all duration-200">
                <div
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => setExpandedUserIndex(expandedUserIndex === idx ? null : idx)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {user.employeeName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{user.accountName}</span>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 group-hover:text-blue-600 transition-colors">
                      {expandedUserIndex === idx ? "▲" : "▼"}
                    </span>
                  </div>
                </div>
                {expandedUserIndex === idx && (
                  <div className="ml-11 mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 w-full max-w-lg shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Accountname</label>
                          <div className="p-2 bg-white rounded border border-gray-200 text-sm">
                            {user.accountName}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mitarbeitername</label>
                          <div className="p-2 bg-white rounded border border-gray-200 text-sm">
                            {user.employeeName}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail-Adresse</label>
                          <div className="p-2 bg-white rounded border border-gray-200 text-sm">
                            {user.email}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="block text-sm font-medium text-gray-700">Finanz-Zugriff:</label>
                          <div className="flex items-center gap-2">
                            <Switch checked={user.financeAccess} disabled />
                            <span className={`text-sm px-2 py-1 rounded-full ${user.financeAccess
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                              }`}>
                              {user.financeAccess ? "Aktiviert" : "Deaktiviert"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Add User Modal */}
      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neuen Benutzer hinzufügen</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              setUsers([...users, newUser]);
              setNewUser({
                accountName: "",
                employeeName: "",
                email: "",
                password: "",
                financeAccess: false,
              });
              setShowAddUserModal(false);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Accountname</label>
              <Input
                type="text"
                className="w-full"
                required
                value={newUser.accountName}
                onChange={e => setNewUser({ ...newUser, accountName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mitarbeitername</label>
              <Input
                type="text"
                className="w-full"
                required
                value={newUser.employeeName}
                onChange={e => setNewUser({ ...newUser, employeeName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-Mail-Adresse</label>
              <Input
                type="email"
                className="w-full"
                required
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Passwort</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="w-full pr-10"
                  required
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <label className="block text-sm font-medium">Zugriff auf Finanzen:</label>
              <Switch
                checked={newUser.financeAccess}
                onCheckedChange={checked => setNewUser({ ...newUser, financeAccess: checked })}
              />
              <span className="text-xs">{newUser.financeAccess ? "Ja" : "Nein"}</span>
            </div>
            <DialogFooter>
              <button
                type="submit"
                className="w-full mt-4 py-2 rounded bg-zinc-900 text-white border-none hover:bg-zinc-800 transition"
              >
                Benutzer hinzufügen
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
