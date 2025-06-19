'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { FaUserCircle } from 'react-icons/fa'
import { updateUserProfile, changePassword } from '@/apis/authApis'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import Image from 'next/image'

interface ProfileFormData {
  fullName: string;
  image?: FileList;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Profile() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('profile')
    const [profileImage, setProfileImage] = useState(user?.image || '')
    const [isEditMode, setIsEditMode] = useState(false)

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProfileFormData>({
        defaultValues: {
            fullName: user?.name || '',
        }
    });

    const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordFormData>();
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setValue('fullName', user.name || '')
            if (user.image) {
                setProfileImage(user.image)
            }
        }
    }, [user, setValue])

    // Watch for image changes to show preview
    const imageFile = watch('image');
    useEffect(() => {
        if (imageFile?.[0]) {
            const fileUrl = URL.createObjectURL(imageFile[0]);
            setProfileImage(fileUrl);
            return () => URL.revokeObjectURL(fileUrl);
        }
    }, [imageFile]);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            const formData = new FormData();
            formData.append('name', data.fullName);
            if (data.image?.[0]) {
                formData.append('image', data.image[0]);
            }

            const response = await updateUserProfile(formData);
            
            if (response.success) {
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUser = { ...currentUser, ...response.user };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                toast.success('Profile updated successfully');
                setIsEditMode(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update profile');
        }
    }

    const onPasswordSubmit = async (data: PasswordFormData) => {
        try {
            if (data.newPassword !== data.confirmPassword) {
                toast.error('New passwords do not match');
                return;
            }

            setIsPasswordLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await changePassword(data.currentPassword, data.newPassword);
            if (response.success) {
                toast.success('Password changed successfully');
                resetPassword();
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to change password');
        } finally {
            setIsPasswordLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-full">
            {/* Left Side Navigation */}
            <div className="w-full md:w-64 bg-white shadow-sm p-4 mb-4 md:mb-0">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Settings</h2>
                <nav className="flex md:block space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-shrink-0 md:w-full cursor-pointer text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        Profile Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`flex-shrink-0 md:w-full cursor-pointer text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'password' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        Change Password
                    </button>
                </nav>
            </div>

            {/* Right Side Content */}
            <div className="flex-1 p-4 md:p-8">
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Profile Settings</h3>
                            <button
                                onClick={() => setIsEditMode(!isEditMode)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title={isEditMode ? 'Cancel Edit' : 'Edit Profile'}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {isEditMode ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>

                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-24 md:w-32 h-24 md:h-32 mb-4">
                                {profileImage ? (
                                    <Image
                                        width={100}
                                        height={100}
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover border-4 border-gray-200"
                                    />
                                ) : (
                                    <FaUserCircle className="w-full h-full text-gray-400" />
                                )}
                                {isEditMode && (
                                    <label
                                        htmlFor="profile-image"
                                        className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </label>
                                )}
                                <input
                                    type="file"
                                    id="profile-image"
                                    className="hidden"
                                    accept="image/*"
                                    disabled={!isEditMode}
                                    {...register('image')}
                                />
                            </div>
                            <p className="text-sm text-gray-500">Your profile picture</p>
                            {isEditMode && (
                                <p className="text-sm text-gray-500 text-center">Click the camera icon to upload a new profile picture</p>
                            )}
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your full name"
                                        {...register('fullName', { required: 'Full name is required' })}
                                    />
                                ) : (
                                    <p className="text-gray-900 py-2">{watch('fullName') || 'Not set'}</p>
                                )}
                                {errors.fullName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <p className="text-gray-900 py-2">{user?.email}</p>
                            </div>

                            {isEditMode && (
                                <button
                                    type="submit"
                                    className="bg-primary cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Save Changes
                                </button>
                            )}
                        </form>
                    </div>
                )}

                {activeTab === 'password' && (
                    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 h-full">
                        <h3 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800">Change Password</h3>
                        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter current password"
                                    {...registerPassword('currentPassword', { 
                                        required: 'Current password is required' 
                                    })}
                                />
                                {passwordErrors.currentPassword && (
                                    <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter new password"
                                    {...registerPassword('newPassword', { 
                                        required: 'New password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                />
                                {passwordErrors.newPassword && (
                                    <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Confirm new password"
                                    {...registerPassword('confirmPassword', { 
                                        required: 'Please confirm your new password'
                                    })}
                                />
                                {passwordErrors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isPasswordLoading}
                                className={`w-full bg-primary cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center ${isPasswordLoading ? 'opacity-70' : ''}`}
                            >
                                {isPasswordLoading ? (
                                    <>
                                        <svg 
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24"
                                        >
                                            <circle 
                                                className="opacity-25" 
                                                cx="12" 
                                                cy="12" 
                                                r="10" 
                                                stroke="currentColor" 
                                                strokeWidth="4"
                                            />
                                            <path 
                                                className="opacity-75" 
                                                fill="currentColor" 
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Updating Password...
                                    </>
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
