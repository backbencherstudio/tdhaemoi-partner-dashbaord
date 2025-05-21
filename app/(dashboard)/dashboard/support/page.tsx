"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';

// FAQ data structure
const faqData = {
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
            answer: "Ja, der Shoe Finder zeigt automatisch nur Modelle an, die auch in deinem Lager verfügbar sind – passend zur empfohlenen Größe. Das spart Zeit in der Beratung und reduziert Retouren. In den Einstellungen kannst du außerdem individuell festlegen, welche Lagerquellen berücksichtigt werden sollen: – Nur Schuhe, die am aktuellen Standort verfügbar sind– Schuhe aus anderen Filialen deines Unternehmens – Modelle, die nachbestellt werden können So steuerst du genau, was deinen Kund:innen vorgeschlagen wird – lokal, filialübergreifend oder mit Nachlieferoption."
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
            answer: "Welche Rollen und Rechte kann ich vergeben – wer darf was im System ändern oder einsehen? Über die Benutzerverwaltung können Sie präzise festlegen, welche Mitarbeitenden welche Bereiche sehen oder bearbeiten dürfen. Wie kann ich Schulungen für neue Mitarbeiter: innen organisieren – gibt es Lernvideos oder ein Handbuch? Sie können entweder ein Schulungsvideo verwenden oder einen FeetF1rst- Trainer für einen Tag buchen, der Ihr Team intensiv einarbeitet. Gibt es regelmäßige Softwareupdates – und kann ich neue Funktionen mitgestalten ?  Ja, es gibt monatliche Updates mit neuen Features.FeetF1rst ist offen für Vorschläge und entwickelt die Software gemeinsam mit seinen Partnerbetrieben weiter."
        }
    ],
    "LAGER": [
        {
            question: "Kann ich Artikel für bestimmte Kunden bis z.B. zum Abholtermin reservieren?",
            answer: "Ja, Sie können Artikel für bestimmte Kunden reservieren und Reservierungszeiträume festlegen."
        },
        {
            question: "Wie kann ich die Lagerbewegungen nachvollziehen?",
            answer: "Das System bietet detaillierte Tracking-Funktionen für alle Lagerbewegungen mit Protokollierung und Suchfunktionen."
        },
        {
            question: "Kann ich meine eigenen Lagerbestände mit dem Shoe Finder verknüpfen?",
            answer: "Ja, die Integration von eigenen Lagerbeständen mit dem Shoe Finder ist möglich und ermöglicht eine Echtzeit-Bestandsanzeige."
        },
        {
            question: "Kann ich den Shoe Finder mit meinem Kassensystem verbinden?",
            answer: "Das System bietet Integrationen mit gängigen Kassensystemen für einen nahtlosen Verkaufsprozess."
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

interface FaqItem {
    question: string;
    answer: string;
    section: string;
}

export default function Support() {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const handleSectionClick = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-10">FEETFIRST SUPPORT</h1>

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
                                            {item.answer}
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
        </div>
    );
}