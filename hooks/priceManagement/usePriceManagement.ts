import { useState, useEffect } from 'react';
import { 
  createPrice, 
  getAllPrices, 
  getPriceById, 
  updatePrice, 
  deletePrice 
} from '@/apis/PriceManagementApis';

export interface Price {
  id: string;
  fußanalyse: number;
  einlagenversorgung: number;
  partnerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePriceData {
  fußanalyse: number;
  einlagenversorgung: number;
}

export interface UpdatePriceData {
  fußanalyse?: number;
  einlagenversorgung?: number;
}

export interface PriceListResponse {
  success: boolean;
  message: string;
  data: Price[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const usePriceManagement = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Get all prices with pagination
  const fetchPrices = async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response: PriceListResponse = await getAllPrices(page, limit);
      setPrices(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  // Create new price
  const createNewPrice = async (priceData: CreatePriceData) => {
    setLoading(true);
    setError(null);
    try {
      const newPrice = await createPrice(priceData);
      setPrices(prev => [newPrice, ...prev]);
      return newPrice;
    } catch (err: any) {
      setError(err.message || 'Failed to create price');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing price
  const updateExistingPrice = async (id: string, priceData: UpdatePriceData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPrice = await updatePrice(id, priceData);
      setPrices(prev => 
        prev.map(price => price.id === id ? updatedPrice : price)
      );
      return updatedPrice;
    } catch (err: any) {
      setError(err.message || 'Failed to update price');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete price
  const deleteExistingPrice = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deletePrice(id);
      setPrices(prev => prev.filter(price => price.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete price');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single price by ID
  const fetchPriceById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const price = await getPriceById(id);
      return price;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch price');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load prices on mount
  useEffect(() => {
    fetchPrices();
  }, []);

  return {
    prices,
    loading,
    error,
    pagination,
    fetchPrices,
    createNewPrice,
    updateExistingPrice,
    deleteExistingPrice,
    fetchPriceById
  };
};
