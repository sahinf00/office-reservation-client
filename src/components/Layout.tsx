import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
    const navigate = useNavigate();

    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }

    return (
        <div>
            <header
                style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px',
                backgroundColor: '#1976d2',
                color: '#fff',
                }}
            >
                <h3 style={{ margin: 0 }}>Desk Reservation System</h3>
                <nav style= {{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    {user.roleName === 'ADMIN' && (
                        <Link to="/admin/floors" style={{ color: '#ffeb3b', textDecoration: 'none' }}>Admin Floor Management</Link>
                    )}
                    {user.roleName === 'ADMIN' && (
                        <Link to="/admin/reservations" style={{ color: '#ffeb3b', textDecoration: 'none' }}>Admin Reservations</Link>
                    )}
                    {user.roleName === 'ADMIN' && (
                        <Link to="/admin/analytics" style={{ color: '#ffeb3b', textDecoration: 'none' }}>Admin Analytics</Link>
                    )}
                    <Link to="/desk-selection" style={{ color: '#fff', textDecoration: 'none' }}>Desk Selection</Link>
                    <Link to="/my-reservations" style={{ color: '#fff', textDecoration: 'none' }}>My Reservations</Link>
                    <button onClick={handleLogout}
                            type='button' 
                            style={{ 
                                backgroundColor: '#d32f2f', 
                                color: '#fff', 
                                border: 'none', 
                                padding: '6px 12px', 
                                borderRadius: '4px', 
                                cursor: 'pointer' }}>
                        Logout
                    </button>
                </nav>
            </header>
            <main style={{ padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
}
