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
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', padding: '20px', minHeight: '80vh' }}>
            {/* Floor management panel */}
            <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: '20px' }}>
                <h3>Floor Management</h3>

                <form onSubmit={handleCreateFloor} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4>Add New Floor</h4>
                    <input
                        type="number"
                        placeholder="Floor Number"
                        value={newFloorNumber}
                        onChange={(e) => setNewFloorNumber(Number(e.target.value))}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Floor Name"
                        value={newFloorName}
                        onChange={(e) => setNewFloorName(e.target.value)}
                        required
                    />
                    <button type="submit">Create Floor</button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {floors.map((floor) => (
                        <button type="button"
                            key={floor.id}
                            onClick={() => setSelectedFloorId(floor.id)}
                            style={{ padding: '12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedFloorId === floor.id ? '#1976d2' : '#f5f5f5',
                                    color: selectedFloorId === floor.id ? '#fff' : '#000', }}>
                            <strong>Floor {floor.floorNumber}:</strong> {floor.name} ({floor.desks.length} Desk(s))
                        </button>
                    ))}
                </div>
            </div>

            {/* Desk management panel */}
            <div style={{ flex: 2 }}>
                <h3>Desk Management</h3>

                {selectedFloor ? (
                    <>
                        <h3>{selectedFloor.name} (Floor {selectedFloor.floorNumber}) - Desks</h3>

                        <form onSubmit={handleCreateDesk} style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="Desk Number"
                                value={newDeskNumber}
                                onChange={(e) => setNewDeskNumber(e.target.value)}
                                required
                            />
                            <button type="submit">Add Desk</button>
                        </form>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                            {selectedFloor.desks.map((desk: DeskResponse) => (
                                <div 
                                    key={desk.id} 
                                    style={{ 
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    padding: '12px',
                                    textAlign: 'center',
                                    backgroundColor: desk.isActive ? '#fff' : '#f5f5f5',
                                    opacity: desk.isActive ? 1 : 0.6,
                                }}
                                >
                                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{desk.deskNumber}</p>

                                    <span
                                        style={{
                                        display: 'inline-block',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        marginBottom: '8px',
                                        backgroundColor: desk.isActive ? '#e8f5e9' : '#ffebee',
                                        color: desk.isActive ? '#2e7d32' : '#c62828',
                                        }}
                                    >
                                        {desk.isActive ? 'Active' : 'Inactive'}
                                    </span>

                                    {desk.isActive && (
                                        <button 
                                            type="button" 
                                            onClick={() => handleDeleteDesk(desk.id)}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                backgroundColor: '#d32f2f',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '4px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                            }}>
                                            Deactivate
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p>Please select a floor to manage its desks.</p>
                )}
            </div>
        </div>
    );
}

