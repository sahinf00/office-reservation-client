import { useEffect, useState } from "react";
import { AdminService } from "../services/adminService";
import { DeskService } from "../services/deskService";
import type { FloorResponse, DeskResponse } from "../types/desk";


export function AdminFloors() {
    const [floors, setFloors] = useState<FloorResponse[]>([]);
    const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
    
    // form states
    const [newFloorNumber, setNewFloorNumber] = useState<number | null>(null);
    const [newFloorName, setNewFloorName] = useState<string>('');
    const [newDeskNumber, setNewDeskNumber] = useState<string>('');
    
    // UI states
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // on loadup, fetch all floors and set the first floor as selected by default
    useEffect(() => {
        const fetchFloors = async () => {
            setLoading(true);
            try {
                const floors = await DeskService.getAllFloors();
                setFloors(floors);
                if (floors.length > 0) {
                    setSelectedFloorId(floors[0].id);
                }
            } catch (err) {
                setError( err.response?.data?.message || 'Failed to fetch floors');
            } finally {
                setLoading(false);
            }
        };

        fetchFloors();
    }, []);

    const handleCreateFloor = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!newFloorNumber || !newFloorName) return alert('Please provide both floor number and name');

        try {
            const newFloor = await AdminService.createFloor({ floorNumber: newFloorNumber, name: newFloorName });
            setFloors(prev => [...prev, newFloor]);
            setSelectedFloorId(newFloor.id);
            setNewFloorNumber(null);
            setNewFloorName('');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create floor');
        }
    };

    const handleCreateDesk = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!newDeskNumber || !selectedFloorId) return alert('Please provide a desk number and select a floor');

        try {
            const newDesk = await AdminService.createDesk({deskNumber: newDeskNumber, floorId: selectedFloorId});
            // Update the selected floor's desks
            setFloors(prev => prev.map((floor) => 
                (floor.id === selectedFloorId) 
                    ? { ...floor, desks: [...floor.desks, newDesk] }
                    : floor
            ));
            setNewDeskNumber('');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create desk');
        }
    };

    const handleDeleteDesk = async (deskId: number) => {
        if (!window.confirm('Are you sure you want to delete this desk?')) return;

        try {
            await AdminService.deleteDesk(deskId);
            // Update the selected floor's desks
            setFloors((prev) =>
                prev.map((floor) => ({
                ...floor,
                desks: floor.desks.map((desk) =>
                    desk.id === deskId ? { ...desk, isActive: false } : desk
                ),
                }))
            );
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete desk');
        }
    };

    const selectedFloor = floors.find((f) => f.id === selectedFloorId);

    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <h1>Admin Floor Management</h1>
            {/* Render the floors and their desks here */}
        </div>
    );
}

