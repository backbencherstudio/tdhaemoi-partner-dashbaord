import { useState, useEffect } from 'react';
import { RevenueOverview } from '@/apis/productsOrder';

interface ChartDataPoint {
    date: string;
    value: number;
}

interface RevenueStatistics {
    totalRevenue: number;
    averageDailyRevenue: number;
    maxRevenueDay: ChartDataPoint;
    minRevenueDay: ChartDataPoint;
    totalOrders: number;
}

interface RevenueData {
    chartData: ChartDataPoint[];
    statistics: RevenueStatistics;
}

interface ProcessedChartData {
    date: string;
    value: number;
}

export const useRevenueOverview = (year?: string, month?: string) => {
    const [data, setData] = useState<RevenueData | null>(null);
    const [processedChartData, setProcessedChartData] = useState<ProcessedChartData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRefetching, setIsRefetching] = useState(false);

    // Process chart data to group by 3-day periods
    const processChartData = (chartData: ChartDataPoint[]): ProcessedChartData[] => {
        if (!chartData || chartData.length === 0) return [];
        
    
        
        const processed: ProcessedChartData[] = [];
        
        // Group data into 3-day periods
        for (let i = 0; i < chartData.length; i += 3) {
            const period = chartData.slice(i, i + 3);
            const totalValue = period.reduce((sum, item) => sum + item.value, 0);
            
            if (period.length > 0) {
                const startDate = period[0].date;
                const endDate = period[period.length - 1].date;
                const dateRange = `${startDate} to ${endDate}`;
                
                processed.push({
                    date: dateRange,
                    value: totalValue
                });
            }
        }
        
    
        return processed;
    };

    const fetchRevenueData = async () => {
        try {
            if (!data) {
                setLoading(true); 
            } else {
                setIsRefetching(true); 
            }
            setError(null);
            const now = new Date();
            const y = year ?? String(now.getFullYear());
            const m = month ?? String(now.getMonth() + 1).padStart(2, '0');
            const response = await RevenueOverview(y, m);
            
            if (response.success) {
                setData(response.data);
                const processed = processChartData(response.data.chartData);
                setProcessedChartData(processed);
            } else {
                setError('Failed to fetch revenue data');
            }
        } catch (err) {
            // console.error('API Error:', err);
            setError(err instanceof Error ? err.message : 'API request failed');
        } finally {
            setLoading(false);
            setIsRefetching(false);
        }
    };

    useEffect(() => {
        fetchRevenueData();
        // re-fetch whenever year/month change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year, month]);

    return {
        data,
        processedChartData,
        loading,
        error,
        isRefetching,
        refetch: fetchRevenueData
    };
};
