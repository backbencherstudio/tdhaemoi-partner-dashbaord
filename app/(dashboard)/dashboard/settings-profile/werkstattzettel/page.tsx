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

export default function WerkstattzettelPage() {
  const [mitarbeiter, setMitarbeiter] = useState("");
  const [werktage, setWerktage] = useState("5");
  const [abholstandort, setAbholstandort] = useState<"geschaeft" | "eigen">("geschaeft");
  const [firmenlogo, setFirmenlogo] = useState<"ja" | "nein">("ja");
  const [auftragSofort, setAuftragSofort] = useState<"ja" | "manuell">("ja");
  const [versorgungsart, setVersorgungsart] = useState<"ja" | "nein">("ja");

  return (
    <div className="max-w-3xl mx-auto mt-10 font-sans">
      <h1 className="text-4xl font-bold mb-2">Werkstattzettel</h1>
      <p className="mb-8">
        Konfigurieren Sie hier die Optionen für Ihren Werkstattzettel.
      </p>

      {/* Mitarbeiter */}
      <div className="mb-6">
        <label className="font-semibold block mb-2">Mitarbeiter</label>
        <Input
          placeholder="Mitarbeitername"
          value={mitarbeiter}
          onChange={e => setMitarbeiter(e.target.value)}
          className="border border-gray-600"
        />
      </div>

      {/* Werktage Dropdown */}
      <div className="mb-6">
        <label className="font-semibold block mb-2">
          Standardberechnung des Fertigstellungsdatums
        </label>
        <Select value={werktage} onValueChange={setWerktage}>
          <SelectTrigger>
            <SelectValue placeholder="Werktage wählen" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(8)].map((_, i) => (
              <SelectItem key={i + 3} value={(i + 3).toString()}>
                {i + 3} Werktage
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Abholstandorte */}
      <div className="mb-8">
        <label className="font-semibold block mb-2">Abholstandorte</label>
        <div className="flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={abholstandort === "geschaeft"}
              onChange={() => setAbholstandort("geschaeft")}
              className="w-6 h-6 accent-black"
            />
            Dieselben wie Geschäftsstandorte
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={abholstandort === "eigen"}
              onChange={() => setAbholstandort("eigen")}
              className="w-6 h-6 accent-black"
            />
            Eigene definieren
          </label>
        </div>
      </div>

      {/* Firmenlogo anzeigen */}
      <div className="mb-8">
        <div className="font-semibold mb-2">
          Soll das Firmenlogo auf dem Werkstattzettel angezeigt werden (empfohlen)?
        </div>
        <div className="flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={firmenlogo === "ja"}
              onChange={() => setFirmenlogo("ja")}
              className="w-6 h-6 accent-black"
            />
            Ja
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={firmenlogo === "nein"}
              onChange={() => setFirmenlogo("nein")}
              className="w-6 h-6 accent-black"
            />
            Nein
          </label>
        </div>
      </div>

      {/* Auftrag nach Drucken sofort anzeigen */}
      <div className="mb-8">
        <div className="font-semibold mb-2">
          Nach dem Drucken wird der Auftrag sofort in der Auftragsübersicht angezeigt (empfohlen).
        </div>
        <div className="flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={auftragSofort === "ja"}
              onChange={() => setAuftragSofort("ja")}
              className="w-6 h-6 accent-black"
            />
            Ja
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={auftragSofort === "manuell"}
              onChange={() => setAuftragSofort("manuell")}
              className="w-6 h-6 accent-black"
            />
            Nein, manuell bestätigen
          </label>
        </div>
      </div>

      {/* Versorgungsart automatisch übernehmen */}
      <div className="mb-8">
        <div className="font-semibold mb-2">
          Versorgungsart automatisch übernehmen?
        </div>
        <div className="flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={versorgungsart === "ja"}
              onChange={() => setVersorgungsart("ja")}
              className="w-6 h-6 accent-black"
            />
            Ja
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={versorgungsart === "nein"}
              onChange={() => setVersorgungsart("nein")}
              className="w-6 h-6 accent-black"
            />
            Nein
          </label>
        </div>
      </div>
    </div>
  );
}
