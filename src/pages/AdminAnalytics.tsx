import { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, PieChart, Pie, Legend, Sector
} from 'recharts';
import { StatsService } from '../services/statsService';
import type { DashboardSummaryResponse, FloorOccupancyResponse } from '../types/stats';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function AdminAnalytics() {
  
    const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
    );
    const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
    const [floorData, setFloorData] = useState<FloorOccupancyResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
        setLoading(true);
            try {
                const [summaryRes, floorRes] = await Promise.all([
                StatsService.getDashboardSummaryStats(),
                StatsService.getFloorOccupancyStats(selectedDate)
                ]);
                setSummary(summaryRes);
                setFloorData(floorRes);
            } catch (err) {
                    setError( err.response?.data?.message ||'Failed to fetch analytics data');
            } finally {
                setLoading(false);
            }
        };

    fetchAnalytics();
    }, [selectedDate]);

  if (loading) return <div>Loading...</div>;
  
  if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

  return (
    <div style={{ padding: '24px' }}>
      {/* Category Header and Date Picker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Admin Analytics Panel</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: '8px 12px', fontSize: '14px' }}
        />
      </div>

      {/* Summary Metric Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div style={{ flex: 1, padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Total Active Desks</p>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '28px' }}>{summary?.totalActiveDesks ?? 0}</h3>
        </div>
        
        <div style={{ flex: 1, padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Reservations for Selected Date</p>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '28px', color: '#2563eb' }}>
            {summary?.totalReservationCountForToday ?? 0}
          </h3>
        </div>

        <div style={{ flex: 1, padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>General Occupancy Rate</p>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '28px', color: '#059669' }}>
            %{summary?.occupancyRate ?? 0}
          </h3>
        </div>
      </div>

      {/* Graphs Area */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Floor-Based Occupancy Rates (Bar Chart) */}
        <div style={{ flex: '1 1 450px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0, marginBottom: '16px' }}>Floor-Based Occupancy Rates (%)</h4>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={floorData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="floorName" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip formatter={(val: number) => [`%${val}`, 'Occupancy']} />
                <Bar dataKey="occupancyRate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Distribution by Floor (Pie Chart) */}
        <div style={{ flex: '1 1 450px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0, marginBottom: '16px' }}>Occupancy Distribution by Floor</h4>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={floorData}
                  dataKey="occupiedDesks"
                  nameKey="floorName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  shape={(props: any) => {
                    const color = COLORS[props.index % COLORS.length];
                    return <Sector {...props} fill={color} />;
                  }}
                  label={({ payload }) => `${payload?.floorName}: ${payload?.occupiedDesks} Masa`}
                >
                </Pie>
                <Tooltip formatter={(val: number) => [`${val} Desks`, 'Occupied Desks']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};