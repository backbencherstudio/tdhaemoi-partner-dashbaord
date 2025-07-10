"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const modules = [
  { id: "einlagenfinder", label: "Einlagenfinder" },
  { id: "skifinder", label: "Ski Finder" },
  { id: "shoefinder", label: "Shoe Finder" },
];

const questions = [
  { value: "einsatz", label: "Für welchen Einsatz sollen die Einlagen verwendet werden?" },
  { value: "sportschuh", label: "Für welchen Sportschuh verwenden Sie die Einlagen?" },
  { value: "aktivitaet", label: "Welches Aktivitätslevel trifft am besten auf Sie zu?" },
  { value: "gesundheit", label: "Haben Sie gesundheitliche Probleme (z. B. Diabetes), die Ihre Fußgesundheit beeinflussen?" },
  { value: "gewicht", label: "Wie viel wiegen Sie ungefähr?" },
  { value: "schmerzen3d", label: "Haben Sie Schmerzen? Wenn ja, markieren Sie bitte die betroffenen Bereiche auf dem 3D-Modell." },
  { value: "weitere_beschwerden", label: "Haben Sie weitere relevante Beschwerden oder Schmerzen?" },
  { value: "gleichgewicht", label: "Haben Sie Probleme mit Gleichgewicht, Gang oder Beweglichkeit?" },
  { value: "erwartungen", label: "Welche Erwartungen oder Ziele haben Sie mit den Einlagen?" },
  { value: "farbe", label: "Haben Sie eine bevorzugte Farbe für den Überzug Ihrer Einlagen?" },
];

const languages = [
  { value: "de", label: "Deutsch" },
  // { value: "en", label: "Englisch" },
];

export default function EinlagenPage() {
  const [selectedModules, setSelectedModules] = useState<string[]>(["einlagenfinder"]);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("de");

  const handleModuleChange = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="max-w-3xl  mx-auto mt-10 font-sans">
      <h1 className="text-3xl font-bold mb-2">Scanstation – Softwaremodul</h1>
      <p className="mb-8">
        Verwalten Sie hier die Einstellungen Ihrer Scanstation Software.
      </p>
      <div className="mb-6">
        <b className="block mb-2">Sichtbare Module auswählen</b>
        <div className="flex flex-row gap-8 mt-4">
          {modules.map((mod) => (
            <label key={mod.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedModules.includes(mod.id)}
                onChange={() => handleModuleChange(mod.id)}
                className="w-6 h-6 accent-black"
              />
              {mod.label}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <label className="font-medium mb-2 block">
          Fragen für den Einlagenfinder auswählen
        </label>
        <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
          <SelectTrigger>
            <SelectValue placeholder="Bitte wählen…" />
          </SelectTrigger>
          <SelectContent>
            {questions.map((question) => (
              <SelectItem key={question.value} value={question.value}>
                {question.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-6">
        <b className="block mb-2">Sprache wählen</b>
        <div className="mt-2">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
