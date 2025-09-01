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

export const useRevenueOverview = () => {
    const [data, setData] = useState<RevenueData | null>(null);
    const [processedChartData, setProcessedChartData] = useState<ProcessedChartData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Process chart data to group by 4-day periods
    const processChartData = (chartData: ChartDataPoint[]): ProcessedChartData[] => {
        if (!chartData || chartData.length === 0) return [];
        
        console.log('Original chart data:', chartData);
        
        const processed: ProcessedChartData[] = [];
        
        // Group data into 4-day periods
        for (let i = 0; i < chartData.length; i += 4) {
            const period = chartData.slice(i, i + 4);
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
        
        console.log('Processed chart data (4-day groups):', processed);
        return processed;
    };

    const fetchRevenueData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await RevenueOverview();
            
            if (response.success) {
                setData(response.data);
                const processed = processChartData(response.data.chartData);
                setProcessedChartData(processed);
            } else {
                setError('Failed to fetch revenue data');
            }
        } catch (err) {
            console.error('API Error:', err);
            setError(err instanceof Error ? err.message : 'API request failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenueData();
    }, []);

    return {
        data,
        processedChartData,
        loading,
        error,
        refetch: fetchRevenueData
    };
};
