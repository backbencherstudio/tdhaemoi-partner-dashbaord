"use client"
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { RiUserAddLine, RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import { useEmployeeManagement, Employee } from '@/hooks/employee/useEmployeeManagement'
import AddUpdateEmployeeModal from './AddUpdateEmployeeModal'
import toast from 'react-hot-toast'

export default function Benutzerverwaltung() {
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [expandedUserIndex, setExpandedUserIndex] = useState<number | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)

  const {
    employees,
    isLoading,
    error,
    getAll,
    remove,
    refresh
  } = useEmployeeManagement()

  // Load employees on component mount
  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      await getAll(1, 10)
    } catch (error) {
      console.error('Failed to load employees:', error)
    }
  }

  // Handle modal success
  const handleModalSuccess = () => {
    loadEmployees() // Refresh the list
  }

  // Handle delete employee
  const handleDeleteEmployee = async () => {
    if (!employeeToDelete?.id) return

    try {
      await remove(employeeToDelete.id)
      toast.success('Employee deleted successfully')
      setShowDeleteModal(false)
      setEmployeeToDelete(null)
      loadEmployees() // Refresh the list
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete employee'
      toast.error(errorMessage)
    }
  }

  // Handle delete button click
  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee)
    setShowDeleteModal(true)
  }

  // Handle edit employee
  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setShowEditModal(true)
  }

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

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {employees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No employees found. Add your first employee!
              </div>
            ) : (
              employees.map((employee, idx) => (
                <div key={employee.id || idx} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-all duration-200">
                  <div
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => setExpandedUserIndex(expandedUserIndex === idx ? null : idx)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {employee.employeeName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{employee.accountName}</span>
                        <div className="text-xs text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditEmployee(employee)
                        }}
                        className="p-1 cursor-pointer text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit employee"
                      >
                        <RiEditLine className="text-lg" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(employee)
                        }}
                        className="p-1 cursor-pointer text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete employee"
                      >
                        <RiDeleteBin6Line className="text-lg" />
                      </button>
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
                              {employee.accountName}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mitarbeitername</label>
                            <div className="p-2 bg-white rounded border border-gray-200 text-sm">
                              {employee.employeeName}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail-Adresse</label>
                            <div className="p-2 bg-white rounded border border-gray-200 text-sm">
                              {employee.email}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="block text-sm font-medium text-gray-700">Finanz-Zugriff:</label>
                            <div className="flex items-center gap-2">
                              <Switch checked={employee.financialAccess} disabled />
                              <span className={`text-sm px-2 py-1 rounded-full ${employee.financialAccess
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                                }`}>
                                {employee.financialAccess ? "Aktiviert" : "Deaktiviert"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      <AddUpdateEmployeeModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        mode="create"
        onSuccess={handleModalSuccess}
      />

      {/* Edit Employee Modal */}
      <AddUpdateEmployeeModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingEmployee(null)
        }}
        mode="edit"
        employee={editingEmployee}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee löschen</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-4">
              Sind Sie sicher, dass Sie den Mitarbeiter <strong>{employeeToDelete?.employeeName}</strong> löschen möchten?
            </p>
            <p className="text-sm text-gray-500">
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <button
              onClick={() => {
                setShowDeleteModal(false)
                setEmployeeToDelete(null)
              }}
              className="px-4 py-2 cursor-pointer rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleDeleteEmployee}
              className="px-4 py-2 cursor-pointer rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Löschen
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}