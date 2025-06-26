import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Clock } from "lucide-react"

export type BackupSettingsForm = {
    automaticBackups: boolean;
    backupFrequency: "ja" | "nein"; // Backup-Frequenz wählen
    backupTime: string; // Uhrzeit für Backup, e.g., "03:00"
    storageTarget: string; // Speicherziel wählen (e.g., "Cloud", "Lokaler Server")
    storagePath: string; // Pfad oder Verbindungslink eingeben
    retentionPeriod: number; // Aufbewahrungszeitraum (in Tagen)
    notifyOnFailure: boolean; // Benachrichtigungen bei Problemen
    notificationEmail: string; // Benenfangeradresse für Benachrichtigungen
};

export default function BackupSettings() {
    const [form, setForm] = useState<BackupSettingsForm>({
        automaticBackups: true,
        backupFrequency: "ja",
        backupTime: "03:00",
        storageTarget: "cloud",
        storagePath: "https://drive.google.com/x",
        retentionPeriod: 30,
        notifyOnFailure: false,
        notificationEmail: "audre1@feetf1rst.com",
    });

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Backupeinstellungen</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Konfigurieren Sie, wie und wann Datensicherungen durchgeführt werden. Alle Einstellungen können jederzeit angepasst werden.
                </p>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Automatische Backups aktivieren */}
                <section className="bg-muted/40 rounded-lg p-4 sm:p-5 space-y-3 border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="font-semibold text-lg">Automatische Backups aktivieren</span>
                        <div className="flex items-center gap-2">
                            <Switch checked={form.automaticBackups} onCheckedChange={v => setForm(f => ({ ...f, automaticBackups: v }))} />
                            <span className="text-xs text-muted-foreground">{form.automaticBackups ? 'Aktiviert' : 'Deaktiviert'}</span>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Automatische Sicherung Ihrer Daten gemäß den untenstehenden Einstellungen.</p>
                    <div className="grid grid-cols-1  gap-4 mt-2">
                        <div>
                            <label className="text-sm font-medium">Backup-Frequenz wählen</label>
                            <Select value={form.backupFrequency} onValueChange={v => setForm(f => ({ ...f, backupFrequency: v as "ja" | "nein" }))}>
                                <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Ja/Nein" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ja">Ja</SelectItem>
                                    <SelectItem value="nein">Nein</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-xs text-muted-foreground">Wählen Sie, ob Backups automatisch erstellt werden sollen.</span>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Uhrzeit für Backup</label>
                            <div className="relative mt-1">
                                <Input
                                    type="time"
                                    value={form.backupTime}
                                    onChange={e => setForm(f => ({ ...f, backupTime: e.target.value }))}
                                    className="w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                    onClick={(e) => {
                                        e.currentTarget.showPicker?.();
                                    }}
                                />
                            </div>
                            <span className="text-xs text-muted-foreground">Format: HH:MM (z.B. 03:00)</span>
                        </div>
                    </div>
                </section>

                {/* Speicherort festlegen */}
                <section className="bg-muted/40 rounded-lg p-4 sm:p-5 space-y-3 border">
                    <span className="font-semibold text-lg">Speicherort festlegen</span>
                    <p className="text-xs text-muted-foreground">Bestimmen Sie, wo Ihre Backups gespeichert werden sollen.</p>
                    <div className="grid grid-cols-1  gap-4 mt-2">
                        <div>
                            <label className="text-sm font-medium">Speicherziel wählen</label>
                            <Select value={form.storageTarget} onValueChange={v => setForm(f => ({ ...f, storageTarget: v }))}>
                                <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Cloud (z.B. AWS, Google Drive)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cloud">Cloud (z.B. AWS, Google Drive)</SelectItem>
                                    <SelectItem value="local">Lokaler Server</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-xs text-muted-foreground">Wählen Sie Ihr bevorzugtes Speicherziel.</span>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Pfad oder Verbindungslink eingeben</label>
                            <Input value={form.storagePath} onChange={e => setForm(f => ({ ...f, storagePath: e.target.value }))} className="w-full mt-1" />
                            <span className="text-xs text-muted-foreground">Beispiel: https://drive.google.com/xyz</span>
                        </div>
                    </div>
                </section>

                {/* Aufbewahrungszeitraum */}
                <section className="bg-muted/40 rounded-lg p-4 sm:p-5 space-y-3 border">
                    <span className="font-semibold text-lg">Aufbewahrungszeitraum</span>
                    <p className="text-xs text-muted-foreground">Wie lange sollen die Backups gespeichert bleiben?</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                        <label className="text-sm font-medium">Tage:</label>
                        <Input type="number" min={1} value={form.retentionPeriod} onChange={e => setForm(f => ({ ...f, retentionPeriod: Number(e.target.value) }))} className="w-full sm:w-24" />
                        <span className="text-xs text-muted-foreground">(Standard: 30 Tage)</span>
                    </div>
                </section>

                {/* Benachrichtigungen bei Problemen */}
                <section className="bg-muted/40 rounded-lg p-4 sm:p-5 space-y-3 border">
                    <div className="flex flex-col xl:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="font-semibold text-lg">Benachrichtigungen bei Problemen</span>
                        <div className="flex items-center gap-2">
                            <Switch checked={form.notifyOnFailure} onCheckedChange={v => setForm(f => ({ ...f, notifyOnFailure: v }))} />
                            <span className="text-xs text-muted-foreground">{form.notifyOnFailure ? 'Aktiviert' : 'Deaktiviert'}</span>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Warnung an Administrator, falls Backup ein Problem hat.</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                        <label className="text-sm font-medium">Empfängeradresse für Benachrichtigungen</label>
                        <Input value={form.notificationEmail} onChange={e => setForm(f => ({ ...f, notificationEmail: e.target.value }))} className="w-full sm:w-80" />
                    </div>
                </section>
            </CardContent>
        </Card>
    )
}