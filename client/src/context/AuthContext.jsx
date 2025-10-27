import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (err) {
                    console.error('Token validation failed:', err);
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed:', err.response?.data?.message);
            throw new Error(err.response?.data?.message || 'Login Failed');
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Backend logout failed', err);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            navigate('/login', { replace: true });
        }
    };

    // --- NEW FUNCTION ---
    // Call this after a successful plan change to update the UI
    const updateUserPlan = (newPlan) => {
        if (user) {
            setUser(prevUser => ({ ...prevUser, plan: newPlan }));
        }
    };
    // --------------------

    return (
        <AuthContext.Provider value={{ token, user, login, logout, loading, updateUserPlan }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};