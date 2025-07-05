import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import Link from "next/link";

interface SidebarItem {
  id: string;
  icon: React.ElementType;
  label: string;
  href?: string;
}

interface SettingsLayoutProps {
  sidebarData: SidebarItem[];
  activeTab: string;
  setActiveTab: (val: string) => void;
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  sidebarData,
  activeTab,
  setActiveTab,
  children,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Sidebar */}
      <aside className="w-full lg:w-5/12 2xl:w-3/12 lg:sticky lg:top-0 self-start">
        <div className="overflow-x-auto lg:overflow-visible">
          <nav className="flex flex-row lg:flex-col items-start h-fit space-x-2 lg:space-x-0 lg:space-y-5 bg-gray-50/50 p-2 rounded-lg shadow-sm backdrop-blur-sm whitespace-nowrap lg:whitespace-normal border border-gray-200">
            {sidebarData.map((item) => {
              const isActive = activeTab === item.id;
              const content = (
                <>
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="text-base font-normal">{item.label}</span>
                </>
              );

              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`min-w-max lg:min-w-0 w-full flex items-center space-x-3 px-4 py-2 text-left transition-all duration-200 rounded-md border-l-4 ${isActive
                        ? "bg-white shadow-sm border-[#61A07B] text-[#61A07B]"
                        : "hover:bg-white hover:shadow-sm border-transparent text-gray-700"
                      }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`min-w-max lg:min-w-0 w-full flex items-center space-x-3 px-4 py-2 text-left transition-all duration-200 rounded-md border-l-4 ${isActive
                      ? "bg-white shadow-sm border-[#61A07B] text-[#61A07B]"
                      : "hover:bg-white hover:shadow-sm border-transparent text-gray-700"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {content}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
};

export default SettingsLayout; 