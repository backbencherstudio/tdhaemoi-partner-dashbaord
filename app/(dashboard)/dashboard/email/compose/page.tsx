"use client";
import EmailManagement from "@/components/EmailManagement/EmailManagement";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ComposeEmailModal() {
  const router = useRouter();

  // Close modal on background click or after send
  const handleClose = () => router.back();

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative z-50">
        <EmailManagement setShowCompose={handleClose} />
      </div>
      <div className="fixed inset-0 z-40" onClick={handleClose} />
    </div>
  );
} 