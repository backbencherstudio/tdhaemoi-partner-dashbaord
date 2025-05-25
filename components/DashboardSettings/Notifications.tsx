import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Notifications() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Benachrichtigungen</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Dieser Bereich verwaltet alle Warnmeldungen und Benachrichtigungen im System.
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Automatische Backups-</label>
                    <Input placeholder="Intervall oder Einstellung" className='border border-gray-600' />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Manuelle Benachrichtigungen</label>
                    <Input placeholder="Benachrichtigung konfigurieren" className='border border-gray-600' />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Einstellungen für Benutzer</label>
                    <Input placeholder="Benutzereinstellungen definieren" className='border border-gray-600' />
                </div>

            </CardContent>
        </Card>
    )
}
