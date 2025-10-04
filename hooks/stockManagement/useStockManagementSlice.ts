import { useState } from 'react';
import { createProduct, getAllStorages } from '@/apis/productsManagementApis';

interface ProductFormData {
    Produktname: string;
    Hersteller: string;
    Produktkürzel: string;
    Lagerort: string;
    minStockLevel: number;
    purchase_price: number;
    selling_price: number;
    sizeQuantities: { [key: string]: number };
}

interface CreateProductPayload {
    produktname: string;
    hersteller: string;
    artikelnummer: string;
    lagerort: string;
    mindestbestand: number;
    historie: string;
    groessenMengen: { [key: string]: number };
    purchase_price: number;
    selling_price: number;
    Status: string;
}

interface ApiProduct {
    id: string;
    produktname: string;
    hersteller: string;
    artikelnummer: string;
    lagerort: string;
    mindestbestand: number;
    groessenMengen: { [key: string]: number };
    purchase_price: number;
    selling_price: number;
    Status: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

interface PaginationInfo {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: ApiProduct[];
    pagination: PaginationInfo;
}

export const useStockManagementSlice = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<ApiProduct[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const determineStockStatus = (sizeQuantities: { [key: string]: number }, minStockLevel: number): string => {
        const totalStock = Object.values(sizeQuantities).reduce((sum, qty) => sum + qty, 0);
        const lowStockSizes = Object.values(sizeQuantities).some(qty => qty <= minStockLevel && qty > 0);
        
        if (totalStock === 0) return "Out of Stock";
        if (totalStock <= minStockLevel) return "Critical Low Stock";
        if (lowStockSizes) return "Low Stock Warning";
        return "In Stock";
    };

    const formatProductData = (formData: ProductFormData): CreateProductPayload => {
        const stockStatus = determineStockStatus(formData.sizeQuantities, formData.minStockLevel);
        
        return {
            produktname: formData.Produktname,
            hersteller: formData.Hersteller,
            artikelnummer: formData.Produktkürzel,
            lagerort: formData.Lagerort,
            mindestbestand: formData.minStockLevel,
            historie: `Product created on ${new Date().toISOString().split('T')[0]}`,
            groessenMengen: formData.sizeQuantities,
            purchase_price: formData.purchase_price,
            selling_price: formData.selling_price,
            Status: stockStatus
        };
    };

    const createNewProduct = async (productData: ProductFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const formattedData = formatProductData(productData);
            // console.log('Creating product with data:', formattedData);
            
            const response = await createProduct(formattedData);
            // console.log('Product created successfully:', response);
            
            // Return the complete response including success status and data
            return {
                success: response.success,
                message: response.message || 'Product created successfully',
                data: response.data
            };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to create product';
            setError(errorMessage);
            // console.error('Error creating product:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const getAllProducts = async () => {
        setIsLoadingProducts(true);
        setError(null);

        try {
            const response: ApiResponse = await getAllStorages();
            console.log('Fetched products:', response);
            
            if (response.success && response.data) {
                setProducts(response.data);
                setPagination(response.pagination);
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to fetch products');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch products';
            setError(errorMessage);
            console.error('Error fetching products:', err);
            throw err;
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const refreshProducts = async () => {
        return await getAllProducts();
    };

    return {
        createNewProduct,
        getAllProducts,
        refreshProducts,
        products,
        pagination,
        isLoading,
        isLoadingProducts,
        error,
        clearError: () => setError(null)
    };
};
