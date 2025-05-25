import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'

export default function LanguageTimeZone() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sprache & Zeitzone</CardTitle>
        <p className="text-sm text-muted-foreground">
          Hier legen Sie fest:
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Systemsprache */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Systemsprache:</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sprache wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="en">Englisch</SelectItem>
              <SelectItem value="fr">Französisch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Standardzeitzone */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Standardzeitzone:</label>
          <Input placeholder="z. B. Europe/Berlin" />
        </div>

        {/* Mehrsprachigkeit */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Mehrsprachigkeit</label>
          <Input placeholder="z. B. Aktiviert / Deaktiviert" />
        </div>
      </CardContent>
    </Card>
  )
}
