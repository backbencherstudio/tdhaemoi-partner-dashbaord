"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import SingleEmailView from '@/components/EmailManagement/SingleEmailView';
import { getSingleEmail, singleEmailDelete } from '@/apis/emailManagement';
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

export default function EmailDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tab = params.tab as string;
  const id = params.id as string;
  const [email, setEmail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSingleEmail(id)
      .then(res => setEmail(res.data))
      .catch(() => setError('Failed to load email'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await singleEmailDelete(id);
      toast.success('E-Mail erfolgreich gelöscht');
      router.back();
    } catch (error) {
      console.error('Failed to delete email:', error);
      toast.error('Fehler beim Löschen der E-Mail');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  if (!email) return null;

  return (
    <>
      <SingleEmailView
        email={email}
        fromTab={tab}
        onBack={() => router.back()}
        onDelete={handleDelete}
        onArchive={() => {}}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Löschen...' : 'Löschen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 