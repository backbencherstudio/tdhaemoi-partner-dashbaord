"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PreisverwaltungPage() {
  const [taxDisplay, setTaxDisplay] = useState<"inkl" | "exkl" | "">("");
  const [fussanalyse, setFussanalyse] = useState("");
  const [einlagenversorgung, setEinlagenversorgung] = useState("");

  return (
    <div className="max-w-3xl mx-auto mt-10 font-sans">
      <h1 className="text-4xl font-bold mb-2">Preisverwaltung</h1>
      <p className="mb-8">
        Legen Sie Standardpreise an, um sie später bei Aufträgen schnell auszuwählen.
      </p>

      <div className="mb-8">
        <div className="font-semibold text-lg mb-2">Mehrwertsteuer</div>
        <div className="flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={taxDisplay === "inkl"}
              onChange={() => setTaxDisplay("inkl")}
              className="w-6 h-6 accent-black"
            />
            Preise inkl. MwSt. anzeigen
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={taxDisplay === "exkl"}
              onChange={() => setTaxDisplay("exkl")}
              className="w-6 h-6 accent-black"
            />
            Preise exkl. MwSt. anzeigen
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="font-semibold block mb-2">Fußanalyse</label>
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="z.B. 25 €"
          value={fussanalyse}
          onChange={e => setFussanalyse(e.target.value)}
          className="border border-gray-600"
        />
      </div>

      <div className="mb-6">
        <label className="font-semibold block mb-2">Einlagenversorgung</label>
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="z.B. 170 €"
          value={einlagenversorgung}
          onChange={e => setEinlagenversorgung(e.target.value)}
          className="border border-gray-600"
        />
      </div>

      <Button type="button" className="w-full mt-8 cursor-pointer">
        Speichern
      </Button>
    </div>
  );
}
