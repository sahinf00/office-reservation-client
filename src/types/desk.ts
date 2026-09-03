export type DeskStatus = 'AVAILABLE' | 'RESERVED' | 'INACTIVE';

export interface DeskResponse {
    id: number;
    deskNumber: string;
    isActive: boolean;
    floorId: number;
}

export interface DeskUI extends DeskResponse {
    status: DeskStatus;
}

export interface FloorResponse {
    id: number;
    floorNumber: number;
    name: string;
    desks: DeskResponse[];
}

export interface CreateFloorRequest {
    floorNumber: number;
    name: string;
}

export interface CreateDeskRequest {
    deskNumber: string;
    floorId: number;
}

export interface UpdateDeskRequest {
    deskNumber: string;
}
