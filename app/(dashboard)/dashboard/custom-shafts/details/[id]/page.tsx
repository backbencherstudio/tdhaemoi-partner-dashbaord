'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {  TooltipProvider,  } from '@/components/ui/tooltip';
import Image from 'next/image';
import { User, UploadCloud } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useParams } from 'next/navigation';
import { useSingleCustomShaft } from '@/hooks/customShafts/useSingleCustomShaft';
import Loading from '@/components/Shared/Loading';
import { Dialog, DialogContent,  DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import colorPlate from '@/public/images/color.png';
import toast from 'react-hot-toast';
import Invoice from '@/app/(dashboard)/dashboard/_components/Payments/Invoice';


export default function DetailsPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nahtfarbeOption, setNahtfarbeOption] = useState('default');
  const [customNahtfarbe, setCustomNahtfarbe] = useState('');
  const [ledertyp, setLedertyp] = useState('');
  const [innenfutter, setInnenfutter] = useState('');
  const [schafthohe, setSchafthohe] = useState('');
  const [linkerLeistenFile, setLinkerLeistenFile] = useState<File | null>(null);
  const [linkerLeistenFileName, setLinkerLeistenFileName] = useState('');
  const linkerLeistenInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userBalance, setUserBalance] = useState(200.00);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const invoiceComponentRef = useRef<any>(null);

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

  const handleLinkerLeistenFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLinkerLeistenFile(file);
      setLinkerLeistenFileName(file.name);
    }
  };

  const handleOrderConfirmation = () => {
   

    if (userBalance < orderPrice) {
      toast.error("Nicht genügend Balance. Bitte laden Sie Ihr Konto auf, um die Bestellung abzuschließen.");
      return;
    }

    setUserBalance(prev => prev - orderPrice);

    setShowSuccessMessage(true);
    setShowConfirmationModal(false);

  };

  const params = useParams();
  const shaftId = params.id as string;
  
  // Fetch single custom shaft data from API
  const { data: apiData, loading, error } = useSingleCustomShaft(shaftId);
  const shaft = apiData?.data;

  useEffect(() => {

    if (shaft) {
      // console.log('Image path:', shaft.image);
    }
  }, [shaftId, shaft]);

  // Loading state
  if (loading) {
    return (
      <div className="px-2 md:px-6 py-8 w-full flex justify-center items-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="px-2 md:px-6 py-8 w-full flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-lg font-medium mb-2">Fehler beim Laden der Daten</div>
        <div className="text-gray-400 text-sm text-center">
          {error}
        </div>
      </div>
    );
  }

  // Product not found
  if (!shaft) {
    return (
      <div className="px-2 md:px-6 py-8 w-full flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-gray-500 text-lg font-medium mb-2">Produkt nicht gefunden</div>
        <div className="text-gray-400 text-sm text-center">
          Das angeforderte Produkt konnte nicht gefunden werden.
        </div>
      </div>
    );
  }

  const orderPrice = 150.99;
  const hasEnoughBalance = userBalance >= orderPrice;

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
        <div className="relative">
          <Button 
            variant="outline" 
            className="justify-start cursor-pointer w-full h-12 text-base font-normal border border-black gap-3 hover:bg-gray-100"
            onClick={() => linkerLeistenInputRef.current?.click()}
          >
            <UploadCloud className="w-5 h-5" />
            {linkerLeistenFileName ? linkerLeistenFileName : "Upload 3D-Datei Linker Leisten"}
          </Button>
          <input
            type="file"
            accept=".stl,.obj,.ply,.3ds,.dae,.fbx,.x3d"
            ref={linkerLeistenInputRef}
            onChange={handleLinkerLeistenFileChange}
            className="hidden"
          />
          {linkerLeistenFileName && (
            <div className="mt-2 text-sm text-green-600 font-medium">
              ✓ Datei hochgeladen: {linkerLeistenFileName}
            </div>
          )}
        </div>
        {/* <Button variant="outline" className="justify-start w-full h-12 text-base font-normal border border-black gap-3">
          <UploadCloud className="w-5 h-5" />
          Upload 3D-Datei Rechter Leisten
        </Button> */}
      </div>

      {/* Bottom: Image and Info */}
      <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center my-10">
          <div
            className="cursor-pointer w-full h-full"
            onClick={() => fileInputRef.current?.click()}
            title="Bild ändern"
          >
            <div className='w-full h-full'>
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
            <span className="text-3xl font-extrabold tracking-tight">{shaft.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Configurator */}
      <TooltipProvider>
        <div className="flex flex-col gap-6">
          {/* Ledertyp */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label className="font-medium  text-base md:w-1/3">Ledertyp:</Label>
            <Select value={ledertyp} onValueChange={setLedertyp}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Ledertyp wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className='cursor-pointer' value="kalbleder-vitello">Kalbleder Vitello</SelectItem>
                <SelectItem className='cursor-pointer' value="nappa">Nappa (weiches Glattleder)</SelectItem>
                <SelectItem className='cursor-pointer' value="nubukleder">Nubukleder</SelectItem>
                <SelectItem className='cursor-pointer' value="softvelourleder">Softvelourleder</SelectItem>
                <SelectItem className='cursor-pointer' value="hirschleder-gemustert">Hirschleder Gemustert</SelectItem>
                <SelectItem className='cursor-pointer' value="performance-textil">Performance Textil</SelectItem>
                <SelectItem className='cursor-pointer' value="fashion-mesh-gepolstert">Fashion Mesh Gepolstert</SelectItem>
                <SelectItem className='cursor-pointer' value="soft-touch-material-gepraegt">Soft Touch Material - Geprägt</SelectItem>
                <SelectItem className='cursor-pointer' value="textil-python-effekt">Textil Python-Effekt</SelectItem>
                <SelectItem className='cursor-pointer' value="glitter">Glitter</SelectItem>
                <SelectItem className='cursor-pointer' value="luxury-glitter-fabric">Luxury Glitter Fabric</SelectItem>
                <SelectItem className='cursor-pointer' value="metallic-finish">Metallic Finish</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Lederfarbe */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label className="font-medium text-base md:w-1/3">Lederfarbe:</Label>
            <Input
              type="text"
              placeholder="Lederfarbe wählen..."
              className="w-full md:w-1/2"
            />
          </div>

          {/* Innenfutter */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Label className="font-medium text-base md:w-1/3">Innenfutter:</Label>
            <Select value={innenfutter} onValueChange={setInnenfutter}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Innenfutter wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className='cursor-pointer' value="ziegenleder-hellbraun">Ziegenleder hellbraun</SelectItem>
                <SelectItem className='cursor-pointer' value="kalbsleder-beige">Kalbsleder Beige</SelectItem>
                <SelectItem className='cursor-pointer' value="sport-mesh-nero-schwarz">Sport Mesh Nero/Schwarz</SelectItem>
                <SelectItem className='cursor-pointer' value="sport-mesh-grau-grigio">Sport Mesh Grau/Grigio</SelectItem>
                <SelectItem className='cursor-pointer' value="sport-mesh-weiss-bianco">Sport Mesh Weiß/Bianco</SelectItem>
                <SelectItem className='cursor-pointer' value="comfort-line-nero-schwarz">Comfort Line Nero/Schwarz</SelectItem>
                <SelectItem className='cursor-pointer' value="comfort-line-blau-blu">Comfort Line Blau/Blu</SelectItem>
                <SelectItem className='cursor-pointer' value="comfort-line-braun-marrone">Comfort Line Braun/Marrone</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Nahtfarbe */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex flex-col md:w-1/3">
              <Label className="font-medium text-base">Nahtfarbe:</Label>
              <Dialog>
                {/* <DialogTrigger asChild>
                  <a href="#" className="text-sm underline text-blue-700 hover:text-blue-900 w-fit mt-1">Hier können Sie den Katalog unserer Nahtfarben öffnen</a>
                </DialogTrigger> */}
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
            <Input
              type="text"
              placeholder="Schafthöhe eingeben (z.B. 7cm, 9cm)..."
              className="w-full md:w-1/2"
              value={schafthohe}
              onChange={e => setSchafthohe(e.target.value)}
            />
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
            <Button
              onClick={() => setShowConfirmationModal(true)}
              className="w-full cursor-pointer  md:w-1/3 px-8 py-5 rounded-full bg-black text-white hover:bg-gray-800 text-base font-semibold"
            >
              Abschließen
            </Button>
          </div>
        </div>
      </TooltipProvider>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-green-600 mb-2">Bestellung erfolgreich abgeschlossen</h3>
            <p className="text-gray-700 mb-4">
              Ihre Bestellung für {orderPrice.toFixed(2)}€ wurde erfolgreich abgeschlossen.
            </p>
            <Button
              onClick={async () => {
                setShowSuccessMessage(false);
                if (invoiceComponentRef.current && invoiceComponentRef.current.downloadInvoice) {
                  await invoiceComponentRef.current.downloadInvoice();
                }
              }}
              className="w-full cursor-pointer bg-green-600 hover:bg-green-700"
            >
              OK
            </Button>
          </div>
        </div>
      )}
      {/* Hidden Invoice component for PDF generation */}
      <Invoice ref={invoiceComponentRef} customerName="" model="" />

      {/* Global style override for html2canvas compatibility */}
      <style jsx global>{`
        .invoice-pdf *, .invoice-pdf {
          background: none !important;
          background-color: rgb(255,255,255) !important;
          color: rgb(0,0,0) !important;
        }
        .invoice-pdf .text-white, .invoice-pdf [style*="color: white"] {
          color: rgb(255,255,255) !important;
        }
        .invoice-pdf [style*="background: rgb(122,194,154)"] {
          background: rgb(122,194,154) !important;
        }
      `}</style>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmationModal} onOpenChange={setShowConfirmationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-xl font-semibold">
            Bestellung abschließen
          </DialogTitle>
          <div className="space-y-4">
            <p className="text-base">
              Möchtest du die Bestellung dieses Maßschaftes für {orderPrice.toFixed(2)}€ abschließen?
            </p>
            <p className="text-sm text-gray-600">
              Das Geld wird vorerst von deinem FeetF1rst Balance abgezogen.
            </p>
            {!hasEnoughBalance && (
              <p className="text-sm text-red-600 font-medium">
                Nicht genügend Balance. Bitte aufladen.
              </p>
            )}
            <p className="text-xs text-gray-500">
              Nach dem Abschließen kann die Bestellung nicht mehr bearbeitet werden.
            </p>
          </div>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmationModal(false)}
              className="flex-1 cursor-pointer"
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleOrderConfirmation}
              disabled={!hasEnoughBalance}
              className={`flex-1 cursor-pointer ${hasEnoughBalance ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Ja, abschließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
