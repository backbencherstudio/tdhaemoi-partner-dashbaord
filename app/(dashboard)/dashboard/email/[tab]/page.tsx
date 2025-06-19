"use client";
import React, { useState, useContext, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import SentDataEmail from '@/components/EmailManagement/SentDataEmail';
import { Search, Trash2 } from 'lucide-react';
import { FavoriteCountContext } from '@/contexts/FavoriteCountContext';
import { groupEmailDelete, singleEmailDelete } from '@/apis/emailManagement';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EmailData {
  id: string;
  subject: string;
  content: string;
  createdAt: string;
  isFavorite: boolean;
  sender?: {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
  };
  recipient?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  };
  recipientEmail?: string;
}

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
  const searchParams = useSearchParams();
  const tab = params.tab as string;
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [topTab, setTopTab] = useState('allgemein');
  const [search, setSearch] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSingleDeleteDialog, setShowSingleDeleteDialog] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
  const { updateFavoriteCount } = useContext(FavoriteCountContext);

  // Initialize search from URL on component mount
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlTopTab = searchParams.get('tab') || 'allgemein';
    setSearch(urlSearch);
    setTopTab(urlTopTab);
  }, [searchParams]);

  // Update URL when search or topTab changes
  // const updateURL = (newSearch: string, newTopTab?: string) => {
  //   const params = new URLSearchParams(searchParams.toString());
    
  //   if (newSearch.trim()) {
  //     params.set('search', newSearch);
  //   } else {
  //     params.delete('search');
  //   }
    
  //   if (newTopTab) {
  //     params.set('tab', newTopTab);
  //   }
    
  //   router.push(`/dashboard/email/${tab}?${params.toString()}`);
  // };

  const handleSingleEmailDelete = (emailId: string) => {
    setEmailToDelete(emailId);
    setShowSingleDeleteDialog(true);
  };

  const confirmSingleEmailDelete = async () => {
    if (!emailToDelete) return;
    
    setIsDeleting(true);
    try {
      await singleEmailDelete(emailToDelete);
      toast.success('E-Mail erfolgreich gelöscht');
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to delete email:', error);
      toast.error('Fehler beim Löschen der E-Mail');
    } finally {
      setIsDeleting(false);
      setShowSingleDeleteDialog(false);
      setEmailToDelete(null);
    }
  };

  const handleEmailClick = (email: EmailData) => {
    router.push(`/dashboard/email/${tab}/${email.id}`);
  };

  const handleDeleteSelected = async () => {
    if (selectedEmails.size === 0) return;

    setIsDeleting(true);
    try {
      const messageIds = Array.from(selectedEmails);
      await groupEmailDelete(messageIds);
      toast.success(`${selectedEmails.size} email(s) deleted successfully`);
      setSelectedEmails(new Set());

      setRefreshKey(prev => prev + 1);
    } catch {
      // console.error('Failed to delete emails:', error);
      toast.error('Failed to delete selected emails');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
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
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} />
                {isDeleting ? 'Löschen...' : `Löschen (${selectedEmails.size})`}
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
        refreshKey={refreshKey}
        onSingleEmailDelete={handleSingleEmailDelete}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>E-Mails löschen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie {selectedEmails.size} ausgewählte E-Mail(s) löschen möchten?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
            >
              {isDeleting ? 'Löschen...' : 'Löschen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single Email Delete Confirmation Dialog */}
      <Dialog open={showSingleDeleteDialog} onOpenChange={setShowSingleDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>E-Mail löschen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie diese E-Mail löschen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSingleDeleteDialog(false)}
              disabled={isDeleting}
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={confirmSingleEmailDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Löschen...' : 'Löschen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 