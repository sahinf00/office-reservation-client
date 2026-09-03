import api from "../services/api";
import type { DashboardSummaryResponse, FloorOccupancyResponse } from "../types/stats";

export const StatsService = {
    getDashboardSummaryStats: async (): Promise<DashboardSummaryResponse> => {
        const response = await api.get<DashboardSummaryResponse>('/stats/summary');
        return response.data;
    },
    
    getFloorOccupancyStats: async (date?: string): Promise<FloorOccupancyResponse[]> => {
        const response = await api.get<FloorOccupancyResponse[]>('/api/stats/occupancy-by-floor', {
            params: date ? { date } : {}
        })
        return response.data;
    }
};
