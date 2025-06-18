"use client";
import React, { useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SentDataEmail from '@/components/EmailManagement/SentDataEmail';
import { Search, Trash2 } from 'lucide-react';
import { FavoriteCountContext } from '../layout';

const topTabs = [
  { id: "allgemein", color: "bg-gray-200", label: "Allgemein", short: "A" },
  { id: "fastfirst", color: "bg-blue-500", label: "FastFirst Nachrichten", short: "F" },
  { id: "bestellungen", color: "bg-green-500", label: "Bestellungen", short: "B" },
  { id: "lager", color: "bg-purple-500", label: "Lager-Benachrichtigungen", short: "L" },
  { id: "kunden", color: "bg-orange-500", label: "Kunden-Benachrichtigungen", short: "K" }
];

export default function EmailTabPage() {
  const params = useParams();
  const router = useRouter();
  const tab = params.tab as string;
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [topTab, setTopTab] = useState('allgemein');
  const [search, setSearch] = useState('');
  const { updateFavoriteCount } = useContext(FavoriteCountContext);

  const handleEmailClick = (email: any) => {
    router.push(`/dashboard/email/${tab}/${email.id}`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Navbar/Filters */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex items-center px-4 py-2 space-x-6 min-w-max">
          {topTabs.map((t) => (
            <div
              key={t.id}
              onClick={() => setTopTab(t.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${topTab === t.id ? "bg-gray-200 font-semibold" : "hover:bg-gray-50"}`}
            >
              <div className={`w-6 h-6 ${t.color} rounded flex items-center justify-center`}>
                <span className="text-xs font-medium text-white">{t.short}</span>
              </div>
              <span className="text-sm">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-900 capitalize">{tab}</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {selectedEmails.size > 0 && (
              <button
                onClick={() => setSelectedEmails(new Set())}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100 transition"
              >
                <Trash2 size={16} />
                {`Löschen (${selectedEmails.size})`}
              </button>
            )}
            <div className="relative flex-1 sm:flex-none">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="E-Mails durchsuchen"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email List */}
      <SentDataEmail
        activeTab={tab}
        topTab={topTab}
        selectedEmails={selectedEmails}
        onEmailClick={handleEmailClick}
        onSelectedEmailsChange={setSelectedEmails}
        onFavoriteCountChange={updateFavoriteCount}
        search={search}
      />
    </div>
  );
} 