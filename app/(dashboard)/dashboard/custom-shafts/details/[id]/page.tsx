'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import { User, UploadCloud } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useParams } from 'next/navigation';
import { customShaftsData } from '@/lib/customShaftsData';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import colorPlate from '@/public/images/color.png';


export default function DetailsPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [leatherProvided, setLeatherProvided] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nahtfarbeOption, setNahtfarbeOption] = useState('default');
  const [customNahtfarbe, setCustomNahtfarbe] = useState('');

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

  const params = useParams();
  const shaftId = params.id;
  const shaft = customShaftsData.find(item => item.no === shaftId);

  useEffect(() => {
    console.log('shaftId:', shaftId);
    console.log('shaft:', shaft);
    if (shaft) {
      console.log('Image path:', shaft.image);
    }
  }, [shaftId, shaft]);

  if (!shaft) return <div>Produkt nicht gefunden</div>;

  return (
    <div className="px-2 md:px-6 py-8 w-full ">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-left">
        Konfiguriere jetzt deinen Masschaft!
      </h1>
      <div className="flex flex-col gap-4 w-fit mb-8">
        <Button variant="outline" className="justify-start w-full h-12 text-base font-normal border border-black gap-3">
          <User className="w-5 h-5" />
          Kunde auswählen
        </Button>
        <Button variant="outline" className="justify-start w-full h-12 text-base font-normal border border-black gap-3">
          <UploadCloud className="w-5 h-5" />
          Upload 3D-Datei Linker Leisten
        </Button>
        <Button variant="outline" className="justify-start w-full h-12 text-base font-normal border border-black gap-3">
          <UploadCloud className="w-5 h-5" />
          Upload 3D-Datei Rechter Leisten
        </Button>
      </div>

      {/* Bottom: Image and Info */}
      <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div
            className="cursor-pointer w-full h-full"
            onClick={() => fileInputRef.current?.click()}
            title="Bild ändern"
          >
            <Image
              src={uploadedImage || shaft.image}
              alt={shaft.name}
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
              priority
            />
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
          <p className="text-gray-500 text-sm font-medium mb-4">#{shaft.no}</p>
          <p className="text-lg font-medium mb-6">{shaft.description}</p>
          <div className="mt-2">
            <span className="text-xs text-gray-500 block mb-1">
              Preis <span className="text-[10px]">(wird automatisch aktualisiert)</span>
            </span>
            <span className="text-3xl font-extrabold tracking-tight">{(shaft.price / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
          </div>
        </div>
      </div>


      {/* Bottom Section: Configurator */}
      <TooltipProvider>
        <div className="flex flex-col gap-6">
          {/* Leder bereit? */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2 md:w-1/3">
              <Label className="font-medium text-base">Ich stelle das Leder selbst bereit?</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <BsQuestionCircleFill className="w-4 h-4 text-gray-500 cursor-help hover:text-gray-700" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm p-3">
                  <div className="text-sm space-y-2">
                    <p>Sie können gerne Ihr eigenes Leder bereitstellen oder aus unserer ständig wachsenden Auswahl an hochwertigem Leder wählen, das direkt aus dem Norden Italiens stammt – hochwertig produziert im Herzen der Lederherstellung. Dazu bieten wir auch eine Auswahl an Futterleder.</p>
                    <p>Wählen Sie einfach, was Ihnen besser zuspricht.</p>
                    <p><strong>Wenn Sie unser Leder wählen, fällt ein Aufpreis von 30 € an.</strong></p>
                    <p>Wenn Sie Ihr eigenes Leder bereitstellen, entstehen lediglich die Lieferkosten nach Italien.</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="leatherProvided"
                  value="yes"
                  checked={leatherProvided === 'yes'}
                  onChange={(e) => setLeatherProvided(e.target.value)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Ja</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="leatherProvided"
                  value="no"
                  checked={leatherProvided === 'no'}
                  onChange={(e) => setLeatherProvided(e.target.value)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Nein (+24,99€)</span>
              </label>
            </div>
          </div>
          {/* Lederfarbe */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label className="font-medium text-base md:w-1/3">Lederfarbe:</Label>
            <Input
              type="text"
              placeholder="Lederfarbe wählen..."
              className="w-full md:w-1/2"
              disabled={leatherProvided !== 'yes'}
            />
          </div>
          {/* Innenfutter */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label className="font-medium text-base md:w-1/3">Innenfutter:</Label>
            <Input
              type="text"
              placeholder="Innenfutter wählen..."
              className="w-full md:w-1/2"
              disabled={leatherProvided !== 'yes'}
            />
          </div>
          {/* Nahtfarbe */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex flex-col md:w-1/3">
              <Label className="font-medium text-base">Nahtfarbe:</Label>
              <Dialog>
                <DialogTrigger asChild>
                  <a href="#" className="text-sm underline text-blue-700 hover:text-blue-900 w-fit mt-1">Hier können Sie den Katalog unserer Nahtfarben öffnen</a>
                </DialogTrigger>
                <DialogContent className="max-w-3xl flex flex-col items-center">
                  <DialogTitle>Nahtfarben Katalog</DialogTitle>
                  <Image src={colorPlate} alt="Nahtfarben Katalog" className="w-full h-auto rounded shadow" />
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <Select value={nahtfarbeOption} onValueChange={setNahtfarbeOption}>
                <SelectTrigger className="w-full md:w-1/2">
                  <SelectValue placeholder="Passend zur Lederfarbe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Passend zur Lederfarbe</SelectItem>
                  <SelectItem value="custom">Eigene Farbe angeben</SelectItem>
                </SelectContent>
              </Select>
              {nahtfarbeOption === 'custom' && (
                <Input
                  type="text"
                  placeholder="Eigene Nahtfarbe angeben..."
                  className="w-full md:w-1/2 mt-1"
                  value={customNahtfarbe}
                  onChange={e => setCustomNahtfarbe(e.target.value)}
                />
              )}
            </div>
          </div>
          {/* Schafthöhe */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label className="font-medium text-base md:w-1/3">Schafthöhe:</Label>
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> 7cm</label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> 9cm</label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Eigene</label>
            </div>
          </div>
          {/* Schaftform */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label className="font-medium text-base md:w-1/3">Schaftform:</Label>
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Standard</label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Eher weich</label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Eher steif</label>
            </div>
          </div>
          {/* Polsterung */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label className="font-medium text-base md:w-1/3">Polsterung:</Label>
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Standard</label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Lasche</label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Ferse</label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Innen-Außenknöchel</label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Vorderfuß</label>
            </div>
          </div>
          {/* Polsterung Anmerkung */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label className="font-medium text-base md:w-1/3"> </Label>
            <Textarea placeholder="Spezielle Anmerkung (z.B. Polsterdicke in mm, asymmetrisch, extraweich..)" className="w-full md:w-2/3" />
          </div>
          {/* Verstärkungen */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label className="font-medium text-base md:w-1/3">Verstärkungen:</Label>
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Standard</label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Fersenverstärkung</label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Innen-Außenknöchel</label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Vorderfuß</label>
            </div>
          </div>
          {/* Verstärkungen Anmerkung */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label className="font-medium text-base md:w-1/3"> </Label>
            <Textarea placeholder="Besondere Anmerkung zu den Verstärkungen (z.B. Material, Stärke, Position)" className="w-full md:w-2/3" />
          </div>
          {/* Schnürsenkel */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label className="font-medium text-base md:w-1/3">Möchten Sie passende Schnürsenkel zum Schuh? (+4,99€)</Label>
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Nein, ohne Ösen</label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Ja, Ösen einsetzen (+9,99€)</label>
            </div>
          </div>
          {/* Ösen */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label className="font-medium text-base md:w-1/3">Möchten Sie den Schaft bereits mit eingesetzten Ösen? (+9,99€)</Label>
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Ja, hinzufügen (+9,99€)</label>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> Nein, ohne</label>
            </div>
          </div>
          {/* Sonstige Anmerkungen */}
          <div className="flex flex-col gap-2">
            <Label className="font-medium text-base">Hast du sonstige Anmerkungen oder Wünsche zu deinem Schaft</Label>
            <Textarea placeholder="Hast du sonstige Anmerkungen oder Wünsche zu deinem Schaft" className="w-full" />
          </div>
          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <Button className="w-full md:w-1/3 px-8 py-5 rounded-full bg-black text-white hover:bg-gray-800 text-base font-semibold">Abschließen</Button>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
