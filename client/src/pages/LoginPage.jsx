import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom'; // <-- REMOVED

export default function LoginPage() {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState(null);
    const { login } = useAuth();
    // const navigate = useNavigate(); // <-- REMOVED

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password); // AuthContext handles navigation
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
                
                <button 
                    type="submit" 
                    className="p-3 mt-2 font-bold text-white transition-all duration-300 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 hover:shadow-blue-500/50"
                >
                    Login
                </button>
            </form>
        </div>
    );
}