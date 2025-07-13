import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";

function UploadDropdown() {
    return (
        <Select>
            <SelectTrigger className="border-2 border-gray-300 h-12 text-base font-normal">
                <span className="flex items-center gap-2">
                    <span className="text-xl">         <UploadCloud className="w-5 h-5" /></span>
                    <SelectValue placeholder="Jetzt hochladen" />
                </span>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="upload">Jetzt hochladen</SelectItem>
            </SelectContent>
        </Select>
    );
}

export default function MusterzettelPage() {
    return (
        <div className="">
            <div className=" w-full px-4 py-8">
                {/* Musterzettel Section */}
                <h2 className="text-2xl font-bold mb-4">Musterzettel</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                    {[0, 1].map((col) => (
                        <div key={col} className="flex flex-col gap-6">
                            {[0, 1, 2].map((row) => (
                                <UploadDropdown key={row} />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mb-8">
                    <Button variant="outline">MEHR ANZEIGEN</Button>
                </div>

                {/* Schuheinlagen Muster Section */}
                <h2 className="text-2xl font-bold mb-4">Schuheinlagen Muster</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {[0, 1].map((row) => (
                        <div key={row} className="flex flex-col gap-4">
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Coming soon" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="soon">Coming soon</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Coming soon" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="soon">Coming soon</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mb-8">
                    <Button variant="outline">MEHR ANZEIGEN</Button>
                </div>

                {/* Shoe Usage Form Section */}
                <h2 className="text-xl font-bold mb-4 mt-10 uppercase tracking-tight">WELCHE SCHUHE NUTZEN IHRE KUNDEN AM HÄUFIGSTEN?</h2>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="FIRMA" />
                        <Input placeholder="E-MAIL" />
                    </div>
                    <Input placeholder="SCHUHMARKE" />
                    <Input placeholder="MODELL" />
                    <div className="flex justify-center mt-6">
                        <Button className="w-2/12 cursor-pointer bg-[#62A07C] hover:bg-[#62A07C]/80 text-white">SENDEN</Button>
                    </div>
                </form>
            </div>
            {/* Footer */}
            <footer className="bg-[#181818] w-full py-4 px-0 mt-8">
                <div className=" px-10 flex items-center gap-6 text-white text-sm">
                    <span className="flex items-center justify-center w-10 h-10 border border-white rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3.08 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z" />
                        </svg>
                    </span>
                    <div className="flex flex-col">
                        <span className="font-normal">WIR WERDEN UNS SCHNELLSTMÖGLICH DARUM KÜMMERN!</span>
                        <span className="font-normal">ALTERNATIV ERREICHEN SIE UNS JEDERZEIT UNTER +39 366 508 7742</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
