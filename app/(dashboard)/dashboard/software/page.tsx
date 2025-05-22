'use client'
import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import shoes from '@/public/images/products/shoes.png'
import Image from 'next/image'



interface Product {
    id: number;
    name: string;
    price: number;
    sub_category: string;
    gender: string;
    category: string;
    description: string;
}

const products: Product[] = [
    {
        id: 1,
        name: "Brooks Hyperion Elite 4 PB",
        price: 100,
        sub_category: "Freizeitschuh",
        gender: "Mann ",
        category: "ALLTAGSSCHUHE",
        description: "This is a product description"
    },
    {
        id: 2,
        name: "Brooks Hyperion Elite 4 PB",
        price: 100,
        sub_category: "Freizeitschuh",
        gender: "Mann ",
        category: "ALLTAGSSCHUHE",
        description: "This is a product description"
    },
    {
        id: 3,
        name: "Brooks Hyperion Elite 4 PB",
        price: 100,
        sub_category: "Freizeitschuh",
        gender: "Mann ",
        category: "SPORTSCHUHE",
        description: "This is a product description"
    },
    {
        id: 4,
        name: "Brooks Hyperion Elite 4 PB",
        price: 100,
        sub_category: "Freizeitschuh",
        gender: "Mann ",
        category: "SPORTSCHUHE",
        description: "This is a product description"
    },
    {
        id: 5,
        name: "Brooks Hyperion Elite 4 PB",
        price: 100,
        sub_category: "Freizeitschuh",
        gender: "Mann ",
        category: "SPORTSCHUHE",
        description: "This is a product description"
    },
    {
        id: 6,
        name: "Brooks Hyperion Elite 4 PB",
        price: 100,
        sub_category: "Freizeitschuh",
        gender: "Mann ",
        category: "SPORTSCHUHE",
        description: "This is a product description"
    },
    {
        id: 7,
        name: "Brooks Hyperion Elite 4 PB",
        price: 500,
        sub_category: "Laufschuh",
        gender: "Mann ",
        category: "BERGSCHUHE",
        description: "This is a product description"
    },
    {
        id: 8,
        name: "Brooks Hyperion Elite 4 PB",
        price: 500,
        sub_category: "Laufschuh",
        gender: "Mann ",
        category: "BERGSCHUHE",
        description: "This is a product description"
    },
    {
        id: 9,
        name: "Brooks Hyperion Elite 4 PB",
        price: 500,
        sub_category: "Laufschuh",
        gender: "Mann ",
        category: "BERGSCHUHE",
        description: "This is a product description"
    },
    {
        id: 10,
        name: "Brooks Hyperion Elite 4 PB",
        price: 500,
        sub_category: "Laufschuh",
        gender: "Mann ",
        category: "BERGSCHUHE",
        description: "This is a product description"
    }
]

// Group products by category
const groupedProducts = products.reduce((acc: { [key: string]: Product[] }, product: Product) => {
    if (!acc[product.category]) {
        acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
}, {});

const categories = Object.keys(groupedProducts);

// Product Card Component
const ProductCard = ({ product }: { product: Product }) => (
    <div className="p-4 ">
        <div className="bg-gray-200 h-32 rounded-lg mb-3 flex items-center justify-center">
            <Image src={shoes} alt={product.name} className="w-30 h-30 object-cover rounded" />
        </div>
        <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
        <p className="text-gray-600 text-xs mb-1">{product.sub_category} - {product.gender}</p>
        <button className="w-full mt-2 border border-gray-600 text-xs py-1 px-2 rounded  transition-colors uppercase">
            Jetzt hinzufügen
        </button>
    </div>
);

// Inner Carousel Component (for products within each category)
const InnerCarousel = ({ products, category }: { products: Product[], category: string }) => {

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 2 }
        }
    });

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-white min-h-96 relative">
            <h2 className="text-lg font-bold text-center mb-4 uppercase">{category}</h2>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex ">
                    {products.map((product: Product, index: number) => (
                        <div key={product.id} className="flex-none w-full md:w-1/2 px-2">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Inner Carousel Navigation Buttons */}
            <button
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-10 ${!prevBtnEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-10 ${!nextBtnEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

// Main Carousel Component
const MainCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        slidesToScroll: 1,
        containScroll: 'trimSnaps'
    }, [Autoplay()]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    );

    const onInit = useCallback((emblaApi: any) => {
        setScrollSnaps(emblaApi.scrollSnapList());
    }, []);

    const onSelect = useCallback((emblaApi: any) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onInit);
    }, [emblaApi, onInit, onSelect]);

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {categories.map((category) => (
                        <div key={category} className="flex-none w-full md:w-1/3 px-2">
                            <InnerCarousel
                                products={groupedProducts[category]}
                                category={category}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
                {scrollSnaps.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex
                            ? 'bg-[#61A07B] w-4'
                            : 'bg-gray-300'
                            }`}
                        onClick={() => scrollTo(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default function Software() {
    const [showMore, setShowMore] = useState(false);
    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <div className=" p-4">
            <div className='flex flex-col items-center justify-center gap-2 mb-8'>
                <h1 className='text-4xl font-bold text-center uppercase'>SOFTWARE 1.3</h1>
                <p className='text-center text-sm text-gray-700 uppercase'>FEETF1RST COPYRIGHT 2025</p>
            </div>

            <div className='flex flex-col gap-6 mb-8'>
                <h1 className='text-2xl font-bold uppercase'>NEUERUNGEN</h1>
                <p className='text-sm text-gray-700 leading-8'>
                    Willkommen bei der FeetF1rst Software – Ihre neue Schaltzentrale für eine perfekte Fußversorgung!
                    Mit großer Freude präsentieren wir Ihnen die erste Version unserer FeetF1rst Software. Unser Ziel war und ist es, eine Plattform zu schaffen, die Ihnen alles an die Hand gibt, was Sie für die individuelle und professionelle Fußversorgung benötigen – von der 3D-Fußanalyse über die passgenaue Produktempfehlung bis hin zur Verwaltung Ihrer Kundendaten.
                    Da es sich um die erste Version handelt, möchten wir offen und ehrlich mit Ihnen sein: Es können noch kleinere Fehler auftreten. Diese sind uns bewusst und werden bereits mit höchster Priorität bearbeitet....
                    {showMore && (
                        <>
                            Unser Entwicklerteam arbeitet täglich daran, die Stabilität, Geschwindigkeit und Benutzerfreundlichkeit der Software weiter zu verbessern, damit Ihre Arbeit noch reibungsloser wird.
                            Gleichzeitig haben wir schon viele neue Funktionen in der Pipeline, die Ihre Arbeit noch komfortabler gestalten werden. Dazu gehören unter anderem erweiterte Auswertungsmöglichkeiten, noch präzisere Produktempfehlungen basierend auf individuellen Fußprofilen sowie zusätzliche Services für eine rundum abgestimmte Fußversorgung. Diese Erweiterungen befinden sich derzeit in intensiver Entwicklung und werden Schritt für Schritt ausgerollt – wir bitten hier noch um etwas Geduld.
                            Mit der FeetF1rst Software gehen wir gemeinsam einen wichtigen Schritt in Richtung Zukunft: hin zu einer Versorgung, die individuell, effizient und nachhaltig ist. Danke, dass Sie Teil dieser Reise sind. Wir freuen uns darauf, gemeinsam mit Ihnen die Fußgesundheit auf ein neues Level zu heben!
                        </>
                    )}
                </p>

                <div className='flex justify-center mt-5'>
                    <button onClick={toggleShowMore} className='border border-gray-600 text-gray-600 px-8 py-1 rounded-md cursor-pointer hover:bg-gray-100 transition-colors'>
                        {showMore ? 'WENIGER ANZEIGEN' : 'MEHR ANZEIGEN'}
                    </button>
                </div>
            </div>

            {/* Carousel Section */}
            <div className="mt-14">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold uppercase mb-5">JETZT NEU IM SHOE FINDER FEETFIRST</h2>
                </div>
                <MainCarousel />
            </div>
        </div>
    )
}