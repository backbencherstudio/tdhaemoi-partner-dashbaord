'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import NoteAdd from '@/components/NoteAdd/NoteAdd';

interface CustomerData {
    nameKunde: string;
    EMail: string;
    Address: string;
    Cap: string;
    Location: string;
    Country: string;
    Geburtsdatum: string;
    id: number;
    createdAt: string;
}

export default function CustomerHistory() {
    const params = useParams();
    const [customerData, setCustomerData] = useState<CustomerData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await fetch('/data/userData.json');
                const data = await response.json();
                const customer = data.find((item: CustomerData) => item.id === Number(params.id));
                setCustomerData(customer || null);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching customer data:', error);
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [params.id]);

    const handleInputChange = (key: keyof CustomerData, value: string) => {
        if (customerData) {
            setCustomerData({
                ...customerData,
                [key]: value
            });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!customerData) return <div>Customer not found</div>;

    // Field name mapping with only the required fields
    const fieldNames: { [key: string]: string } = {
        nameKunde: 'Name',
        EMail: 'Email',
        Wohnort: 'Address',
        Cap: 'Cap',
        Geschäftstandort: 'Location',
        Country: 'Country',
        Geburtsdatum: 'Birth Date'
    };


    //formate 

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Benutzer{customerData.nameKunde}</h1>

            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(fieldNames).map((key) => (
                        <div key={key} >
                            <label className="font-semibold text-gray-700" htmlFor={key}>
                                {fieldNames[key]}
                            </label>
                            <input
                                type="text"
                                id={key}
                                className="mt-1 w-full p-2 border rounded-md border-gray-500"
                                value={customerData[key as keyof CustomerData] || ''}
                                onChange={(e) => handleInputChange(key as keyof CustomerData, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <h1>Kunde seit {customerData.createdAt}</h1>
            {/* box need this part */}
            <div className="grid grid-cols-4 gap-4 mt-6">
                <div>
                    <h3 className="font-semibold mb-2">Notizen</h3>
                    <div className="border rounded-lg p-4 border-gray-500">
                        <div className="h-32"></div>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Gesamt Auszufuhren</h3>
                    <div className="border rounded-lg p-4 border-gray-500">
                        <div className="h-32"></div>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Gesamt zu Verrechnen</h3>
                    <div className="border rounded-lg p-4 border-gray-500">
                        <div className="h-32"></div>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Nicht Bezahlte Rechnung</h3>
                    <div className="border rounded-lg p-4 border-gray-500">
                        <div className="h-32"></div>
                    </div>
                </div>
            </div>
            <NoteAdd />
        </div>
    )
}
