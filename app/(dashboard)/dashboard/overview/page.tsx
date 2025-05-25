import React from 'react'
import lager from '@/public/images/dashboard/lager.png'
import cart from '@/public/images/dashboard/cart.png'
import { RiSettings5Line } from 'react-icons/ri'
import Image from 'next/image'
import Link from 'next/link'
import Chart from '@/components/Overview/Chart'
import LineCharts from '@/components/Overview/LineCharts'
import PiCharts from '@/components/Overview/PiCharts'
import FavoriteModels from '@/components/Overview/FavoriteModels'
import Pyramid from '@/components/Overview/Pyramid'



export default function DashboardOverview() {
    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Ihr Geschäft</h1>

            <div className="flex flex-col md:flex-row items-center gap-8 w-full ">
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
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left p-4 font-semibold border-b border-gray-400">IHRE GERÄTE</th>
                                <th className="text-left p-4 font-semibold border-b border-gray-400">SCANS</th>
                                <th className="text-left p-4 font-semibold border-b border-gray-400"></th>
                            </tr>
                        </thead>
                        <tbody className="border border-gray-400 rounded-lg">
                            <tr className="border-b border-gray-400">
                                <td className="p-4 border-r border-gray-400">Bozen Büro</td>
                                <td className="p-4 w-32 text-center">10</td>
                                <td className="p-4 w-16 text-center">
                                    <RiSettings5Line className="w-5 h-5 text-gray-500 cursor-pointer mx-auto" />
                                </td>
                            </tr>
                            <tr className="border-b border-gray-400">
                                <td className="p-4 border-r border-gray-400">Bozen Massraum</td>
                                <td className="p-4 w-32 text-center">300</td>
                                <td className="p-4 w-16 text-center">
                                    <RiSettings5Line className="w-5 h-5 text-gray-500 cursor-pointer mx-auto" />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 border-r border-gray-400">Laptop Theo</td>
                                <td className="p-4 w-32 text-center">300</td>
                                <td className="p-4 w-16 text-center">
                                    <RiSettings5Line className="w-5 h-5 text-gray-500 cursor-pointer mx-auto" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='flex justify-center mt-4'>
                        <button className="text-center text-sm border border-gray-400 rounded-full cursor-pointer px-4 py-2 ">
                            Alle anzeigen
                        </button>
                    </div>
                </div>

            </div>

            {/* Icons Section */}
            <div className="flex gap-8 justify-center items-center mt-10">
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

            {/* chart section */}
            <Chart />
            <LineCharts />
            <PiCharts />
            <FavoriteModels />
            <Pyramid />
        </div>
    )
}
