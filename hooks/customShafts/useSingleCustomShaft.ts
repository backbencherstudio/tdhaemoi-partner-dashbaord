import { useState, useEffect } from 'react';
import { getSingleCustomShaft } from '@/apis/customShaftsApis';
import { CustomShaft } from './useCustomShafts';

export interface SingleCustomShaftResponse {
  success: boolean;
  message: string;
  data: CustomShaft;
}

export const useSingleCustomShaft = (id: string) => {
  const [data, setData] = useState<SingleCustomShaftResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getSingleCustomShaft(id);
        setData(response);
      } catch (err) {
        let errorMessage = 'An error occurred';
        
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as any;
          if (axiosError.response?.status === 404) {
            errorMessage = 'Produkt nicht gefunden. Möglicherweise wurde es gelöscht oder die ID ist ungültig.';
          } else if (axiosError.response?.status === 500) {
            errorMessage = 'Server-Fehler. Bitte versuchen Sie es später erneut.';
          } else if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
          } else {
            errorMessage = `Fehler ${axiosError.response?.status}: ${axiosError.message}`;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
};
