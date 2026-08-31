import { useState, useEffect } from "react";
import { DeskService } from "../services/deskService";
import { ReservationService } from "../services/reservationService";
import type { FloorResponse, DeskResponse } from "../types/desk";

export function DeskSelection() {
    const [floors, setFloors] = useState<FloorResponse[]>([]);
    const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
    const [reservedDeskIds, setReservedDeskIds] = useState<number[]>([]);
    const [selectedDeskId, setSelectedDeskId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // on loadup, fetch all floors and set the first floor as selected by default
    useEffect(() => {
        const fetchFloors = async () => {
            try {
                const floorsData = await DeskService.getAllFloors();
                setFloors(floorsData);
                if (floorsData.length > 0) {
                    setSelectedFloorId(floorsData[0].id);
                }
            } catch (err) {
                setError( err.response?.data?.message || 'Failed to fetch floors');
            } finally {
                setLoading(false);
            }
        };

        fetchFloors();
    }, []);

    // whenever the selected date changes, fetch reserved desk ids for that date
    useEffect(() => {
        const fetchReservedDeskIds = async () => {
            try {
                const reservedIds = await ReservationService.getReservedDeskIdsForDate(selectedDate);
                setReservedDeskIds(reservedIds);
                setSelectedDeskId(null); // reset selected desk when date changes
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch reserved desks');
            }
        };

        if (selectedDate) {
            fetchReservedDeskIds();
        }
    }, [selectedDate]);

    const selectedFloor = floors.find((floor) => floor.id === selectedFloorId);

    const handleReserve = async () => {
        if (selectedDeskId && selectedDate) {
            try {
                await ReservationService.createReservation({ deskId: selectedDeskId, reservationDate: selectedDate });
                alert('Reservation successful!');
                setReservedDeskIds((prev) => [...prev, selectedDeskId]);
                setSelectedDeskId(null); // reset selected desk after reservation
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to create reservation');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div style= {{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
            <h1>Desk Selection</h1>

            {/* Date Selection */}
            <div style={{ marginBottom: '20px' }}>
                <label style ={{ marginRight: '10px', fontWeight: 'bold' }}>Select Date:</label>
                <input
                    type='date'
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]} // prevent selecting past dates
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            {/* Floor Selection */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {floors.map((floor) => (
                    <button
                        key={floor.id}
                        type={"button"}
                        onClick={() => setSelectedFloorId(floor.id)}
                        style={{
                            padding: '10px 20px',
                            fontWeight: selectedFloorId === floor.id ? 'bold' : 'normal',
                            borderBottom: selectedFloorId === floor.id ? '3px solid #2196f3' : '1px solid #ccc',
                        }}
                    >
                        {floor.name} (Floor {floor.floorNumber})
                    </button>
                ))}
            </div>

            {/* Desk Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', 
                gap: '12px', 
                marginBottom: '24px' }}>

                {selectedFloor?.desks.map((desk: DeskResponse) => {
                    const isReserved = reservedDeskIds.includes(desk.id);
                    const isSelected = selectedDeskId === desk.id;
                    const isDisabled = isReserved || !desk.isActive;

                    let bgColor = '#4caf50'; // Boş (Green)
                    if (!desk.isActive) bgColor = '#9e9e9e'; // Inactive (Gray)
                    else if (isReserved) bgColor = '#f44336'; // Reserved (Red)
                    else if (isSelected) bgColor = '#036107'; // Selected (Darker Green)

                    return (
                        <button
                            key={desk.id}
                            type={"button"}
                            disabled={isDisabled}
                            onClick={() => !isDisabled && setSelectedDeskId(desk.id)}
                            style={{
                                backgroundColor: bgColor,
                                color: '#fff',
                                padding: '16px',
                                borderRadius: '6px',
                                border: isSelected ? '2px solid #000' : 'none',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                            }}
                        >
                            <div>{desk.deskNumber}</div>
                            {isReserved && <small>Reserved</small>}
                            {!desk.isActive && <small>Inactive</small>}
                        </button>
                    );
                })}
            </div>

            {/* Confirm Reservation Button */}
            <button
                type={"button"}
                onClick={handleReserve}
                disabled={!selectedDeskId}
                style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    cursor: selectedDeskId ? 'pointer' : 'not-allowed',
                }}
            >
                Confirm Reservation
            </button>
        </div>
    );
}