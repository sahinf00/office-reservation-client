import api from "../services/api";
import type { FloorResponse, DeskResponse, CreateFloorRequest, CreateDeskRequest, UpdateDeskRequest } from "../types/desk";

export const AdminService = {
    createFloor: async (floorData: CreateFloorRequest): Promise<FloorResponse> => {
        const response = await api.post<FloorResponse>("/floors", floorData);
        return response.data;
    },

    createDesk: async (deskData: CreateDeskRequest): Promise<DeskResponse> => {
        const response = await api.post<DeskResponse>("/desks", deskData);
        return response.data;
    },

    deleteDesk: async (deskId: number): Promise<void> => {
        await api.delete(`/desks/${deskId}`);
    },

    updateDesk: async (deskId: number, deskData: UpdateDeskRequest): Promise<DeskResponse> => {
        const response = await api.put<DeskResponse>(`/desks/${deskId}`, deskData);
        return response.data;
    }
};