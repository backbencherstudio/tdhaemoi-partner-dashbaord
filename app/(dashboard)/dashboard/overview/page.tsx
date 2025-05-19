import React from 'react'

import lager from '@/public/images/dashboard/lager.png'
import cart from '@/public/images/dashboard/cart.png'
import { RiSettings5Line } from 'react-icons/ri'
import Image from 'next/image'
import Link from 'next/link'


export default function DashboardOverview() {
    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Ihr Geschäft</h1>

            <div className="flex  items-center gap-8 w-full ">
                {/* Stats Section */}
                <div className="flex gap-8 w-full md:w-1/2">
                    <div className="space-y-2">
                        <h2 className="text-5xl font-bold">140</h2>
                        <p className="text-gray-600">Scans im Monat Februar</p>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-5xl font-bold">10%</h2>
                        <p className="text-gray-600">Mehr Scans als im vergangenen Monat</p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="w-full md:w-1/2">
                    <div className="flex justify-between items-center p-4">
                        <h3 className="font-semibold">IHRE GERÄTE</h3>
                        <h3 className="font-semibold">SCANS</h3>
                    </div>
                    <div className="border border-gray-200 rounded-lg">
                        <div className="flex items-center border-b border-gray-200">
                            <div className="flex-1 border-r border-gray-200 p-4">Bozen Büro</div>
                            <div className="w-32 text-center p-4">10</div>
                            <div className="p-4">
                                <RiSettings5Line className="w-5 h-5 text-gray-500 cursor-pointer" />
                            </div>
                        </div>
                        <div className="flex items-center border-b border-gray-200">
                            <div className="flex-1 border-r border-gray-200 p-4">Bozen Massraum</div>
                            <div className="w-32 text-center p-4">300</div>
                            <div className="p-4">
                                <RiSettings5Line className="w-5 h-5 text-gray-500 cursor-pointer" />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-1 border-r border-gray-200 p-4">Laptop Theo</div>
                            <div className="w-32 text-center p-4">300</div>
                            <div className="p-4">
                                <RiSettings5Line className="w-5 h-5 text-gray-500 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <button className="text-center text-sm text-gray-500">
                            Alle anzeigen
                        </button>
                    </div>
                </div>

            </div>

            {/* Icons Section */}
            <div className="flex gap-8">
                <div className="flex flex-col items-center gap-2">
                    <Link href="/dashboard/lager" className="px-4 py-1 bg-black rounded-3xl">
                        <Image src={lager} alt="Lager" width={100} height={100} />
                    </Link>
                    <span>Lager</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Link href="/dashboard/bestellungen" className="px-4 py-2 bg-black rounded-3xl">
                        <Image src={cart} alt="Lager" width={100} height={100} />
                    </Link>
                    <span>Bestellungen</span>
                </div>
            </div>
        </div>
    )
}
