'use client'
import LineChartComponent from '@/components/OrdersPage/LineChart';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import HighPriorityCard from '@/components/OrdersPage/HighPriorityCard/HighPriorityCard';

const chartData = [
    { date: '01.06', value: 1500 },
    { date: '02.06', value: 3200 },
    { date: '03.06', value: 800 },
    { date: '04.06', value: 4200 },
    { date: '05.06', value: 2100 },
    { date: '06.06', value: 500 },
    { date: '07.06', value: 3700 },
    { date: '08.06', value: 2900 },
    { date: '09.06', value: 4700 },
    { date: '10.06', value: 1200 },
];

// Helper for German currency formatting
const formatEuro = (amount: number) =>
    amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '\u202F€';

const totalRevenue = chartData.reduce((sum, d) => sum + d.value, 0);

// Mock orders data
const mockOrders = [
    { bestellnummer: '10025', kundennummer: '2001', name: 'Anna Huber' },
    { bestellnummer: '10026', kundennummer: '2002', name: 'Annabelle Müller' },
    { bestellnummer: '10027', kundennummer: '2001', name: 'Max Mustermann' },
    { bestellnummer: '10028', kundennummer: '2003', name: 'Lisa Schmidt' },
];

type Auftrag = { bestellnummer: string; kundennummer: string; name: string };

type SearchForm = {
    bestellnummer: string;
    kundennummer: string;
    name: string;
};

function AuftragssucheCard() {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<SearchForm>();
    const [results, setResults] = React.useState<Auftrag[] | null>(null);
    const [searched, setSearched] = React.useState(false);

    const onSubmit = (data: SearchForm) => {
        const { bestellnummer, kundennummer, name } = data;
        setSearched(true);
        if (!bestellnummer && !kundennummer && !name) return;
        let found: Auftrag[] = [];
        if (bestellnummer.trim()) {
            found = mockOrders.filter(o => o.bestellnummer === bestellnummer.trim());
        } else if (kundennummer.trim()) {
            found = mockOrders.filter(o => o.kundennummer.includes(kundennummer.trim()));
        } else if (name.trim()) {
            found = mockOrders.filter(o => o.name.toLowerCase().includes(name.trim().toLowerCase()));
        }
        setResults(found);
    };

    const allFieldsEmpty = !watch('bestellnummer') && !watch('kundennummer') && !watch('name');

    return (
        <div className="flex-1 flex flex-col items-center justify-center py-6">
            <div className="text-lg font-bold mb-2 text-center">Auftragssuche</div>
            <form className="w-full flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    className="w-full max-w-xs mb-2"
                    placeholder="Bestellnummer"
                    {...register('bestellnummer')}
                />
                <Input
                    className="w-full max-w-xs mb-2"
                    placeholder="Kundennummer"
                    {...register('kundennummer')}
                />
                <Input
                    className="w-full max-w-xs mb-4"
                    placeholder="Name"
                    {...register('name')}
                />
                <Button type="submit" className="w-full max-w-xs" disabled={allFieldsEmpty}>
                    Suchen
                </Button>
            </form>
            {searched && allFieldsEmpty && (
                <div className="text-center text-red-500 mt-2">Bitte mindestens ein Feld ausfüllen.</div>
            )}
            {searched && !allFieldsEmpty && (
                <div className="w-full max-w-xs mt-4">
                    {results && results.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {results.map((order: Auftrag, idx: number) => (
                                <li key={idx} className="py-2">
                                    <div className="font-semibold">Bestellnummer: {order.bestellnummer}</div>
                                    <div>Kundennummer: {order.kundennummer}</div>
                                    <div>Name: {order.name}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-red-500">Kein Auftrag gefunden.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Orders() {
    return (
        <>

            <div className='py-5 px-8 bg-white rounded-xl shadow'>
                <div className="text-2xl font-bold mb-5">Revenue Overview</div>
                <div className='flex flex-col xl:flex-row items-stretch w-full gap-6'>
                    {/* left side card  */}
                    <div className="bg-white rounded-lg p-8 flex flex-col items-center justify-center min-w-[250px] border mb-4 md:mb-0 xl:w-4/12">
                        <div className="text-2xl font-bold text-center mb-2">Geschäftsumsatz<br />(letzten 30 Tage)</div>
                        <div className="text-4xl font-extrabold mt-4">{formatEuro(totalRevenue)}</div>
                    </div>

                    {/* right side line chart */}
                    <div className="w-full overflow-x-auto xl:w-8/12 flex items-stretch" style={{ minWidth: 0 }}>
                        <LineChartComponent chartData={chartData} />
                    </div>
                </div>

                <hr className='my-5 border-gray-200 border' />

                {/* card bottom  */}
                <div className="flex flex-col md:flex-row justify-between items-stretch w-full gap-0">
                    {/* Einlagen in Produktion */}
                    <div className="flex-1 flex flex-col items-center justify-center  border-gray-300 py-6">
                        <div className="text-lg font-bold text-[#1E1F6D] mb-2 text-center">Einlagen in Produktion</div>
                        <div className="text-4xl font-extrabold">35</div>
                    </div>
                    <div className='border-r border-gray-300 hidden md:block'></div>
                    {/* Ausgeführte Einlagen (letzten 30 Tage) */}
                    <div className="flex-1 flex flex-col items-center justify-center  border-gray-300 py-6">
                        <div className="text-lg font-bold text-[#62A07C] mb-2 text-center">Ausgeführte Einlagen<br />(letzten 30 Tage)</div>
                        <div className="text-4xl font-extrabold">150</div>
                    </div>
                    <div className='border-r border-gray-300 mr-5 hidden md:block'></div>
                    {/* Auftragssuche */}
                    <AuftragssucheCard />

                </div>


            </div>
            <HighPriorityCard />
        </>

    )
}
