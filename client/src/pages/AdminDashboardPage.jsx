import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function AdminDashboardPage() {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await api.get('/admin/users');
                // Filter out the admin's own account from the list
                setUsers(res.data.filter(u => u._id !== user._id));
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to load users.');
                if (err.response.status === 401) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user._id, logout]);

    // Handler to change a user's plan
    const handleChangePlan = async (userId, newPlan) => {
        if (!window.confirm(`Change this user's plan to ${newPlan}?`)) return;

        try {
            const res = await api.put(`/admin/users/${userId}/plan`, { plan: newPlan });
            // Update the user list in the UI
            setUsers(users.map(u => (u._id === userId ? res.data : u)));
            alert('Plan updated successfully!');
        } catch (err) {
            alert('Failed to update plan.');
        }
    };

    // Handler to force logout all sessions for a user
    const handleForceLogout = async (userId, userEmail) => {
        if (!window.confirm(`Force logout all sessions for ${userEmail}?`)) return;

        try {
            const res = await api.post(`/admin/users/${userId}/logout-all`);
            alert(res.data.message);
        } catch (err) {
            alert('Failed to force logout.');
        }
    };

    return (
        <div className="container p-8 mx-auto">
            <header className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
                <h1 className="text-4xl font-bold">
                    Admin Panel
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-lg text-blue-400">Welcome, {user.email}</span>
                    <button onClick={logout} className="px-4 py-2 font-bold bg-red-600 rounded hover:bg-red-500">
                        Logout
                    </button>
                </div>
            </header>

            <h2 className="mb-6 text-3xl font-bold">User Management</h2>

            {loading && <div className="text-center">Loading users...</div>}
            {error && <div className="p-4 text-red-800 bg-red-200 rounded-lg">{error}</div>}

            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                <table className="min-w-full">
                    <thead className="border-b border-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Email</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Current Plan</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${u.plan === 'PREMIUM' ? 'bg-green-300 text-green-900' :
                                            u.plan === 'STANDARD' ? 'bg-blue-300 text-blue-900' :
                                                'bg-yellow-300 text-yellow-900'
                                        }`}>
                                        {u.plan}
                                    </span>
                                </td>
                                <td className="flex flex-wrap gap-2 px-6 py-4 whitespace-nowrap">
                                    <select
                                        defaultValue=""
                                        onChange={(e) => handleChangePlan(u._id, e.target.value)}
                                        className="p-2 text-black bg-white rounded"
                                    >
                                        <option value="" disabled>Change Plan...</option>
                                        <option value="FREE">FREE</option>
                                        <option value="STANDARD">STANDARD</option>
                                        <option value="PREMIUM">PREMIUM</option>
                                    </select>
                                    <button
                                        onClick={() => handleForceLogout(u._id, u.email)}
                                        className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-500"
                                    >
                                        Force Logout All
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}