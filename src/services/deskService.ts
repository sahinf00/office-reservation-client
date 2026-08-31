import api from "../services/api";
import type { FloorResponse } from "../types/desk";

export const DeskService = {
    getAllFloors: async (): Promise<FloorResponse[]> => {
        const response = await api.get<FloorResponse[]>('/floors');
        return response.data;
    } 
}