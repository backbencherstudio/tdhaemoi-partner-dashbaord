'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface ProductImageInfoProps {
  shaft: {
    name: string;
    ide: string;
    description: string;
    price: number;
    image: string;
  };
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
}

export default function ProductImageInfo({ shaft, uploadedImage, setUploadedImage }: ProductImageInfoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
      {/* Image */}
      <div className="w-full md:w-1/2 flex justify-center my-10">
        <div
          className="cursor-pointer w-full h-full"
          onClick={() => fileInputRef.current?.click()}
          title="Bild ändern"
        >
          <div className="w-full h-full">
            <Image
              src={uploadedImage || shaft.image}
              alt={shaft.name}
              width={1000}
              height={1000}
              className="w-[550px] h-full object-cover"
              priority
            />
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Product info section */}
      <div className="w-full md:w-1/2 flex flex-col">
        <h2 className="text-2xl font-bold mb-1">{shaft.name}</h2>
        <p className="text-gray-500 text-sm font-medium mb-4">#{shaft.ide}</p>
        <p className="text-lg font-medium mb-6">{shaft.description}</p>
        <div className="mt-2">
          <span className="text-xs text-gray-500 block mb-1">
            Preis <span className="text-[10px]">(wird automatisch aktualisiert)</span>
          </span>
          <span className="text-3xl font-extrabold tracking-tight">
            {shaft.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
      </div>
    </div>
  );
}
