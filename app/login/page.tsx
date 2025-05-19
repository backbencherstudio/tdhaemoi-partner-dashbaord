"use client"
import React, { useState } from 'react'
import logo from '@/public/images/logo.png'
import Image from 'next/image'
import { useForm } from 'react-hook-form'

type FormInputs = {
  email: string;
  password: string;
}

export default function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<FormInputs>()

    const onSubmit = async (data: FormInputs) => {
        setIsLoading(true)
        try {
            console.log(data)
            // Handle login logic here
            await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="max-w-md w-full p-6 space-y-8 bg-[#A19B9B38] rounded-lg shadow-md">
                <div className="flex flex-col items-center">
                    <Image
                        src={logo}
                        alt="logo"
                        width={60}
                        height={60}
                        className="mb-6"
                    />
                    <h1 className="text-2xl font-semibold">Willkommen zurück!</h1>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            E-Mail
                        </label>
                        <input
                            {...register("email", { 
                                required: "E-Mail ist erforderlich",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Ungültige E-Mail-Adresse"
                                }
                            })}
                            type="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Passwort
                        </label>
                        <input
                            {...register("password", { 
                                required: "Passwort ist erforderlich",
                                minLength: {
                                    value: 6,
                                    message: "Passwort muss mindestens 6 Zeichen lang sein"
                                }
                            })}
                            type="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#585C5B] transform duration-300 cursor-pointer hover:bg-gray-700 focus:outline-none  disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="inline-flex items-center">
                                <div className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                Wird geladen...
                            </div>
                        ) : (
                            'Anmelden'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
