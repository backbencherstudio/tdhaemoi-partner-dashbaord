"use client";

import {
    Settings,
    MessageSquare,
    Save,
    Bell,
    Scan,
    Palette,
    Globe,
    Users,
    Warehouse,
    Monitor,
    ClipboardList,
    FootprintsIcon,
    Lock,
    Store,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import SettingsLayout from "@/components/Settings/SettingsLayout";

const sidebarData = [
    {
        id: "dashboard",
        icon: Settings,
        label: "Grundeinstellungen",
        href: "/dashboard/settings-profile"
    },
    {
        id: "changes-password",
        icon: Lock,
        label: "Passwort ändern",
        href: "/dashboard/settings-profile/changes-password"
    },
    {
        id: "communication",
        icon: MessageSquare,
        label: "Kundenkommunikation",
        href: "/dashboard/settings-profile/communication"
    },
    {
        id: "backup",
        icon: Save,
        label: "Backup Einstellungen",
        href: "/dashboard/settings-profile/backup"
    },
    {
        id: "versorgungs",
        icon: FootprintsIcon,
        label: "Versorgungs",
        href: "/dashboard/versorgungs"
    },
    // {
    //     id: "lager",
    //     icon: Warehouse,
    //     label: "Lager",
    //     href: "/dashboard/settings-profile/lager"
    // },
    {
        id: "werkstattzettel",
        icon: Warehouse,
        label: "Werkstattzettel",
        href: "/dashboard/settings-profile/werkstattzettel"
    },
    {
        id: "notifications",
        icon: Store,
        label: "Lagereinstellungen",
        href: "/dashboard/settings-profile/notifications"
    },
    // {
    //     id: "scan",
    //     icon: Scan,
    //     label: "Scaneinstellungen",
    //     href: "/dashboard/settings-profile/scan"
    // },
    {
        id: "preisverwaltung",
        icon: Scan,
        label: "Preisverwaltung",
        href: "/dashboard/settings-profile/preisverwaltung"
    },
    {
        id: "software-scanstation",
        icon: Monitor,
        label: "Software Scanstation",
        href: "/dashboard/settings-profile/software-scanstation"
    },
    {
        id: "design",
        icon: Palette,
        label: "Design & Logo",
        href: "/dashboard/settings-profile/design"
    },
    // {
    //     id: "language",
    //     icon: Globe,
    //     label: "Sprache & Zeitzone",
    //     href: "/dashboard/settings-profile/language"
    // },
    // {
    //     id: "users",
    //     icon: Users,
    //     label: "Benutzerverwaltung & Zugriffsrechte",
    //     href: "/dashboard/settings-profile/users"
    // }
];

export default function SettingsProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    // Determine active tab based on current path
    const getActiveTab = useCallback(() => {
        const path = pathname.split('/').pop();
        if (path === 'settings-profile') return 'dashboard';
        return path || 'dashboard';
    }, [pathname]);

    const [activeTab, setActiveTab] = useState(getActiveTab());

    useEffect(() => {
        setActiveTab(getActiveTab());
    }, [pathname, getActiveTab]);

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