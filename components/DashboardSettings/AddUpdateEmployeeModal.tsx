"use client"
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEmployeeManagement, Employee } from '@/hooks/employee/useEmployeeManagement'
import toast from 'react-hot-toast'

// Validation schema
const employeeSchema = z.object({
  accountName: z.string().min(1, "Account name is required").min(2, "Account name must be at least 2 characters"),
  employeeName: z.string().min(1, "Employee name is required").min(2, "Employee name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  financialAccess: z.boolean(),
})

type EmployeeFormData = z.infer<typeof employeeSchema>

interface AddUpdateEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  employee?: Employee | null
  onSuccess: () => void
}

export default function AddUpdateEmployeeModal({
  isOpen,
  onClose,
  mode,
  employee,
  onSuccess
}: AddUpdateEmployeeModalProps) {
  const [showPassword, setShowPassword] = useState(false)

  const { create, update } = useEmployeeManagement()

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      accountName: "",
      employeeName: "",
      email: "",
      password: "",
      financialAccess: false,
    }
  })

  // Reset form when modal opens/closes or employee changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && employee) {
        form.reset({
          accountName: employee.accountName,
          employeeName: employee.employeeName,
          email: employee.email,
          password: employee.password,
          financialAccess: employee.financialAccess,
        })
      } else {
        form.reset({
          accountName: "",
          employeeName: "",
          email: "",
          password: "",
          financialAccess: false,
        })
      }
    }
  }, [isOpen, mode, employee, form])

  // Handle form submission
  const handleSubmit = async (data: EmployeeFormData) => {
    try {
      if (mode === 'create') {
        await create(data)
        toast.success('Employee created successfully')
      } else if (mode === 'edit' && employee?.id) {
        await update(employee.id, data)
        toast.success('Employee updated successfully')
      }

      form.reset()
      onSuccess()
      onClose()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message ||
        (mode === 'create' ? 'Failed to create employee' : 'Failed to update employee')
      toast.error(errorMessage)
    }
  }

  const isSubmitting = form.formState.isSubmitting
  const title = mode === 'create' ? 'Neuen Benutzer hinzufügen' : 'Employee bearbeiten'
  const submitText = mode === 'create' ? 'Benutzer hinzufügen' : 'Employee aktualisieren'
  const loadingText = mode === 'create' ? 'Creating...' : 'Updating...'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accountname</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employeeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mitarbeitername</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter employee name" {...field} />
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
                  <FormLabel>E-Mail-Adresse</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="financialAccess"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Zugriff auf Finanzen</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      className='cursor-pointer'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 cursor-pointer py-2 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 cursor-pointer rounded-md bg-zinc-900 text-white border-none hover:bg-zinc-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? loadingText : submitText}
              </button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}