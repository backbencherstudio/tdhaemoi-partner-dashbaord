import axiosClient from "@/lib/axiosClient";

interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  };
  token: string;
}



export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axiosClient.post<LoginResponse>('/users/login', {
      email,
      password,
    });

    if (!response.data?.token) {
      throw new Error('Invalid response from server');
    }

    return {
      success: true,
      message: response.data.message || 'Successfully logged in!',
      token: response.data.token,
      user: response.data.user
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred during login';
    throw new Error(errorMessage);
  }
};


// Update user profile
export const updateUserProfile = async (formData: FormData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axiosClient.patch('/partner/update-partner-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `${token}`
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
    throw new Error(errorMessage);
  }
};

