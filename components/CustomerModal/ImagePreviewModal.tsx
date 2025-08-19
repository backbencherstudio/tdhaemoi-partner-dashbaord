import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';

const StlModelViewer = dynamic(() => import('@/components/StlModelViewer'), { ssr: false });

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalImg: string | null;
  modalTitle: string;
  modalType: 'image' | 'stl' | null;
  stlUrl: string | null;
}

export default function ImagePreviewModal({
  isOpen,
  onClose,
  modalImg,
  modalTitle,
  modalType,
  stlUrl
}: ImagePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold mb-4">{modalTitle}</DialogTitle>
        </DialogHeader>
        
        {modalType === 'image' && (
          modalImg ? (
            <img 
              src={modalImg} 
              alt={modalTitle} 
              className="max-w-full max-h-96 mx-auto" 
            />
          ) : (
            <div className="w-full h-60 flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
              No Preview
            </div>
          )
        )}
        
        {modalType === 'stl' && (
          stlUrl ? (
            <StlModelViewer url={stlUrl} />
          ) : (
            <div className="w-full h-60 flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
              No 3D Preview
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  )
}
