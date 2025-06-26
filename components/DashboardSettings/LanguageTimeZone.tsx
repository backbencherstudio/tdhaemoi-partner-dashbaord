import React from 'react'
import toast from 'react-hot-toast'
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
import { Button } from "@/components/ui/button"

export default function LanguageTimeZone() {
  const handleSave = () => {
    toast.success('Einstellungen erfolgreich gespeichert!')
  }

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
            </SelectContent>
          </Select>
        </div>

        {/* Standardzeitzone */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Standardzeitzone:</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Zeitzone wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Europe/London">Europe/London (UTC +0)</SelectItem>
              <SelectItem value="Europe/Berlin">Europe/Berlin (UTC +1)</SelectItem>
              <SelectItem value="Europe/Vienna">Europe/Vienna (UTC +1)</SelectItem>
              <SelectItem value="Europe/Paris">Europe/Paris (UTC +1)</SelectItem>
              <SelectItem value="Europe/Madrid">Europe/Madrid (UTC +1)</SelectItem>
              <SelectItem value="Europe/Rome">Europe/Rome (UTC +1)</SelectItem>
              <SelectItem value="Europe/Athens">Europe/Athens (UTC +2)</SelectItem>
              <SelectItem value="Europe/Bucharest">Europe/Bucharest (UTC +2)</SelectItem>
              <SelectItem value="Europe/Riga">Europe/Riga (UTC +2)</SelectItem>
              <SelectItem value="Europe/Helsinki">Europe/Helsinki (UTC +2)</SelectItem>
              <SelectItem value="Europe/Istanbul">Europe/Istanbul (UTC +3)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave}>
            Speichern
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}
