"use client";

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
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SettingsLayout from "@/components/Settings/SettingsLayout";

const sidebarData = [
    { id: "dashboard", icon: Settings, label: "Dashboard & Grundeinstellungen", href: "/dashboard/settings-profile" },
    { id: "communication", icon: MessageSquare, label: "Kundenkommunikation", href: "/dashboard/settings-profile/communication" },
    { id: "backup", icon: Save, label: "Backup Einstellungen", href: "/dashboard/settings-profile/backup" },
    { id: "notifications", icon: Bell, label: "Benachrichtigungen", href: "/dashboard/settings-profile/notifications" },
    { id: "scan", icon: Scan, label: "Scaneinstellungen", href: "/dashboard/settings-profile/scan" },
    { id: "shoefinder", icon: Footprints, label: "Shoe Finder", href: "/dashboard/settings-profile/shoefinder" },
    { id: "design", icon: Palette, label: "Design & Logo", href: "/dashboard/settings-profile/design" },
    { id: "language", icon: Globe, label: "Sprache & Zeitzone", href: "/dashboard/settings-profile/language" },
    { id: "users", icon: Users, label: "Benutzerverwaltung & Zugriffsrechte", href: "/dashboard/settings-profile/users" },
];

export default function SettingsProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    
    // Determine active tab based on current path
    const getActiveTab = () => {
        const path = pathname.split('/').pop();
        if (path === 'settings-profile') return 'dashboard';
        return path || 'dashboard';
    };

    const [activeTab, setActiveTab] = useState(getActiveTab());

    useEffect(() => {
        setActiveTab(getActiveTab());
    }, [pathname]);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        const tabItem = sidebarData.find(item => item.id === tabId);
        if (tabItem?.href) {
            router.push(tabItem.href);
        }
    };

    return (
        <SettingsLayout
            sidebarData={sidebarData}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
        >
            {children}
        </SettingsLayout>
    );
} 