import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage(''); // Reset message

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email, mobile }),
            });

            if (response.ok) {
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
            } else {
                if (response.status === 400) {
                    // Assuming a status of 400 indicates a user already exists
                    setMessage('User already exists. Try a different username.');
                } else {
                    setMessage('Registration failed. Please try again later.');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleRegister} className="card p-4">
                <h2 className="text-center">Register</h2>
                <div className="form-group">
                    <label>Username:</label>
                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Mobile Number:</label>
                    <input type="text" className="form-control" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                </div><br/>
                <button type="submit" className="btn btn-primary">Register</button>
                {message && <p className="mt-3">{message}</p>}
                <p className="mt-3">Already have an account? <Link to="/login">Login here</Link></p>
            </form>
        </div>
    );
};

export default Register;
