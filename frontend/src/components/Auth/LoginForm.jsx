import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
        const res = await fetch('http://localhost:5000/api/auth/logIn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || 'Something went wrong');
            return;
        }

        // You can store token or set user context here if needed
        // localStorage.setItem('token', data.token);

        // alert(data.message);
        navigate('/dashboard', { state: { user: data.user } });
        } catch (err) {
        console.error(err);
        setError('Something went wrong');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />

        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Log In</button>
        <p>
            Don't have an account?{' '}
            <span
            onClick={() => navigate('/signup')}
            style={{ color: 'blue', cursor: 'pointer' }}
            >
            Sign Up
            </span>
        </p>
        </form>
    );
    
};

export default LoginForm;