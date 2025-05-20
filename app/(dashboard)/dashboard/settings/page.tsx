import React from 'react'
import Link from 'next/link'
import { Settings, MessageSquare, Box, MonitorSmartphone, Headphones, Globe, LogOut } from 'lucide-react'
import ProductManagement from '@/public/images/settings/Productmanagement.png'
import News from '@/public/images/settings/News.png'
import settings from '@/public/images/settings/Settings.png'
import logo from '@/public/images/settings/logo.png'
import support from '@/public/images/settings/support.png'
import language from '@/public/images/settings/lang.png'
import logout from '@/public/images/settings/logout.png'
import Image from 'next/image'
import { RiArrowRightLine } from 'react-icons/ri'

export default function Settingss() {

    const settingsOptions = [
        {
            label: "Produktverwaltung",
            href: "/dashboard/products",
            image: ProductManagement,
            className: "w-[110px] h-[90px]",
            alt: "Product Management",
        },
        {
            label: "Nachrichten",
            href: "/dashboard/messages",
            image: News,
            className: "w-[100px] h-[90px]",
            alt: "News",
        },
        {
            label: "Einstellungen",
            href: "/dashboard/settings",
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
            href: "/dashboard/language",
            image: language,
            className: "w-[100px] h-[90px]",
            alt: "Language",
        },
        {
            label: "Log Out",
            href: "/logout",
            image: logout,
            className: "w-[110px] h-[90px]",
            alt: "Logout",
        },
    ];

    return (
        <div className="p-6">
            {/* Header Section */}
            <h1 className="text-2xl font-bold mb-6">Accountverwaltung</h1>

            {/* Main Account Card */}
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

            {/* Grid of Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {settingsOptions.map((option, index) => (
                    <Link href={option.href} key={index} className="flex flex-col items-center">
                        <div className="bg-white p-4 rounded-[40px] border border-gray-400 shadow-sm hover:bg-gray-50 transition-colors mb-2">
                            <div className='flex justify-center items-center px-5 py-1 w-full'>
                                <Image src={option.image} alt={option.alt} className={option.className} />
                            </div>
                        </div>
                        <span className="text-sm text-center">{option.label}</span>
                    </Link>
                ))}
            </div>

        </div>
    )
}
