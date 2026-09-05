import { useEffect, useState } from "react";
import type { ReservationResponse } from "../types/reservation";
import type { FloorResponse } from "../types/desk";
import { AdminService } from "../services/adminService";
import { DeskService } from "../services/deskService";

export function AdminReservations() {
    const [reservations, setReservations] = useState<ReservationResponse[]>([]);
    const [floors, setFloors] = useState<FloorResponse[]>([]);

    // filtering
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedFloorId, setSelectedFloorId] = useState<number | ''>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    // paging
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pageSize] = useState<number>(10);

    // UI states
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const fetchFloors = async () => {
      try {
        const floorData = await DeskService.getAllFloors();
        setFloors(floorData);
      } catch (err) {
        console.error('Kat listesi alınamadı', err);
      }
    };
    fetchFloors();
  }, []);

    useEffect(() => {
    fetchReservations();
    }, [page, selectedDate, selectedFloorId, selectedStatus]);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const data = await AdminService.getAllReservations({
            page,
            size: pageSize,
            reservationDate: selectedDate || undefined,
            floorId: selectedFloorId !== '' ? Number(selectedFloorId) : undefined,
            status: selectedStatus || undefined,
            });

            setReservations(data.content);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            setError( err.response?.data?.message || 'Rezervasyonlar yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const statusColorMap: Record<string, string> = {
        'CONFIRMED': '#2e7d32',
        'CANCELLED': '#c62828',
        'COMPLETED': '#1565c0',
    };

    const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFloorId(e.target.value ? Number(e.target.value) : '');
        setPage(0);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value);
        setPage(0);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        setPage(0);
    };

    if (loading) {
        return <div>Loading ...</div>;
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
        <div style={{ padding: '20px' }}>
            <h2>All Reservations</h2>
            
            {/* Filter panel */}
            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '20px',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                padding: '16px',
                borderRadius: '8px',
                }}
            >
                {/* Date Filter */}
                <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Date</label>
                    <input
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                {/* Floor Filter */}
                <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Floor</label>
                    <select
                        value={selectedFloorId}
                        onChange={handleFloorChange}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}
                    >
                        <option value="">All Floors</option>
                        {floors.map((floor) => (
                        <option key={floor.id} value={floor.id}>
                            Floor {floor.floorNumber} - {floor.name}
                        </option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Status</label>
                    <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}
                    >
                        <option value="">All Statuses</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>

                {/* Clear Filters Button */}
                {(selectedDate || selectedFloorId !== '' || selectedStatus) && (
                <button
                    type="button"
                    onClick={() => {
                    setSelectedDate('');
                    setSelectedFloorId('');
                    setSelectedStatus('');
                    setPage(0);
                    }}
                    style={{
                    marginTop: '16px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    }}
                >
                    Clear Filters
                </button>
                )}
            </div>

            {/* Reservations Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: '#fff' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>User</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Date</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Floor</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Desk No.</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length > 0 ? (
                reservations.map((res) => (
                  <tr key={res.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>#{res.id}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {res.userFullName || 'Bilinmiyor'}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{res.reservationDate}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      Floor {res.floorNumber ?? '-'}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{res.deskNumber}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: res.status === 'CONFIRMED' ? '#e8f5e9' : '#ffebee',
                          color: statusColorMap[res.status] || '#757575',
                        }}
                      >
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                    Cannot find any reservations with the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <button
                type="button"
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
              style={{
                padding: '8px 16px',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
                opacity: page === 0 ? 0.5 : 1,
              }}
            >
              Previous Page
            </button>

            <span>
              Page <strong>{page + 1}</strong> / <strong>{totalPages || 1}</strong>
            </span>

            <button
                type="button"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              style={{
                padding: '8px 16px',
                cursor: page + 1 >= totalPages ? 'not-allowed' : 'pointer',
                opacity: page + 1 >= totalPages ? 0.5 : 1,
              }}
            >
              Next Page
            </button>
          </div>
        </div>
    );
}
