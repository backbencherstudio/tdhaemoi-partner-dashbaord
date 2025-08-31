'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    orderName?: string;
    currentStatus: string;
    newStatus: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    isDeleteAction?: boolean;
}

export default function ConfirmModal({
    open,
    onOpenChange,
    title,
    description,
    orderName,
    currentStatus,
    newStatus,
    onConfirm,
    confirmText = "Ja, Status ändern",
    cancelText = "Abbrechen",
    isDeleteAction = false
}: ConfirmModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                        {orderName && <strong> {orderName}</strong>} ändern möchten?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {!isDeleteAction ? (
                        <>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Aktueller Status:</span>
                                <span className="text-sm font-medium text-gray-800">{currentStatus}</span>
                            </div>
                            <div className="flex items-center justify-center my-2">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm text-gray-600">Neuer Status:</span>
                                <span className="text-sm font-medium text-blue-800">{newStatus}</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                            <span className="text-sm text-red-600">Auftrag wird gelöscht:</span>
                            <span className="text-sm font-medium text-red-800">{orderName}</span>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => onOpenChange(false)}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className={isDeleteAction ? "bg-red-600 cursor-pointer hover:bg-red-700" : "bg-blue-600 cursor-pointer hover:bg-blue-700"}
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
