import DashboardLayout from '@/components/Layout/DashboardLayout';
import React from 'react'
import { Toaster } from 'react-hot-toast';
    

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <DashboardLayout>
            {children}
            <Toaster />
        </DashboardLayout>
    )
}
