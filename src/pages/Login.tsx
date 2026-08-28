import react, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from "../services/api";
import type { LoginRequest, AuthResponse } from "../types/auth";
import type React from 'react';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return;
        }

        try {
            setLoading(true);
            
            const response = await api.post<AuthResponse>('/auth/login', formData);
            // TODO: Implement a secure way to store the token and user information
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            alert('Login successful! Redirecting to dashboard...');
            navigate('/dashboard');
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.message || 'An error occurred during login');
            } else {
                setError('An unexpected error occurred during login');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Login</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleSubmit} >
                <div>
                    <label>Email:</label>
                    <input 
                    id="email" 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }} 
                    required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                    id="password" 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }} 
                    required 
                    />
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}