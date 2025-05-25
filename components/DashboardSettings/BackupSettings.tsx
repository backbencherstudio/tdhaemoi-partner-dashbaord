import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function BackupSettings() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Backup Einstellungen</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Hier konfigurieren Sie, wie und wann Datensicherungen durchgeführt werden.
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2 ">
                    <label className="text-sm font-medium">Automatische Backups:</label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Backup-Intervall wählen" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Täglich</SelectItem>
                            <SelectItem value="weekly">Wöchentlich</SelectItem>
                            <SelectItem value="monthly">Monatlich</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Manuelle Backup-Optionen</label>
                    <Input placeholder="Backup-Pfad eingeben" className='border border-gray-600' />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Wiederherstellungspunkte und Datenrettung</label>
                    <Input placeholder="Wiederherstellungspfad eingeben"  className='border border-gray-600'/>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Ausgerherszerungspn</label>
                    <Input placeholder="Ausgerherszerungspfad eingeben" className='border border-gray-600' />
                </div>
            </CardContent>
        </Card>
    )
}