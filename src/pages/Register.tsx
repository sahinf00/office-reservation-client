import react, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from "../services/api";
import type { RegisterRequest } from "../types/auth";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterRequest & { confirmPassword: string }>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            setLoading(true);
            const payload: RegisterRequest = {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            };
            
            await api.post('/auth/register', payload);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.message || 'An error occurred during registration');
            } else {
                setError('An unexpected error occurred during registration');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
        <h2>Register</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="fullName">Full Name:</label>
                <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="email">Email:</label>
                <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="password">Password:</label>
                <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
                {loading ? 'Registering...' : 'Register'}
            </button>
        </form>

        <p style={{ marginTop: '15px', textAlign: 'center' }}>
            Already have an account? <Link to="/login">Login</Link>
        </p>
    </div>
    );
}