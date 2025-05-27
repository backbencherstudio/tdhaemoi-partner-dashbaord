"use client"
import React from 'react'
import Link from 'next/link'
import ProductManagement from '@/public/images/settings/Productmanagement.png'
import News from '@/public/images/settings/News.png'
import settings from '@/public/images/settings/Settings.png'
import logo from '@/public/images/settings/logo.png'
import support from '@/public/images/settings/support.png'
import language from '@/public/images/settings/lang.png'
import logouts from '@/public/images/settings/logout.png'
import Image from 'next/image'
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
            image: ProductManagement,
            className: "w-[110px] h-[90px]",
            alt: "Product Management",
        },
        {
            label: "Nachrichten",
            href: "/dashboard/email",
            image: News,
            className: "w-[100px] h-[90px]",
            alt: "News",
        },
        {
            label: "Einstellungen",
            href: "/dashboard/settings-profile",
            image: settings,
            className: "w-[100px] h-[90px]",
            alt: "Settings",
        },
        {
            label: "Software",
            href: "/dashboard/software",
            image: logo,
            className: "w-[100px] h-[80px]",
            alt: "Software",
        },
        {
            label: "Support",
            href: "/dashboard/support",
            image: support,
            className: "w-[110px] h-[90px]",
            alt: "Support",
        },
        {
            label: "Sprache",
            href: "#",
            image: language,
            className: "w-[100px] h-[90px]",
            alt: "Language",
            onClick: handleLanguageClick,
        },
        {
            label: "Log Out",
            href: "#",
            image: logouts,
            className: "w-[110px] h-[90px]",
            alt: "Logout",
            onClick: handleLogout
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Accountverwaltung</h1>

            <Link href="/dashboard/account" className="block mb-8 w-full lg:w-[40%]">
                <div className="flex items-center border-2 border-gray-600  bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                    <div className="w-50 h-30 bg-gray-900 rounded-md mr-4"></div>
                    <div className='flex justify-between items-center w-full'>
                        <div>
                            <h2 className="font-bold text-xl">FeetFirst</h2>
                            <p className="text-sm text-gray-600">Infos, System und mehr</p>
                        </div>
                        <RiArrowRightLine className='text-gray-600 text-3xl' />
                    </div>
                </div>
            </Link>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {settingsOptions.map((option, index) => (
                    <div key={index} className="relative">
                        <div 
                            className="flex flex-col items-center cursor-pointer" 
                            onClick={option.onClick}
                        >
                            <div className="bg-white p-4 rounded-[40px] border border-gray-400 shadow-sm hover:bg-gray-50 transition-colors mb-2">
                                <div className='flex justify-center items-center px-5 py-1 w-full'>
                                    <Image width={100} height={100} src={option.image} alt={option?.alt} className={option.className} />
                                </div>
                            </div>
                            <span className="text-sm text-center">{option.label}</span>
                        </div>

                        {option.label === "Sprache" && showLanguageDropdown && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="relative p-2">
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
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
