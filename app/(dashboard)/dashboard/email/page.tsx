import { redirect } from 'next/navigation';

export default function EmailPage() {
  redirect('/dashboard/email/inbox');
  return null;
}
