"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import SingleEmailView from '@/components/EmailManagement/SingleEmailView';
import { getSingleEmail } from '@/apis/emailManagement';

export default function EmailDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tab = params.tab as string;
  const id = params.id as string;
  const [email, setEmail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSingleEmail(id)
      .then(res => setEmail(res.data))
      .catch(() => setError('Failed to load email'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  if (!email) return null;

  return (
    <SingleEmailView
      email={email}
      fromTab={tab}
      onBack={() => router.back()}
      onDelete={() => {}}
      onArchive={() => {}}
    />
  );
} 