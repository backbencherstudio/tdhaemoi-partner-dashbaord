"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RiUserAddLine } from "react-icons/ri";

type UserItem = {
  accountName: string
  employeeName: string
  email: string
  password: string
  financeAccess: boolean
}

export default function Benutzerverwaltung() {
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [expandedUserIndex, setExpandedUserIndex] = useState<number | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [users, setUsers] = useState<UserItem[]>([
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
  ])

  const [newUser, setNewUser] = useState<UserItem>({
    accountName: "",
    employeeName: "",
    email: "",
    password: "",
    financeAccess: false,
  })

  return (
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
  )
}
