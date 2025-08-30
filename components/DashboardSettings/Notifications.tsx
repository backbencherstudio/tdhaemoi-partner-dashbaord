"use client";
import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LagerSettings() {
    const [location, setLocation] = useState("");
    const [threshold, setThreshold] = useState("1");
    const [autoDeduct, setAutoDeduct] = useState("yes");

    return (
        <div className="max-w-3xl mx-auto mt-10 font-sans">
            <h1 className="text-4xl font-bold mb-2">Lagereinstellungen</h1>
            <p className="mb-8">
                Verwalten Sie hier Lagerorte, Bestandsgrenzen Ihrer Einlagen und automatische Benachrichtigungen.
            </p>

            <div className="mb-6">
                <label className="font-semibold text-lg block mb-2">Lagerorte</label>
                <Input
                    placeholder="z.B. Hauptlager, Store Bozen ..."
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="border border-gray-600"
                />
            </div>

            <div className="mb-8 flex items-center gap-4">
                <div className="w-6 h-6 bg-green-600 rounded mr-2" />
                <span className="font-medium">Bestandswarnung aktiv ab</span>
                <div className="min-w-[180px]">
                    <Select value={threshold} onValueChange={setThreshold}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[...Array(10)].map((_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {i + 1} Produkt{(i + 1) > 1 ? "e" : ""} pro Größe
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="mb-8">
                <div className="font-semibold text-base mb-2">
                    Automatische Verknüpfung mit Verkauf?
                </div>
                <div className="flex gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={autoDeduct === "yes"}
                            onChange={() => setAutoDeduct("yes")}
                            className="w-6 h-6 accent-black"
                        />
                        Ja, wenn verkauft, automatisch ausbuchen
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={autoDeduct === "no"}
                            onChange={() => setAutoDeduct("no")}
                            className="w-6 h-6 accent-black"
                        />
                        Nein, manuell bestätigen
                    </label>
                </div>
            </div>

            <Button type="button" className="w-full mt-8 cursor-pointer">
                Speichern
            </Button>
        </div>
    );
}
