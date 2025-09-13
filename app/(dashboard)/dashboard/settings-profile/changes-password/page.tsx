'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { changePassword } from '@/apis/authApis'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'



interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ChangesPasswordPage() {
    const { } = useAuth()


    const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordFormData>();
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
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
    )
}
