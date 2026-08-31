export type DeskStatus = 'AVAILABLE' | 'RESERVED' | 'INACTIVE';

export interface DeskResponse {
    id: number;
    deskNumber: string;
    isActive: boolean;
    floorId: number;
}

export interface FloorResponse {
    id: number;
    floorNumber: number;
    name: string;
    desks: DeskResponse[];
}

export interface DeskUI extends DeskResponse {
    status: DeskStatus;
}
