"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePriceManagement } from "@/hooks/priceManagement/usePriceManagement";
import { Trash2, Edit } from "lucide-react";

export default function PreisverwaltungPage() {
  const { prices, loading, createNewPrice, updateExistingPrice, deleteExistingPrice, fetchPrices } = usePriceManagement();
  const [fussanalyse, setFussanalyse] = useState("");
  const [einlagenversorgung, setEinlagenversorgung] = useState("");
  const [editingPrice, setEditingPrice] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [priceToDelete, setPriceToDelete] = useState<any>(null);

  // Load existing prices on component mount
  useEffect(() => {
    fetchPrices();
  }, []);

  const handleSave = async () => {
    if (!fussanalyse && !einlagenversorgung) {
      alert("Bitte geben Sie mindestens einen Preis ein.");
      return;
    }

    try {
      const priceData = {
        fußanalyse: fussanalyse ? parseFloat(fussanalyse) : 0,
        einlagenversorgung: einlagenversorgung ? parseFloat(einlagenversorgung) : 0
      };

      if (editingPrice) {
        // Update existing price
        await updateExistingPrice(editingPrice.id, priceData);
        setEditingPrice(null);
      } else {
        // Create new price
        await createNewPrice(priceData);
      }
      
      // Clear form after successful save
      setFussanalyse("");
      setEinlagenversorgung("");
      
      // Refresh the price list
      fetchPrices();
    } catch (error) {
      console.error("Error saving prices:", error);
      alert("Fehler beim Speichern der Preise.");
    }
  };

  const handleEdit = (price: any) => {
    setEditingPrice(price);
    setFussanalyse(price.fußanalyse ? price.fußanalyse.toString() : "");
    setEinlagenversorgung(price.einlagenversorgung ? price.einlagenversorgung.toString() : "");
  };

  const handleDeleteClick = (price: any) => {
    setPriceToDelete(price);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!priceToDelete?.id) return;
    
    try {
      await deleteExistingPrice(priceToDelete.id);
      fetchPrices(); // Refresh the list
      setDeleteModalOpen(false);
      setPriceToDelete(null);
    } catch (error) {
      console.error("Error deleting price:", error);
      alert("Fehler beim Löschen des Preises.");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPriceToDelete(null);
  };

  const handleCancel = () => {
    setEditingPrice(null);
    setFussanalyse("");
    setEinlagenversorgung("");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 font-sans">
      <h1 className="text-4xl font-bold mb-2">Preisverwaltung</h1>
      <p className="mb-8">
        Legen Sie Standardpreise an, um sie später bei Aufträgen schnell auszuwählen.
      </p>

      <div className="mb-6">
        <label className="font-semibold block mb-2">Fußanalyse</label>
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="z.B. 25 €"
          value={fussanalyse}
          onChange={e => setFussanalyse(e.target.value)}
          className="border border-gray-600"
        />
      </div>

      <div className="mb-6">
        <label className="font-semibold block mb-2">Einlagenversorgung</label>
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="z.B. 170 €"
          value={einlagenversorgung}
          onChange={e => setEinlagenversorgung(e.target.value)}
          className="border border-gray-600"
        />
      </div>

      <div className="flex gap-4 mt-8">
        <Button 
          type="button" 
          className="flex-1 cursor-pointer"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Speichern..." : editingPrice ? "Aktualisieren" : "Speichern"}
        </Button>
        {editingPrice && (
          <Button 
            type="button" 
            variant="outline"
            onClick={handleCancel}
            className="px-6 cursor-pointer"
          >
            Abbrechen
          </Button>
        )}
      </div>

      {/* Simple Price Table */}
      {prices && prices.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Gespeicherte Preise</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Fußanalyse (€)</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Einlagenversorgung (€)</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Erstellt am</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {prices && prices.length > 0 ? prices.map((price, index) => (
                  <tr key={price?.id || `price-${index}`} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {price?.fußanalyse ? price.fußanalyse.toFixed(2) : "0.00"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {price?.einlagenversorgung ? price.einlagenversorgung.toFixed(2) : "0.00"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {price?.createdAt ? new Date(price.createdAt).toLocaleDateString('de-DE') : "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(price)}
                          className="p-1 cursor-pointer text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          title="Bearbeiten"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(price)}
                          className="p-1 cursor-pointer text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Löschen"
                          disabled={!price?.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      Keine Preise gefunden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preis löschen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie diesen Preis löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          {priceToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Fußanalyse:</span>
                    <p className="text-lg">{priceToDelete.fußanalyse ? priceToDelete.fußanalyse.toFixed(2) : "0.00"} €</p>
                  </div>
                  <div>
                    <span className="font-medium">Einlagenversorgung:</span>
                    <p className="text-lg">{priceToDelete.einlagenversorgung ? priceToDelete.einlagenversorgung.toFixed(2) : "0.00"} €</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button className="cursor-pointer" variant="outline" onClick={handleDeleteCancel}>
              Abbrechen
            </Button>
            <Button 
              className="cursor-pointer"
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={loading}
            >
              {loading ? "Löschen..." : "Löschen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}