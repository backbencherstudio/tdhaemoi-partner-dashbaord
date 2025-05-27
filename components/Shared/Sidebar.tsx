'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
import {
    HiCog,
    HiCollection,
    HiHome,
    HiShoppingCart,
    HiUsers,
    HiCalendar,
    HiChevronDown,
    HiChat
} from 'react-icons/hi';
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import logo from '@/public/images/logo.png'
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';


interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
    const { logout } = useAuth();
    const [expandedSections, setExpandedSections] = useState({
        orders: true,
        customers: true,
        calendar: true,
        system: true
    });

    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
    };

    const menuSections = [
        {
            id: 'dashboard',
            standalone: true,
            icon: HiHome,
            label: 'Dashboard',
            href: '/dashboard'
        },
        {
            id: 'orders',
            label: 'Bestellungen & Produkte',
            items: [
                { icon: HiShoppingCart, label: 'Bestellverwaltung', href: '/orders' },
                { icon: HiCollection, label: 'Produktverwaltung', href: '/dashboard/lager' }
            ]
        },
        {
            id: 'customers',
            label: 'Kundenmanagement',
            items: [
                { icon: HiUsers, label: 'Kundensuche', href: '/dashboard/customers' },
                { icon: HiChat, label: 'Nachrichten', href: '/dashboard/email' }
            ]
        },
        {
            id: 'calendar',
            label: 'Kalender & Termine',
            items: [
                { icon: HiCalendar, label: 'Terminkalender', href: '/dashboard/calendar' }
            ]
        },
        {
            id: 'system',
            label: 'System & Einstellungen',
            items: [
                { icon: HiCog, label: 'Einstellungen', href: '/dashboard/settings' }
            ]
        }
    ];

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId as keyof typeof expandedSections]
        }));
    };

    return (
        <div className="w-64 h-screen bg-white  flex flex-col border-r border-gray-200">
            <div className="py-5 px-3 flex justify-between items-center border-gray-400">
                <div className='w-16 h-16'>
                    <Image src={logo} alt="logo" width={100} height={100} className='w-full h-full object-contain' />
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 md:hidden"
                >
                    <IoClose className="h-6 w-6" />
                </button>
            </div>

            <nav className="mt-4 flex-1 ">
                {menuSections.map((section) => (
                    <div key={section.id} className="mb-5 px-2 ">
                        {section.standalone ? (
                            <Link href={section.href} className='cursor-pointer'>
                                <span className={`flex items-center px-4 py-2 rounded-full ${pathname === section.href
                                    ? 'bg-black text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}>
                                    <section.icon className="h-5 w-5 mr-3" />
                                    {section.label}
                                </span>
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="flex cursor-pointer items-center justify-between w-full px-4 py-2 text-md font-medium text-gray-900"
                                >
                                    {section.label}
                                    <HiChevronDown
                                        className={`w-5 h-5 transition-transform ${expandedSections[section.id as keyof typeof expandedSections] ? 'transform rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                {expandedSections[section.id as keyof typeof expandedSections] && (
                                    <ul className="mt-1 space-y-1">
                                        {section.items?.map((item) => (
                                            <li key={item.href}>
                                                <Link href={item.href}>
                                                    <span className={`flex items-center px-8 py-2 ${pathname === item.href
                                                        ? 'bg-black text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                        }`}>
                                                        <item.icon className="h-5 w-5 mr-3" />
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </nav>

            {/* Logout button */}
            <div className="border-t border-gray-200 p-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer w-full px-4 py-2 text-gray-700 hover:bg-[#61A175] hover:text-white rounded-md transition-colors duration-300 group"
                >
                    <HiArrowRightOnRectangle className="h-5 w-5 mr-3 transition-transform duration-300 group-hover:translate-x-1" />
                    Logout
                </button>
            </div>
        </div>
    );
}
