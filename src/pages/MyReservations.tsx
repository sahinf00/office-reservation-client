import { useState, useEffect } from 'react';
import { ReservationService } from '../services/reservationService';
import type { ReservationResponse } from '../types/reservation';

export function MyReservations() {
    const [reservations, setReservations] = useState<ReservationResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [cancellingReservationId, setCancellingReservationId] = useState<number | null>(null);

    // on loadup, fetch reservations for the current user
    const fetchReservations = async () => {
            setLoading(true);
            setError(null);
            try {
                const reservationsData = await ReservationService.getReservationsForCurrentUser();
                setReservations(reservationsData);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch reservations');
            } finally {
                setLoading(false);
            }
    };
    
    useEffect(() => {
        fetchReservations();
    }, []);
    
    const handleCancellation = async (reservationId: number) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

        setCancellingReservationId(reservationId);
        try {
            await ReservationService.cancelReservation(reservationId);
            // update state locally instead of reloading the page
            setReservations((prev) =>
            prev.map((res) =>
                res.id === reservationId ? { ...res, status: 'CANCELLED' } : res
            ));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel reservation');
        } finally {
            setCancellingReservationId(null);
        }
    }

    if (loading) {
        return <div>Loading Reservations...</div>;
    }

    if (error) {
        return ( 
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ color: 'red' }}>{error}</p>
                    <button type="button" onClick={fetchReservations} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                        Retry
                    </button>
                </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #ccc' }}>
            <h2>My Reservations</h2>
            {reservations.length === 0 ? (<p>No reservations found.</p>) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Desk Number</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Date</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Status</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => {
                            return (
                                <tr key={reservation.id}>
                                    <td>{reservation.deskNumber}</td>
                                    <td>{reservation.reservationDate}</td>
                                    <td>
                                        {reservation.status === 'CANCELLED' && (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>Cancelled</span>
                                        )}
                                        {reservation.status === 'COMPLETED' && (
                                            <span style={{ color: 'gray', fontWeight: 'bold' }}>Completed</span>
                                        )}
                                        {reservation.status === 'CONFIRMED' && (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Confirmed</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        {reservation.status === 'CONFIRMED' ? (
                                        <button 
                                        type="button" 
                                        onClick={() => handleCancellation(reservation.id)} 
                                        disabled={cancellingReservationId === reservation.id}
                                        style={{
                                            backgroundColor: '#d32f2f',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '6px 12px',
                                            cursor: cancellingReservationId === reservation.id ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {cancellingReservationId === reservation.id ? 'Cancelling...' : 'Cancel'}
                                    </button>
                                    ) : (
                                        <span style={{ color: '#aaa', fontSize: '14px' }}>-</span>
                                    )}

                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}