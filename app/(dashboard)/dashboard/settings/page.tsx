"use client"
import React from 'react'
import Link from 'next/link'
import { BiCube } from 'react-icons/bi'
import { BiMessageDetail } from 'react-icons/bi'
import { FiSettings } from 'react-icons/fi'
import { TbBrandFeedly } from 'react-icons/tb'
import { BiSupport } from 'react-icons/bi'
import { BiGlobe } from 'react-icons/bi'
import { BiLogOut } from 'react-icons/bi'
import { RiArrowRightLine } from 'react-icons/ri'
import { useAuth } from '@/contexts/AuthContext'
import LanguageSwitcher from '@/components/Shared/LanguageSwitcher'

export default function Settingss() {
    const [showLanguageDropdown, setShowLanguageDropdown] = React.useState(false);
    const { logout } = useAuth();

    const handleLanguageClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowLanguageDropdown(!showLanguageDropdown);
    };

    const handleLogout = async () => {
        await logout();
    };

    const settingsOptions = [
        {
            label: "Produktverwaltung",
            href: "/dashboard/lager",
            icon: BiCube,
            className: "text-6xl text-gray-800 hover:text-primary-600 transition-colors ",
            alt: "Product Management",
        },
        {
            label: "Nachrichten",
            href: "/dashboard/email",
            icon: BiMessageDetail,
            className: "text-6xl text-gray-800 hover:text-primary-600 transition-colors",
            alt: "News",
        },
        {
            label: "Einstellungen",
            href: "/dashboard/settings-profile",
            icon: FiSettings,
            className: "text-6xl text-gray-800 hover:text-primary-600 transition-colors",
            alt: "Settings",
        },

        {
            label: "Software",
            href: "/dashboard/software",
            icon: TbBrandFeedly,
            className: "text-6xl text-gray-800 hover:text-primary-600 transition-colors",
            alt: "Software",
        },
        {
            label: "Support",
            href: "/dashboard/support",
            icon: BiSupport,
            className: "text-6xl text-gray-800 hover:text-primary-600 transition-colors",
            alt: "Support",
        },
        {
            label: "Sprache",
            href: "#",
            icon: BiGlobe,
            className: "text-6xl text-gray-800 hover:text-primary-600 transition-colors",
            alt: "Language",
            onClick: handleLanguageClick,
        },
        {
            label: "Log Out",
            href: "#",
            icon: BiLogOut,
            className: "text-6xl text-gray-800 hover:text-primary-600 transition-colors",
            alt: "Logout",
            onClick: handleLogout
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Accountverwaltung</h1>

            <Link href="/dashboard/settings-profile/users" className="block mb-8 w-full lg:w-[40%]">
                <div className="flex items-center border-2 border-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors p-4">
                    <div className="w-50 h-30 bg-gray-900 rounded-md mr-4"></div>
                    <div className='flex justify-between items-center w-full'>
                        <div>
                            <h2 className="font-bold text-xl capitalize">FEETF1RST</h2>
                            <p className="text-sm text-gray-600">Infos, System und mehr</p>
                        </div>
                        <RiArrowRightLine className='text-gray-600 text-3xl' />
                    </div>
                </div>
            </Link>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {settingsOptions.map((option, index) => (
                    <div key={index} className="relative">
                        {option.onClick ? (
                            <div
                                className="flex flex-col items-center cursor-pointer capitalize"
                                onClick={option.onClick}
                            >
                                <div className="bg-white  hover:bg-gray-200 p-6 rounded-[40px] border-2 border-gray-300 hover:shadow-xl hover:border-primary-500 transition-all duration-300 mb-3">
                                    <div className='flex justify-center items-center px-10 py-2 w-full '>
                                        <option.icon className={option.className} />
                                    </div>
                                </div>
                                <span className="text-base font-medium text-gray-700">{option.label}</span>
                            </div>
                        ) : (
                            <Link href={option.href} className="flex flex-col items-center">
                                <div className="bg-white hover:bg-gray-200 p-6 rounded-[40px] border-2 border-gray-300 hover:shadow-xl hover:border-primary-500 transition-all duration-300 mb-3">
                                    <div className='flex justify-center items-center px-10 sm:px-10 lg:px-8 2xl:px-10 py-2  w-full '>
                                        <option.icon className={option.className} />
                                    </div>
                                </div>
                                <span className="text-base font-medium text-gray-700 capitalize">{option.label}</span>
                            </Link>
                        )}

                        {option.label === "Sprache" && showLanguageDropdown && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 z-50">
                                <div className="relative p-2">
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45 shadow-[-1px_-1px_1px_rgba(0,0,0,0.05)]"></div>
                                    <LanguageSwitcher
                                        variant="minimal"
                                        className="mt-1"
                                        onLanguageChange={() => setShowLanguageDropdown(false)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
