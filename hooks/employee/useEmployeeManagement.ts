import { useState, useCallback } from 'react'
import { 
  createEmployee, 
  getAllEmployees, 
  updateEmployee, 
  deleteEmployee 
} from '@/apis/employeeaApis'

export interface Employee {
  id?: string
  accountName: string
  employeeName: string
  email: string
  password: string
  financialAccess: boolean
}

export interface CreateEmployeeData {
  accountName: string
  employeeName: string
  email: string
  password: string
  financialAccess: boolean
}

export interface UpdateEmployeeData {
  accountName?: string
  employeeName?: string
  email?: string
  password?: string
  financialAccess?: boolean
}

export interface EmployeeResponse {
  success: boolean
  data: Employee[]
  total: number
  page: number
  limit: number
}

export function useEmployeeManagement() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])

  // Create employee
  const create = useCallback(async (employeeData: CreateEmployeeData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await createEmployee(employeeData)
      return response
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || 'Failed to create employee'
      setError(message)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Get all employees
  const getAll = useCallback(async (page: number = 1, limit: number = 10) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getAllEmployees(page, limit)
      setEmployees(response.data || [])
      return response
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || 'Failed to fetch employees'
      setError(message)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update employee
  const update = useCallback(async (id: string, employeeData: UpdateEmployeeData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await updateEmployee(id, employeeData)
      return response
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || 'Failed to update employee'
      setError(message)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Delete employee
  const remove = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await deleteEmployee(id)
      // Remove from local state
      setEmployees(prev => prev.filter(emp => emp.id !== id))
      return response
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || 'Failed to delete employee'
      setError(message)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Refresh employees list
  const refresh = useCallback(async (page: number = 1, limit: number = 10) => {
    return await getAll(page, limit)
  }, [getAll])

  return {
    employees,
    isLoading,
    error,
    create,
    getAll,
    update,
    remove,
    refresh,
    setEmployees
  }
}

export default useEmployeeManagement
