import api from "../services/api";
import type { FloorResponse, DeskResponse, CreateFloorRequest, CreateDeskRequest, UpdateDeskRequest } from "../types/desk";
import type { PageResponse, ReservationFilterParams, ReservationResponse } from "../types/reservation";

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
    },

    getAllReservations: async (params: ReservationFilterParams): Promise<PageResponse<ReservationResponse>> => {
    // params object is created to include only the defined parameters, avoiding sending undefined values to the API
    const response = await api.get<PageResponse<ReservationResponse>>("/reservations", {
        params: {
            ...(params.reservationDate && { reservationDate: params.reservationDate }),
            ...(params.floorId && { floorId: params.floorId }),
            ...(params.status && { status: params.status }),
            size: params.size,
            page: params.page,
        },
    });
    return response.data;
    }
};