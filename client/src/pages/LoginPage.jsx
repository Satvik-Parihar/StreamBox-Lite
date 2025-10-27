import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('free@user.com'); // Pre-filled for easy testing
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm gap-4 p-8 bg-gray-800 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-center">StreamBox Lite</h2>
                
                {error && (
                    <div className="p-3 text-center text-red-800 bg-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-300">Email</span>
                    <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-300">Password</span>
                    <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </label>
                
                <button type="submit" className="p-2 mt-2 font-bold bg-blue-600 rounded hover:bg-blue-500">
                    Login
                </button>
            </form>
        </div>
    );
}