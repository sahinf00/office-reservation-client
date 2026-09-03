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

export interface PageResponse<T> {
  content: T[];
  number: number;        // current page number (0-based)
  size: number;          // number of items per page
  totalPages: number;    // total number of pages
  totalElements: number; // total number of items across all pages
  first: boolean;
  last: boolean;
}

export interface ReservationFilterParams {
  page: number;
  size: number;
  date?: string;         // YYYY-MM-DD format
  floorId?: number | '';
  status?: string;       // 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | ''
}