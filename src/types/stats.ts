export interface DashboardSummaryResponse {
  totalActiveDesks: number;
  totalReservationCountForToday: number;
  occupancyRate: number;
}

export interface FloorOccupancyResponse {
  floorId: number;
  floorNumber: number;
  floorName: string;
  totalDesks: number;
  occupiedDesks: number;
  occupancyRate: number;
}