'use client'
import React from 'react';
import { HiMenuAlt2, HiSearch, HiArrowLeft } from 'react-icons/hi';
import logo from '@/public/images/logo.png'
import Image from 'next/image';

interface NavbarProps {
    onMenuClick: () => void;
    isSidebarOpen: boolean;
}

export default function Navbar({ onMenuClick, isSidebarOpen }: NavbarProps) {

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="px-4 py-3 md:py-4 flex items-center justify-between">
                <button
                    onClick={onMenuClick}
                    className="text-gray-600 cursor-pointer hover:text-gray-800 transition-all duration-300"
                >
                    {isSidebarOpen ? (
                        <HiArrowLeft className="text-2xl hidden md:block"  />
                    ) : (
                        <HiMenuAlt2 className="text-2xl" />
                    )}
                </button>

                <div className="hidden md:block">
                    <div className='w-16 h-16'>
                        <Image src={logo} alt="logo" width={100} height={100} className='w-full h-full object-contain' />
                    </div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4">


                    {/* search icon */}
                    <HiSearch className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                </div>
            </div>
        </nav>
    );
}
