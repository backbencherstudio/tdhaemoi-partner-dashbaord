import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Settings, MessageSquare, Save, Bell, Scan, Footprints, Palette, Globe, Users } from "lucide-react"
import BasicSettings from "@/components/DashboardSettings/BasicSettings"

const sidebarData = [
    { id: 'dashboard', icon: Settings, label: 'Dashboard & Grundeinstellungen' },
    { id: 'communication', icon: MessageSquare, label: 'Kundenkommunikation' },
    { id: 'backup', icon: Save, label: 'Backup Einstellungen' },
    { id: 'notifications', icon: Bell, label: 'Benachrichtigungen' },
    { id: 'scan', icon: Scan, label: 'Scaneinstellungen' },
    { id: 'shoefinder', icon: Footprints, label: 'Shoe Finder' },
    { id: 'design', icon: Palette, label: 'Design & Logo' },
    { id: 'language', icon: Globe, label: 'Sprache & Zeitzone' },
    { id: 'users', icon: Users, label: 'Benutzerverwaltung & Zugriffsrechte' },
]

export default function SettingsProfilePage() {
    return (
        <div className="">
            <Tabs orientation="vertical" defaultValue="dashboard" className="flex flex-col lg:flex-row gap-10">
                <TabsList className="w-full lg:w-4/12 xl:w-3/12 flex-col h-fit sticky top-0 space-y-7 bg-gray-50/50 p-2 rounded-lg shadow-sm backdrop-blur-sm overflow-x-auto">
                    {sidebarData.map((item) => (
                        <TabsTrigger
                            key={item.id}
                            value={item.id}
                            className="w-full cursor-pointer justify-start px-4 py-1 text-left transition-all duration-200 hover:bg-white hover:shadow-md rounded-md data-[state=active]:bg-white data-[state=active]:shadow-md  data-[state=active]:border-[#61A07B]"
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon className="w-5 h-5" />
                                <span className="text-base lg:text-md font-normal">{item.label}</span>
                            </div>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="flex-1 min-w-0">
                    <TabsContent value="dashboard" className="mt-0 lg:mt-0">
                        <BasicSettings />
                    </TabsContent>

                    <TabsContent value="communication" className="mt-0 lg:mt-0">
                        <Card className="p-4 lg:p-6 shadow-sm">
                            <h2 className="text-xl lg:text-2xl font-bold mb-4">Customer Communication</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Add your communication content here */}
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Add similar TabsContent sections for other tabs */}
                </div>
            </Tabs>
        </div>
    )
}
