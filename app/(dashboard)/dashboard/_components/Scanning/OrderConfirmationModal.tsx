import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'

interface OrderConfirmationModalProps {
    showConfirmModal: boolean;
    setShowConfirmModal: (showConfirmModal: boolean) => void;
    handleConfirmOrder: () => void;
    isCreating: boolean;
}
export default function OrderConfirmationModal({ showConfirmModal, setShowConfirmModal, handleConfirmOrder, isCreating }: OrderConfirmationModalProps) {


    return (

        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Bestellung bestätigen</DialogTitle>
                    <DialogDescription>
                        Sind Sie sicher, dass Sie eine neue Bestellung für diesen Kunden erstellen möchten?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        className='cursor-pointer'
                        variant="outline"
                        onClick={() => setShowConfirmModal(false)}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        className='cursor-pointer'
                        onClick={handleConfirmOrder}
                        disabled={isCreating}
                    >
                        {isCreating ? 'Erstelle...' : 'Ja, erstellen'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


    )
}
