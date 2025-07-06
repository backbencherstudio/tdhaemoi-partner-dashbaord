import React from "react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

export default function QuestionSection() {
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Kundenspezifische Antworten – Einlagenfinder</h1>
            <Accordion type="single" collapsible className="w-full">
                {/* 1. Sportschuh */}
                <AccordionItem value="item-1">
                    <AccordionTrigger>Für welchen Sportschuh verwenden Sie die Einlage?</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                            {[
                                "Sportschuhe",
                                "Tennisschuhe",
                                "Sneaker",
                                "Stiefeletten",
                                "Laufschuhe",
                                "Fußballschuhe",
                                "Halbschuhe",
                                "Bergschuhe",
                                "Skischuhe",
                                "Basketballschuhe",
                                "Hausschuhe",
                                "Arbeitsschuhe",
                                "Andere",
                            ].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input type="radio" name="sportschuh" value={option} />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                {/* 2. Aktivitätslevel */}
                <AccordionItem value="item-2">
                    <AccordionTrigger>Welches Aktivitätslevel trifft am besten auf Sie zu?</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                            {[
                                "Sportlich aktiv (regelmäßiges Training oder sportliche Aktivitäten)",
                                "Mäßig aktiv (leichte körperliche Aktivität oder Gehen)",
                                "Wenig aktiv (hauptsächlich sitzende Tätigkeit)",
                                "Sehr wenig aktiv",
                            ].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input type="radio" name="aktivitaetslevel" value={option} />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                {/* 3. Gesundheitliche Probleme */}
                <AccordionItem value="item-3">
                    <AccordionTrigger>Haben Sie gesundheitliche Probleme wie Diabetes oder andere Erkrankungen, die Ihre Fußgesundheit beeinträchtigen könnten?</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="gesundheit" value="Ja" /> Ja, bitte eingeben
                                <Input className="ml-2" placeholder="Bitte angeben" />
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="gesundheit" value="Nein" /> Nein
                            </label>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                {/* 4. Gewicht */}
                <AccordionItem value="item-4">
                    <AccordionTrigger>Wie viel wiegen Sie ca.?</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                            {[
                                "Unter 50 kg",
                                "51–60 kg",
                                "61–70 kg",
                                "71–80 kg",
                                "81–90 kg",
                                "91–100 kg",
                                "101–110 kg",
                                "Über 110 kg",
                            ].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input type="radio" name="gewicht" value={option} />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                {/* 5. Schmerzen und Freitext */}
                <AccordionItem value="item-5">
                    <AccordionTrigger>Haben Sie Schmerzen? Wenn ja, bitte markieren Sie die betroffenen Bereiche auf dem 3D-Modell.</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-4">
                            <label className="block font-medium">Wann haben die Schmerzen begonnen?</label>
                            <Input placeholder="Bitte beschreiben" />
                            <label className="block font-medium">Wie beeinflussen die Schmerzen Ihren Alltag?</label>
                            <Input placeholder="Bitte beschreiben" />
                            <label className="block font-medium">Wie fühlen sich die Schmerzen an?</label>
                            <Input placeholder="Bitte beschreiben" />
                            <label className="block font-medium">Wann verstärken sich die Schmerzen?</label>
                            <Input placeholder="Bitte beschreiben" />
                        </div>
                    </AccordionContent>
                </AccordionItem>
                {/* 6. Weitere Schmerzen */}
                <AccordionItem value="item-6">
                    <AccordionTrigger>Haben Sie sonst noch relevante Schmerzen oder Beschwerden?</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                            {[
                                "Nein",
                                "Ja, Wadenprobleme",
                                "Ja, Rückenschmerzen",
                                "Ja, Achillessehnenprobleme",
                                "Ja, Hüftprobleme",
                                "Ja, Gelenkschmerzen",
                                "Andere",
                            ].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input type="radio" name="weitere_schmerzen" value={option} />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                {/* 7. Gleichgewicht, Gang, Beweglichkeit */}
                <AccordionItem value="item-7">
                    <AccordionTrigger>Haben Sie Probleme mit Ihrem Gleichgewicht, Gang oder der Beweglichkeit?</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="beweglichkeit" value="Ja" /> Ja, bitte angeben
                                <Input className="ml-2" placeholder="Bitte angeben" />
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="beweglichkeit" value="Nein" /> Nein
                            </label>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                {/* 8. Erwartungen/Ziele */}
                <AccordionItem value="item-8">
                    <AccordionTrigger>Welche Erwartungen oder Ziele haben Sie mit den Einlagen?</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                            {[
                                "Besserer Komfort",
                                "Bessere Performance beim Sport",
                                "Unterstützung bei Fußproblemen",
                                "Vorbeugen von Fußschmerzen",
                            ].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input type="checkbox" name="erwartungen" value={option} />
                                    {option}
                                </label>
                            ))}
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="erwartungen" value="Andere" /> Andere, bitte eingeben
                                <Input className="ml-2" placeholder="Bitte angeben" />
                            </label>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                {/* 9. Bevorzugte Farbe */}
                <AccordionItem value="item-9">
                    <AccordionTrigger>Haben Sie eine bevorzugte Farbe für den Überzug Ihrer Einlagen?</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                            {[
                                "Schwarz",
                                "Weiß",
                                "Grau",
                                "Beige",
                                "Blau",
                            ].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input type="radio" name="farbe" value={option} />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>

    );
}
