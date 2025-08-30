'use client'
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '../../../lib/protected-route';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </ProtectedRoute>
    );
}
