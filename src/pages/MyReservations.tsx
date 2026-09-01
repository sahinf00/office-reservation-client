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
}