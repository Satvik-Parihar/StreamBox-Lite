import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Link } from 'react-router-dom';

const plans = [
    { name: 'FREE', price: '$0', features: ['SD Quality', 'Ads', '1 Device'] },
    { name: 'STANDARD', price: '$9.99', features: ['HD Quality', 'No Ads', '2 Devices'] },
    { name: 'PREMIUM', price: '$15.99', features: ['4K+HDR', 'No Ads', '3 Devices', 'Downloads'] },
];

export default function SubscriptionPage() {
    const { user, updateUserPlan } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleUpgrade = async (planName) => {
        if (planName === user.plan) return; // Can't upgrade to the same plan

        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            // This would be a payment gateway in a real app
            alert(`Simulating payment for ${planName} plan...`);

            // Call our new API route
            const res = await api.put('/user/me/plan', { plan: planName });

            // Update the user in our AuthContext
            updateUserPlan(res.data.plan);

            setSuccess(`Successfully upgraded to ${planName}!`);
        } catch (err) {
            console.error(err);
            setError('Failed to upgrade plan. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-h-screen p-8 mx-auto">
            <Link to="/dashboard" className="text-blue-400 hover:underline">&larr; Back to Dashboard</Link>
            <h1 className="mt-4 mb-8 text-4xl font-bold text-center">Manage Your Plan</h1>

            {error && <div className="p-3 mb-4 text-red-800 bg-red-200 rounded-lg">{error}</div>}
            {success && <div className="p-3 mb-4 text-green-800 bg-green-200 rounded-lg">{success}</div>}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`p-8 bg-gray-800 rounded-lg shadow-lg ${user.plan === plan.name ? 'ring-4 ring-blue-500' : ''}`}
                    >
                        <h2 className="text-3xl font-bold text-center text-blue-400">{plan.name}</h2>
                        <p className="mt-2 text-4xl font-bold text-center">{plan.price}<span className="text-base font-normal text-gray-400">/mo</span></p>

                        <ul className="mt-6 space-y-2">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center gap-2">
                                    <span className="text-green-500">✔</span> {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleUpgrade(plan.name)}
                            disabled={loading || user.plan === plan.name}
                            className="w-full p-3 mt-8 font-bold text-center transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (user.plan === plan.name ? 'Current Plan' : `Switch to ${plan.name}`)}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}