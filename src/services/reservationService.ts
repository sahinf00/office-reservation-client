import api from "../services/api";
import type { CreateReservationRequest, ReservationResponse } from "../types/reservation";

export const ReservationService = {
    
    createReservation: async (data: CreateReservationRequest): Promise<ReservationResponse> => {
        const response = await api.post<ReservationResponse>('/reservations', data);
        return response.data;
    },

    getReservedDeskIdsForDate: async (date: string): Promise<number[]> => {
        const response = await api.get<number[]>(`/reservations/reserved-desks`, { params: { date } });
        return response.data;
    }
}