import axiosClient from "@/lib/axiosClient";


// craete employee
export const createEmployee = async (employeeData: any) => {
    try {
        const response = await axiosClient.post('/employees', employeeData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// get all 
export const getAllEmployees = async (page: number, limit: number) => {
    try {
        const response = await axiosClient.get(`/employees?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// update employee 
export const updateEmployee = async (id: string, employeeData: any) => {
    try {
        const response = await axiosClient.patch(`/employees/${id}`, employeeData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// delete employee 
export const deleteEmployee = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/employees/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


//  search employee
export const searchEmployee = async (page: number, limit: number, search: string) => {
    try {
        const response = await axiosClient.get(`/employees/search?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
