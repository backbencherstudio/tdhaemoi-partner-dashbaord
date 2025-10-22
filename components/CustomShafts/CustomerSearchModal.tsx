'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, Mail, Phone, MapPin } from 'lucide-react';
import { useCustomerSearch } from '@/hooks/customer/useCustomerSearch';
import Loading from '@/components/Shared/Loading';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string;
  createdAt: string;
}

interface CustomerSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
}

export default function CustomerSearchModal({
  isOpen,
  onClose,
  onSelectCustomer,
  selectedCustomer,
}: CustomerSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { customers, loading, error, searchCustomers, clearCustomers } = useCustomerSearch();

  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        searchCustomers(searchTerm);
      }, 500); 

      return () => clearTimeout(timeoutId);
    } else {
      clearCustomers();
    }
  }, [searchTerm]);

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Kunde auswählen</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Kunde suchen (Name, Email, Telefon)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Customer Display */}
          {selectedCustomer && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-700 font-medium">
                  <User className="w-4 h-4" />
                  Ausgewählter Kunde: {selectedCustomer.name}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectCustomer(null)}
                  className="text-red-600 border-red-300 hover:bg-red-50 cursor-pointer"
                >
                  Entfernen
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loading />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-red-500 text-center py-4">
              {error}
            </div>
          )}

          {/* Customer List */}
          <div className="flex-1 overflow-y-auto">
            {customers.length > 0 ? (
              <div className="space-y-2">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedCustomer?.id === customer.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {customer.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {customer.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {customer.location}
                          </div>
                        </div>
                      </div>
                      {selectedCustomer?.id === customer.id && (
                        <div className="text-green-600 font-medium text-sm">
                          ✓ Ausgewählt
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm.trim() && !loading ? (
              <div className="text-center py-8 text-gray-500">
                Keine Kunden gefunden für "{searchTerm}"
              </div>
            ) : !searchTerm.trim() ? (
              <div className="text-center py-8 text-gray-500">
                Geben Sie einen Suchbegriff ein, um Kunden zu finden
              </div>
            ) : null}
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="cursor-pointer">
              Schließen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
