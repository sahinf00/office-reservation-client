export type ReservationStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface CreateReservationRequest {
    deskId: number;
    reservationDate: string; // YYYY-MM-DD format
}

export interface ReservationResponse {
    id: number;
    deskId: number;
    deskNumber: string;
    floorNumber: number;
    userId: number;
    userFullName: string;
    reservationDate: string; // YYYY-MM-DD format
    status: ReservationStatus;
}