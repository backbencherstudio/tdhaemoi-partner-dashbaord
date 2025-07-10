"use client";
import React, { useState } from "react";
import Image from "next/image";
import gassImg from "@/public/images/gass.png";
import { Button } from "@/components/ui/button";

export default function GroupOrders() {
    const product = {
        id: "durospray-ortho3040",
        name: "DuroSpray® DS Ortho3040",
        intro: "Für schnelleres und sauberes Arbeiten – besonders bei Einlagenüberzügen und Materialverklebung.",
        beschreibung:
            "Toluolfreier Sprühkleber mit feinem Sprühbild, kurzer Ablüftzeit und hoher Ergiebigkeit – ideal für präzises und sauberes Arbeiten in der Einlagenfertigung. Entwickelt speziell für die Orthopädie-Schuhtechnik.",
        anwendung:
            "Zum Verkleben von Echtleder, EVA, Kork, Mikrofaser, Pelotten u.v.m. – perfekt für alte oder neue Decklagen, da auch wärmeaktivierbar.",
        ergiebigkeit: "Reicht für ca. 2.000 - 2.500 Einlagenpaare inkl. Überzug.",
        link: "#",
        price: "179,99€",
        minQty: 10,
        vorgemerkt: 6,
    };

    // Reservation state
    const [showReservation, setShowReservation] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [confirmed, setConfirmed] = useState(false);

    // Handler for reservation confirmation
    const handleConfirm = () => {
        setConfirmed(true);
        // Here you would also send data to backend: userId, productId, quantity, timestamp, etc.
    };

    return (
        <div className="mt-8 font-sans px-2 md:px-6">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Sammelbestellungen</h1>
                <p className="mb-1 text-base md:text-lg">
                    Gemeinsam mit unseren Partnern bieten wir gebündelte Bestellungen an und nutzen die Stärke des gemeinsamen Netzwerks. So profitieren alle von reibungslosen Abläufen – und vor allem von besten Preisen.
                </p>
                <p className="text-base md:text-lg">
                    Du kannst Produkte ganz einfach vormerken – bestellt wird erst, wenn genügend Bestellungen eingegangen sind. Das voraussichtliche Lieferdatum wird bekanntgegeben, sobald die Mindestmenge erreicht ist.
                </p>
            </div>

            {/* Product Card Section */}
            <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
                {/* Product Image and Progress Bar */}
                <div className="flex flex-col items-center w-full lg:w-1/4">
                    <Image
                        src={gassImg}
                        alt={product.name}
                        className="object-contain"
                        width={200}
                        height={200}
                        priority
                    />
                    <div className="w-full mt-4">
                        <div className="relative w-full h-7 md:h-8 bg-gray-200 rounded overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-7 md:h-8 bg-green-600 rounded flex items-center justify-center transition-all duration-300"
                                style={{
                                    width: `${(product.vorgemerkt / product.minQty) * 100}%`,
                                    minWidth: "80px",
                                }}
                            >
                                <span className="text-white text-xs md:text-sm font-medium w-full text-center px-2 truncate">
                                    {product.vorgemerkt} von {product.minQty} Bestellungen erreicht
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Info + Price */}
                <div className="flex-1 w-full flex flex-col lg:flex-row lg:items-stretch">
                    {/* Info */}
                    <div className="flex-1 pr-0 lg:pr-8 flex flex-col">
                        <div className="mb-2 text-base">{product.intro}</div>
                        <div className="text-3xl font-bold mb-2">{product.name}</div>
                        <div className="my-5">
                            <span className="font-bold">Beschreibung: </span>
                            {product.beschreibung}
                        </div>
                        <div className="mb-2">
                            <p> <span className="font-bold">Anwendung:</span>  Zum Verkleben von Echtleder, EVA, Kork, Mikrofaser, Pelotten u.v.m. – perfekt für alte oder neue Decklagen, da auch wärmeaktivierbar.</p>
                        </div>
                        <div className="mb-2 ">{product.ergiebigkeit}</div>
                        <p className="underline ">Mehr zum Produkt erfahren</p>
                        <div className="flex-1" />
                        {/* Reservation Flow */}
                        {!showReservation && !confirmed && (
                            <Button
                                variant="outline"
                                className="w-full cursor-pointer font-bold text-lg border-2 py-6 mt-2"
                                onClick={() => setShowReservation(true)}
                            >
                                Jetzt einschreiben
                            </Button>
                        )}
                        {showReservation && !confirmed && (
                            <div className="w-full mt-4 flex flex-col gap-2">
                                <div className="flex items-center gap-4">
                                    <label className="font-medium">Menge:</label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="w-8 h-8 cursor-pointer border rounded flex items-center justify-center text-lg font-bold disabled:opacity-50"
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            disabled={quantity <= 1}
                                            type="button"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min={1}
                                            max={99}
                                            value={quantity}
                                            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                                            className="w-16 text-center border rounded"
                                            disabled={confirmed}
                                        />
                                        <button
                                            className="w-8 h-8 cursor-pointer border rounded flex items-center justify-center text-lg font-bold"
                                            onClick={() => setQuantity(q => q + 1)}
                                            type="button"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    className="w-full cursor-pointer font-bold text-lg border-2 py-5 mt-2"
                                    onClick={handleConfirm}
                                    disabled={confirmed}
                                >
                                    Vormerkung abschließen
                                </Button>
                                <div className="text-xs text-muted-foreground mt-1 text-center">
                                    Wird mit deiner Balance verrechnet
                                </div>
                            </div>
                        )}
                        {confirmed && (
                            <Button
                                className="w-full cursor-pointer font-bold text-lg border-2 py-6 mt-2"
                                disabled
                                variant="outline"
                            >
                                Du hast dieses Produkt vorgemerkt
                            </Button>
                        )}
                    </div>
                    {/* Price - always bottom right on desktop, below button on mobile */}
                    <div className="flex lg:flex-col items-end lg:justify-end justify-center min-w-[120px] lg:pl-4 pt-6 lg:pt-0">
                        <div className="text-3xl font-bold lg:self-end self-center">{product.price}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
