"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Settings,
    MessageSquare,
    Save,
    Bell,
    Scan,
    Footprints,
    Palette,
    Globe,
    Users,
    Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import BasicSettings from "@/components/DashboardSettings/BasicSettings";
import CustomerCommunication from "@/components/DashboardSettings/CustomerCommunication";
import BackupSettings from "@/components/DashboardSettings/BackupSettings";
import Notifications from "@/components/DashboardSettings/Notifications";
import LanguageTimeZone from "@/components/DashboardSettings/LanguageTimeZone";
import UserManagementAccessRights from "@/components/DashboardSettings/UserManagementAccessRights";

const sidebarData = [
    { id: "dashboard", icon: Settings, label: "Dashboard & Grundeinstellungen" },
    { id: "communication", icon: MessageSquare, label: "Kundenkommunikation" },
    { id: "backup", icon: Save, label: "Backup Einstellungen" },
    { id: "notifications", icon: Bell, label: "Benachrichtigungen" },
    { id: "scan", icon: Scan, label: "Scaneinstellungen" },
    { id: "shoefinder", icon: Footprints, label: "Shoe Finder" },
    { id: "design", icon: Palette, label: "Design & Logo" },
    { id: "language", icon: Globe, label: "Sprache & Zeitzone" },
    { id: "users", icon: Users, label: "Benutzerverwaltung & Zugriffsrechte" },
];

export default function SettingsProfilePage() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500); // 0.5 sec simulated loading
        return () => clearTimeout(timer);
    }, [activeTab]);

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <BasicSettings />;
            case "communication":
                return <CustomerCommunication />;
            case "backup":
                return <BackupSettings />;
            case "notifications":
                return <Notifications />;
            case "scan":
                return <div>Scaneinstellungen</div>;
            case "shoefinder":
                return <div>Shoe Finder</div>;
            case "design":
                return <div>Design & Logo</div>;
            case "language":
                return <LanguageTimeZone />;
            case "users":
                return <UserManagementAccessRights />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            <Tabs
                orientation="vertical"
                defaultValue="dashboard"
                value={activeTab}
                onValueChange={(val) => setActiveTab(val)}
                className="flex flex-col lg:flex-row gap-6"
            >
                {/* Sidebar */}
                <div className="w-full lg:w-5/12 2xl:w-3/12 lg:sticky lg:top-0 self-start">
                    <div className="overflow-x-auto lg:overflow-visible">
                        <TabsList className="flex flex-row lg:flex-col items-start h-fit space-x-2 lg:space-x-0 lg:space-y-7 bg-gray-50/50 p-2 rounded-lg shadow-sm backdrop-blur-sm whitespace-nowrap lg:whitespace-normal">
                            {sidebarData.map((item) => (
                                <TabsTrigger
                                    key={item.id}
                                    value={item.id}
                                    className="min-w-max lg:min-w-0 w-full justify-start cursor-pointer px-4 py-2 text-left transition-all duration-200 hover:bg-white hover:shadow-md rounded-md data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border-[#61A07B]"
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon className="w-5 h-5 shrink-0" />
                                        <span className="text-base font-normal">{item.label}</span>
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </div>

                {/* Tab content */}
                <div className="flex-1 min-w-0">
                    <TabsContent value={activeTab} className="mt-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-[300px]">
                                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
                            </div>
                        ) : (
                            renderContent()
                        )}
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
