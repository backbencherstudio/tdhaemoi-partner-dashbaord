'use client'
import LineChartComponent from '@/components/OrdersPage/LineChart';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import HighPriorityCard from '@/components/OrdersPage/HighPriorityCard/HighPriorityCard';
import ProcessTable from '@/components/OrdersPage/ProccessTable/ProcessTable';
import { OrdersProvider } from '@/contexts/OrdersContext';
import { useRevenueOverview } from '@/hooks/orders/useRevenueOverview';
import { getEinlagenInProduktion } from '@/apis/productsOrder';

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
    const { register, handleSubmit, watch } = useForm<SearchForm>();
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
    const now = React.useMemo(() => new Date(), []);
    const [selectedMonth, setSelectedMonth] = React.useState<string>(String(now.getMonth() + 1).padStart(2, '0'));
    const [selectedYear, setSelectedYear] = React.useState<string>(String(now.getFullYear()));
    const shouldFilter = selectedYear !== '' && selectedMonth !== '';
    const { data, processedChartData, loading, error, isRefetching } = useRevenueOverview(
        shouldFilter ? selectedYear : undefined,
        shouldFilter ? selectedMonth : undefined
    );
    const [einlagenInProduktion, setEinlagenInProduktion] = React.useState<number | null>(null);
    const [einlagenLoading, setEinlagenLoading] = React.useState<boolean>(false);
    const [einlagenError, setEinlagenError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setEinlagenLoading(true);
                setEinlagenError(null);
                const res = await getEinlagenInProduktion();
                if (!mounted) return;
                if (res?.success) {
                    setEinlagenInProduktion(typeof res.data === 'number' ? res.data : null);
                } else {
                    setEinlagenError('Failed to load');
                }
            } catch (e) {
                if (!mounted) return;
                setEinlagenError('Failed to load');
            } finally {
                if (mounted) setEinlagenLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Helper for currency formatting with comma and decimals
    const formatEuro = (amount: number) =>
        amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

    // UI-only state for month and year dropdowns (no server filtering logic beyond fetch params)
    const months = React.useMemo(
        () => [
            { label: 'January', value: '01' },
            { label: 'February', value: '02' },
            { label: 'March', value: '03' },
            { label: 'April', value: '04' },
            { label: 'May', value: '05' },
            { label: 'June', value: '06' },
            { label: 'July', value: '07' },
            { label: 'August', value: '08' },
            { label: 'September', value: '09' },
            { label: 'October', value: '10' },
            { label: 'November', value: '11' },
            { label: 'December', value: '12' },
        ],
        []
    );
    const years = React.useMemo(() => {
        const currentYear = new Date().getFullYear();
        const list: number[] = [];
        for (let y = currentYear; y >= currentYear - 10; y--) list.push(y);
        return list;
    }, []);

    return (
        <OrdersProvider>
            <div className='mb-20'>

                <div className='py-5 px-8 bg-white rounded-xl shadow'>
                    <div className="text-2xl font-bold mb-5">Revenue Overview</div>

                    {loading ? (
                        <div className="w-full h-64 flex items-center justify-center">
                            <div className="text-lg">Loading revenue data...</div>
                        </div>
                    ) : error ? (
                        <div className="w-full h-64 flex items-center justify-center">
                            <div className="text-lg text-red-500">Error: {error}</div>
                        </div>
                    ) : (
                        <>
                            <div className='flex flex-col xl:flex-row items-stretch w-full gap-6'>
                                {/* left side card  */}
                                <div className="bg-white rounded-lg p-8 flex flex-col items-center justify-center min-w-[250px] border mb-4 md:mb-0 xl:w-4/12">
                                    <div className="text-2xl font-bold text-center mb-2">Geschäftsumsatz<br />(letzten 30 Tage)</div>
                                    <div className="text-4xl font-extrabold mt-4">
                                        {data?.statistics?.totalRevenue ? formatEuro(data.statistics.totalRevenue) : '-€'}
                                    </div>
                                </div>

                                {/* right side line chart */}
                                <div className="w-full xl:w-8/12" >

                                    <div className='flex flex-col items-end justify-end'>
                                        {/* filter need date and year wise  */}
                                        <div className="flex flex-col items-center justify-end">
                                            <div className="flex flex-col sm:flex-row gap-3 mb-2">
                                                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                                    <SelectTrigger className="w-[200px] cursor-pointer">
                                                        <SelectValue placeholder="Select month" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {months.map((m) => (
                                                            <SelectItem key={m.value} value={m.value} className='cursor-pointer'>
                                                                {m.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                                    <SelectTrigger className="w-[200px] cursor-pointer">
                                                        <SelectValue placeholder="Select year" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {years.map((y) => (
                                                            <SelectItem key={y} value={String(y)} className='cursor-pointer'>{y}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="h-5 mb-2 text-xs text-gray-500">
                                                {isRefetching && <span>Updating…</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ minWidth: 0 }} className='overflow-x-auto'>
                                        <LineChartComponent chartData={processedChartData} />
                                    </div>


                                </div>
                            </div>

                            <hr className='my-5 border-gray-200 border' />
                        </>
                    )}

                    {/* card bottom  */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch w-full gap-0">
                        {/* Einlagen in Produktion */}
                        <div className="flex-1 flex flex-col items-center justify-center  border-gray-300 py-6">
                            <div className="text-lg font-bold text-[#1E1F6D] mb-2 text-center">Einlagen in Produktion</div>
                            <div className="text-4xl font-extrabold">
                                {einlagenLoading ? '…' : (einlagenError ? '-' : (einlagenInProduktion ?? '-'))}
                            </div>
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

                <ProcessTable />
            </div>
        </OrdersProvider>

    )
}
