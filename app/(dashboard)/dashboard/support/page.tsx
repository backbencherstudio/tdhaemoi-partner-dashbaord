"use client"
import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { IoIosCall } from 'react-icons/io';

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqData {
    [key: string]: FaqItem[];
}

const faqData: FaqData = {
    "SHOE FINDER": [
        {
            question: "Wie kann ich die empfohlenen Schuhmodelle anpassen?",
            answer: "In den Shoe Finder-Einstellungen kannst du selbst bestimmen, welche Modelle im Beratungsgespräch angezeigt werden. Du kannst einzelne Schuhe deaktivieren, Prioritäten setzen oder auch saisonale Einstellungen festlegen – etwa, welche Saison aktuell Priorität hat (z. B. Winter, Sommer, Übergang). So stellst du sicher, dass immer nur relevante und verfügbare Modelle empfohlen werden."
        },
        {
            question: "Kann ich den Shoe Finder für verschiedene Filialen nutzen?",
            answer: "Ja – wenn du den 3D-Scanner als Voraussetzung nutzt, kannst du mehrere Filialen zentral über ein System verwalten. Jede Filiale verfügt über einen eigenen Lagerbestand, eigene Termine und Mitarbeitende. Der Shoe Finder erkennt automatisch den Standort und zeigt nur die passenden Produkte aus dem jeweiligen Lager an. So bleibt jede Filiale individuell, während du dennoch alles effizient über eine zentrale Plattform steuerst."
        },
        {
            question: "Kann ich meine eigenen Lagerbestände mit dem Shoe Finder verknüpfen?",
            answer: "Ja, der Shoe Finder zeigt automatisch nur Modelle an, die auch in deinem Lager verfügbar sind – passend zur empfohlenen Größe. Das spart Zeit in der Beratung und reduziert Retouren.<br><br>In den Einstellungen kannst du außerdem individuell festlegen, welche Lagerquellen berücksichtigt werden sollen:<br><br>  – Nur Schuhe, die am aktuellen Standort verfügbar sind<br>– Schuhe aus anderen Filialen deines Unternehmens<br>– Modelle, die nachbestellt werden können<br><br>So steuerst du genau, was deinen Kund:innen vorgeschlagen wird – lokal, filialübergreifend oder mit Nachlieferoption."
        },
        {
            question: "Kann ich Scan-Daten auch exportieren (z. B. für den Arzt oder eine Zweitmeinung)?",
            answer: "Ja, der Scan ist im Kundenordner gespeichert und kann mit Zustimmung der Kund:innen exportiert und weitergeleitet werden. "
        }
    ],
    "EINLAGENHERSTELLUNG": [
        {
            question: "Kann ich meine eigenen Einlagenmodelle hinzufügen?",
            answer: "Ja, in der Einlagenverwaltung kannst du eigene Modelle mit individuellen Parametern, Materialien und Zielgruppen anlegen. Bei der Versorgung am Fuß kann direkt der passende Rohling ausgewählt werden – für eine effizientere und noch präzisere Herstellung. Häufige Versorgungen lassen sich zudem als Vorlage speichern, sodass du nicht jedes Mal dieselben Texte oder Korrekturen neu eingeben musst."
        },
        {
            question: "Kann ich Kunden mit FeetF1rst auch anbieten, Einlagen Zuhause nachzubestellen?",
            answer: "Ja, wenn ein Kunde bereits gescannt wurde, kann er über die App oder einen Link zu seinem Profil passende Einlagen nachbestellen. Die Daten liegen bereits vor – du musst nur noch die Versorgung freigeben und die Produktion starten."
        },
        {
            question: "Kann ich mit meinen Kunden über die Software kommunizieren?",
            answer: "Ja, du kannst automatisierte Nachrichten (z. B. „Ihre Einlagen sind abholbereit“) senden und individuelle Nachrichten manuell verschicken. Künftig wird auch eine direkte Chatfunktion integriert, um Feedback, Rückfragen oder Folgetermine noch einfacher zu klären."
        },
        {
            question: "Werden Einlagenbestellungen über die App direkt als neuer Kunde eingespeichert?",
            answer: "Ja, bei Bestelleingang wird automatisch ein neues Kundenprofil erstellt – inklusive aller Einlagendaten. Sie ergänzen nur noch Diagnose und Versorgung."
        }
    ],
    "SONSTIGES": [
        {
            question: "Gibt es eine Wochen- oder Monatsübersicht über Umsatz, Einlagenaufträge, Lagerbewegung etc.?",
            answer: "Ja, FeetF1rst bietet umfassende Statistiken in den jeweiligen Bereichen – so haben Sie alle Kennzahlen im Blick."
        },
        {
            question: "Gibt es eine Möglichkeit zur Qualitätssicherung oder Kundenfeedback?",
            answer: "Ja, die App fragt derzeit automatisch nach Feedback. Weitere Kommunikationsfunktionen werden derzeit ausgebaut. (Ihre Bewertungen sehen Sie im Dashboard ganz unten.)"
        },
        {
            question: "Kann ich meine Kunden über neue Produkte oder Angebote informieren?",
            answer: "Ja, Kund:innen werden in der App automatisch benachrichtigt, wenn neue Schuhe im Sortiment verfügbar sind, die perfekt zu ihrem Profil passen. Falls du diese Modelle auch im Onlinehandel anbietest, profitieren deine Kunden direkt von der automatisierten Empfehlung – ohne dass du selbst Werbung schalten musst. So erreichst du gezielt interessierte Kund:innen mit minimalem Aufwand."
        },
        {
            question: "Kann ich eine Schnittstelle zu meinem ERP/Warenwirtschaftssystem einrichten?",
            answer: "Noch nicht – aktuell ist keine direkte Schnittstelle verfügbar. Die Integration zu ERP- und Warenwirtschaftssystemen ist jedoch bereits in Arbeit, damit du künftig Lagerdaten, Bestellungen und Kundendaten automatisiert zwischen deinen Systemen und der FeetF1rst-Software synchronisieren kannst. Ziel ist eine nahtlose Verbindung ohne doppelte Eingaben."
        }
    ],
    "LAGER": [
        {
            question: "Kann ich Artikel für bestimmte Kunden blockieren (z. B. bis zum Abholtermin reservieren)?",
            answer: "Ja, Sie können direkt beim jeweiligen Produkt „reserviert für … Stunden“ auswählen."
        },
        {
            question: "Wie kann ich die Lagerbewegungen nachvollziehen?",
            answer: "Im Bereich „Lagerverwaltung“ findest du eine vollständige Historie aller Lagerbewegungen – inklusive Datum, Artikel, Menge, verantwortlicher Person und Grund (z. B. Verkauf, Rückgabe, Umbuchung). Du kannst die Übersicht filtern, z. B. nach Zeitraum, Artikelnummer oder Mitarbeitenden. So hast du jederzeit volle Transparenz darüber, was mit deinem Bestand passiert."
        },
        {
            question: "Kann ich meine eigenen Lagerbestände mit dem Shoe Finder verknüpfen?",
            answer: "Ja, der Shoe Finder zeigt automatisch nur Modelle an, die auch in deinem Lager verfügbar sind – passend zur empfohlenen Größe. Das spart Zeit in der Beratung und reduziert Retouren. In den Einstellungen kannst du außerdem individuell festlegen, welche Lagerquellen berücksichtigt werden sollen: <br> <br> – Nur Schuhe, die am aktuellen Standort verfügbar sind <br>– Schuhe aus anderen Filialen deines Unternehmens <br> – Modelle, die nachbestellt werden können So steuerst du genau, was deinen Kund:innen vorgeschlagen wird – lokal, filialübergreifend oder mit Nachlieferoption"
        },
        {
            question: "Kann ich den Shoe Finder mit meinem Kassensystem verbinden?",
            answer: "Noch nicht – aktuell ist die direkte Integration in externe Kassensysteme nicht verfügbar. Eine Anbindung ist jedoch in Planung: Ziel ist es, künftig alle empfohlenen Schuhe, Größen und Artikelnummern automatisch in den Checkout zu übernehmen, um den Verkaufsprozess im Geschäft weiter zu beschleunigen."
        }
    ],
    "BESTELLUNGEN": [
        {
            question: "Werden Kunden über den Bestellstatus informiert?",
            answer: "Ja, Kunden können automatische Benachrichtigungen über Statusänderungen ihrer Bestellungen erhalten."
        },
        {
            question: "Kann ich einsehen wie lange einzelne Lieferungen durchschnittlich dauern?",
            answer: "Es gibt detaillierte Analysen zu Lieferzeiten, mit Durchschnittswerten und Vergleichsmöglichkeiten."
        },
        {
            question: "Gibt es eine Bestellliste mit Suchfunktion (nach Kundennamen, Artikelnummer, Lieferanten)?",
            answer: "Ja, eine umfassende Suchfunktion ermöglicht das Filtern nach verschiedenen Kriterien wie Kundennamen, Artikelnummern und Lieferanten."
        },
        {
            question: "Kann ich eine Bestellung stornieren?",
            answer: "Ja, Bestellungen können je nach Status storniert werden, mit entsprechender Dokumentation und Benachrichtigung."
        }
    ]
};

interface FormData {
    reason: string;
    company: string;
    phone: string;
    message: string;
}

export default function Support() {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        console.log(data);
    };



    return (
        <div className="px-4 ">
            <h1 className="text-3xl font-bold text-center mb-10">FEETF1RST SUPPORT</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(faqData).map((section: string) => (
                    <div key={section} className="border border-gray-500 rounded-md overflow-hidden">
                        <div className="bg-black text-white p-4 text-center font-medium">
                            {section}
                        </div>

                        <div className="p-4">
                            <Accordion type="single" collapsible className="w-full">
                                {faqData[section].map((item: FaqItem, index: number) => (
                                    <AccordionItem key={index} value={`item-${section}-${index}`}>
                                        <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline">
                                            {item.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-sm text-gray-600">
                                            <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>

                            <div className="mt-4 text-center">
                                <button className="text-sm text-blue-600 hover:text-blue-800">
                                    MEHR ANZEIGEN
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contact Form Section */}
            <div className="mt-16 bg-white p-8 rounded-md">
                <h2 className="text-2xl font-bold text-center mb-8 uppercase">KONTAKT FEETF1RST</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Grund der Kontaktaufnahme</Label>
                        <Input
                            id="reason"
                            className="border-gray-500 border"
                            placeholder="Grund der Kontaktaufnahme"
                            {...register("reason", { required: "This field is required" })}
                        />
                        {errors.reason && (
                            <p className="text-red-500 text-sm">{errors.reason.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="space-y-2 w-full md:w-1/2">
                            <Label htmlFor="company">Unternehmen</Label>
                            <Input
                                id="company"
                                className="border-gray-500 border"
                                placeholder="Unternehmen"
                                {...register("company", { required: "This field is required" })}
                            />
                            {errors.company && (
                                <p className="text-red-500 text-sm">{errors.company.message}</p>
                            )}
                        </div>

                        <div className="space-y-2 w-full md:w-1/2">
                            <Label htmlFor="phone">Telefon</Label>
                            <Input
                                id="phone"
                                className="border-gray-500 border"
                                type="tel"
                                placeholder="Telefon"
                                {...register("phone", {
                                    required: "This field is required",
                                    pattern: {
                                        value: /^[0-9+\-\s()]*$/,
                                        message: "Please enter a valid phone number"
                                    }
                                })}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Nachricht</Label>
                        <Textarea
                            id="message"
                            className="border-gray-500 border"
                            placeholder="Nachricht"
                            rows={5}
                            {...register("message", { required: "This field is required" })}
                        />
                        {errors.message && (
                            <p className="text-red-500 text-sm">{errors.message.message}</p>
                        )}
                    </div>

                    <div className='flex justify-center'>
                        <Button
                            type="submit"
                            className="px-16 py-2 bg-transparent border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white rounded-3xl cursor-pointer"
                        >
                            SENDEN
                        </Button>
                    </div>
                </form>
            </div>


            {/* footer */}
            <div className='bg-[#121212] text-white p-4 mt-14 flex items-center gap-2'>
                <div className='flex items-center gap-5'>
                    <div className='border border-white rounded-full p-1'>
                        <IoIosCall className='text-2xl' />
                    </div>
                    <div>
                        <p className='text-sm text-white capitalize'>WIR WERDEN UNS SCHNELLSTMÖGLICH DARUM KÜMMERN!</p>
                        <p className='text-sm text-white capitalize'>ALTERNATIV ERREICHEN SIE UNS JEDERZEIT UNTER +39 366 508 7742</p>
                    </div>
                </div>
            </div>
        </div>
    );
}