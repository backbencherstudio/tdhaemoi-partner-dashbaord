"use client";
import React, { useState } from "react";

const modules = [
  { id: "einlagenfinder", label: "Einlagenfinder" },
  { id: "skifinder", label: "Ski Finder" },
  { id: "shoefinder", label: "Shoe Finder" },
];

export default function EinlagenPage() {
  const [selectedModules, setSelectedModules] = useState<string[]>(["einlagenfinder"]);
  const [dropdownValue, setDropdownValue] = useState("");

  const handleModuleChange = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "inherit" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
        Scanstation – Softwaremodul
      </h1>
      <p style={{ marginBottom: 32 }}>
        Verwalten Sie hier die Einstellungen Ihrer Scanstation Software.
      </p>
      <div style={{ marginBottom: 24 }}>
        <b>Sichtbare Module auswählen</b>
        <div style={{ display: "flex", flexDirection: "row", gap: 32, marginTop: 16 }}>
          {modules.map((mod) => (
            <label key={mod.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={selectedModules.includes(mod.id)}
                onChange={() => handleModuleChange(mod.id)}
                style={{ width: 24, height: 24 }}
              />
              {mod.label}
            </label>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label htmlFor="question-dropdown" style={{ fontWeight: 500, marginBottom: 8, display: "block" }}>
          Fragen für den Einlagenfinder auswählen
        </label>
        <select
          id="question-dropdown"
          value={dropdownValue}
          onChange={(e) => setDropdownValue(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        >
          <option value="">Bitte wählen…</option>
          <option value="einsatz">Für welchen Einsatz sollen die Einlagen verwendet werden?</option>
          <option value="sportschuh">Für welchen Sportschuh verwenden Sie die Einlagen?</option>
          <option value="aktivitaet">Welches Aktivitätslevel trifft am besten auf Sie zu?</option>
          <option value="gesundheit">Haben Sie gesundheitliche Probleme (z. B. Diabetes), die Ihre Fußgesundheit beeinflussen?</option>
          <option value="gewicht">Wie viel wiegen Sie ungefähr?</option>
          <option value="schmerzen3d">Haben Sie Schmerzen? Wenn ja, markieren Sie bitte die betroffenen Bereiche auf dem 3D-Modell.</option>
          <option value="weitere_beschwerden">Haben Sie weitere relevante Beschwerden oder Schmerzen?</option>
          <option value="gleichgewicht">Haben Sie Probleme mit Gleichgewicht, Gang oder Beweglichkeit?</option>
          <option value="erwartungen">Welche Erwartungen oder Ziele haben Sie mit den Einlagen?</option>
          <option value="farbe">Haben Sie eine bevorzugte Farbe für den Überzug Ihrer Einlagen?</option>
        </select>
      </div>
      <div style={{ marginBottom: 24 }}>
        <b>Sprache wählen</b>
        <div style={{ marginTop: 8 }}>
          <select style={{ width: "100%", padding: 8 }} defaultValue="de">
            <option value="de">Deutsch</option>
            <option value="en">Englisch</option>
          </select>
        </div>
      </div>
    </div>
  );
}
