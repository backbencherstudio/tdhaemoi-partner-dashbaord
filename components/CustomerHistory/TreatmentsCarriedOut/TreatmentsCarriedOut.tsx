
import React from 'react'
import ReuseableCarousel from '../../ReuseableCarousel/ReuseableCarousel'
import Image from 'next/image'
import img1 from "@/public/images/customerHistory/1.png"
import img2 from "@/public/images/customerHistory/2.png"
import img3 from "@/public/images/customerHistory/3.png"
import img4 from "@/public/images/customerHistory/4.png"

export default function TreatmentsCarriedOut() {
    const shoeData = [
        {
            id: 1,
            name: 'Businesseinlage',
            date: '17.12.2024',
            type: 'Werkstattzettel',
            model: 'Rohling 57873',
            image: img1,
        },
        {
            id: 2,
            name: 'Aufbau',
            date: '17.12.2024',
            type: 'Werkstattzettel',
            model: 'Aufbau Rechts 1cm',
            image: img2,
        },
        {
            id: 3,
            name: 'Leisten wurde erstellt',
            date: '17.12.2024 ',
            type: 'Auftragszettel ',
            model: 'Leisten #68',
            image: img3,
        },
        {
            id: 4,
            name: 'Bequemeinlage',
            date: '17.12.2024',
            type: 'Auftragszettel',
            model: 'Fräsung #547',
            image: img4,
        },
        {
            id: 5,
            name: 'Leisten wurde erstellt',
            date: '17.12.2024',
            type: 'Werkstattzettel',
            model: 'Rohling 57873',
            image: img3,
        },
    ]

    const slides = shoeData.map((shoe) => (
        <div key={shoe.id} className="p-3 flex flex-col gap-2 rounded-md">
            <div className="relative w-full h-48 bg-[#636363] rounded-xl overflow-hidden">
                <Image
                    src={shoe.image}
                    alt={`${shoe.name} ${shoe.model}`}
                    fill
                    className="object-contain"
                />
            </div>
            <div>
                <h3 className="text-lg font-bold">{shoe.name}</h3>
                <p className="text-sm text-gray-600">{shoe.date}</p>
                <p className="text-sm text-gray-600">{shoe.type}</p>
                <p className="text-sm text-gray-600">{shoe.model}</p>
            </div>

        </div>
    ))

    return (
        <div className="flex flex-col gap-4 mt-10">
            <h1 className="text-2xl font-bold"> DURCHGEFÜHRTE VERSORGUNGEN            </h1>
            <ReuseableCarousel
                slides={slides}
                options={{
                    loop: true,
                    align: 'start',
                    slidesToScroll: 1,
                }}
            />

          
        </div>
    )
}
