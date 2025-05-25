import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircle, User, Clock } from 'lucide-react'

export default function UserManagementAccessRights() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Benutzerverwaltung & Zugriffsrechte</CardTitle>
        <p className="text-sm text-muted-foreground">
          In diesem Bereich können Sie den Zugriff auf Ihr System steuern.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Feature 1 */}
        <div className="flex items-start gap-4">
          <CheckCircle className="text-green-500 mt-1" />
          <div>
            <h3 className="font-semibold">Benutzerkonten verwalten</h3>
            <p className="text-sm text-muted-foreground">
              Neue Mitglieder hinzufügen, Konten deaktivieren oder Benutzerdaten aktualisieren
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-start gap-4">
          <User className="text-black mt-1" />
          <div>
            <h3 className="font-semibold">Rollen & Berechtigungen</h3>
            <p className="text-sm text-muted-foreground">
              Verschiedene Rollen (z. B. Admin, Mitarbeiter) zuweisen
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-start gap-4">
          <Clock className="text-black mt-1" />
          <div>
            <h3 className="font-semibold">Aktive Sitzungen anzeigen & beenden</h3>
            <p className="text-sm text-muted-foreground">
              Angemeldete Benutzer einsehen und bei Bedarf abmelden
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
