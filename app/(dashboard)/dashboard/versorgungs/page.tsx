import React from 'react'
import Alltagseinlagen from '../_components/Versorgungs/Alltagseinlagen'
import Sporteinlagen from '../_components/Versorgungs/Sporteinlagen'
import Businesseinlagen from '../_components/Versorgungs/Businesseinlagen'
import Auswahl from '../_components/Versorgungs/Auswahl'

export default function VersorgungsPage() {
    return (
        <div className='mb-20'>
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold capitalize'>VERSORGUNGEN</h1>
                <p>Erstelle jetzt Versorgungen, die du häufig verwendest – für eine noch schnellere Abwicklung deiner Arbeitszettel.</p>
            </div>
            <Alltagseinlagen />
            <Sporteinlagen />
            <Businesseinlagen />

            {/* Diagnosebasierte Auswahl */}

            <div className='mt-20 flex flex-col gap-2'>
                <h1 className='text-2xl font-bold capitalize'>Diagnosebasierte Auswahl</h1>
                <p className='text-gray-500'>Verknüpfe deine Versorgungen zusätzlich mit bestimmten Diagnosen. So kannst du später gezielt nach Kategorie und Diagnose filtern – und findest in Sekunden die passende Versorgung.</p>

                <Auswahl />
            </div>
        </div>
    )
}
