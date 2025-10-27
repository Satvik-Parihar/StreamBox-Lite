import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api';
import VideoPlayerModal from '../components/VideoPlayerModal';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adPoster, setAdPoster] = useState(null);
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

    useEffect(() => {
        const fetchShows = async () => {
            try {
                setLoading(true);
                const res = await api.get('/content/shows');
                setShows(res.data);
                
                if (res.data.length > 0) {
                    const randomShow = res.data[Math.floor(Math.random() * res.data.length)];
                    setAdPoster(randomShow.posterUrl);
                }
                
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to load shows. Please try again.');
                if (err.response?.status === 401) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchShows();
    }, [logout]);

    const handlePlayClick = (videoUrl) => {
        setSelectedVideoUrl(videoUrl);
        setIsPlayerOpen(true);
    };

    // --- NEW DOWNLOAD FUNCTION ---
    const handleDownload = async (showId, showTitle) => {
        try {
            // 1. Request the file from our server.
            // We expect a 'blob' (the file data) in response.
            const res = await api.get(`/content/download/${showId}`, {
                responseType: 'blob', // This is crucial
            });

            // 2. Create a temporary URL for the blob
            const url = window.URL.createObjectURL(new Blob([res.data]));

            // 3. Create a hidden link to trigger the download
            const link = document.createElement('a');
            link.href = url;
            const fileName = `${showTitle.replace(' ', '_')}.mp4`;
            link.setAttribute('download', fileName);
            
            // 4. Append, click, and remove the link
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url); // Clean up the object URL

        } catch (err) {
            // If the user is not premium, the API will send JSON error.
            // We need to parse that JSON from the blob.
            if (err.response.data.type === 'application/json') {
                const errorText = await err.response.data.text();
                const errorJson = JSON.parse(errorText);
                alert(`Error: ${errorJson.message}`);
            } else {
                alert('Download failed. Please try again.');
            }
        }
    };
    // -----------------------------

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen">Loading user...</div>
    }

    return (
        <>
            <VideoPlayerModal 
                isOpen={isPlayerOpen}
                onClose={() => setIsPlayerOpen(false)}
                videoUrl={selectedVideoUrl}
                isFreeUser={user.plan === 'FREE'}
                adPosterUrl={adPoster}
            />

            <div className="container p-8 mx-auto">
                <header className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
                    <h1 className="text-4xl font-bold">
                        Welcome, <span className="text-blue-400">{user.email}</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 text-sm font-bold text-yellow-900 bg-yellow-300 rounded-full">
                            {user.plan} PLAN
                        </span>
                        
                        <Link 
                            to="/subscription" 
                            className="px-4 py-2 text-sm font-medium bg-gray-600 rounded hover:bg-gray-500"
                        >
                            Manage Plan
                        </Link>
                        
                        <button onClick={logout} className="px-4 py-2 font-bold bg-red-600 rounded hover:bg-red-500">
                            Logout
                        </button>
                    </div>
                </header>

                {user.plan === 'FREE' && adPoster && (
                    <div className="p-4 mb-6 text-center bg-gray-800 rounded-lg shadow-lg">
                        <h4 className="mb-2 text-lg font-bold text-yellow-400">Advertisement</h4>
                        <p className="mb-4 text-sm text-gray-300">Upgrade to Standard to remove ads and watch in HD!</p>
                        <img 
                            src={adPoster} 
                            alt="Ad Poster" 
                            className="object-contain w-full h-48 mx-auto rounded opacity-50" 
                        />
                    </div>
                )}
                
                <h2 className="mb-6 text-3xl font-bold">Available Movies</h2>

                {loading && <div className="text-center">Loading movies...</div>}
                {error && <div className="p-4 text-red-800 bg-red-200 rounded-lg">{error}</div>}
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {shows.map(show => (
                    
                    <div 
                        key={show._id} 
                        className="flex flex-col bg-gray-800 rounded-lg shadow-lg overflow-hidden
                                   transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
                    >
                        <img src={show.posterUrl} alt={show.title} className="object-cover w-full h-64" />
                        
                        <div className="flex flex-col justify-between flex-grow p-4">
                            <div>
                                <h3 className="text-xl font-bold">{show.title}</h3>
                                <p className="mb-4 text-sm text-gray-400">{show.duration}</p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <button 
                                    onClick={() => handlePlayClick(show.sdUrl)}
                                    className="flex-grow px-4 py-2 text-sm font-medium bg-gray-600 rounded hover:bg-gray-500"
                                >
                                    Play SD
                                </button>
                                
                                {user.plan !== 'FREE' && (
                                    <button 
                                        onClick={() => handlePlayClick(show.hdUrl)}
                                        className="flex-grow px-4 py-2 text-sm font-medium bg-blue-600 rounded hover:bg-blue-500"
                                    >
                                        Play HD
                                    </button>
                                )}
                                
                                {user.plan === 'PREMIUM' && (
                                    <button 
                                        onClick={() => handleDownload(show._id, show.title)}
                                        className="flex-grow px-4 py-2 text-sm font-medium bg-green-600 rounded hover:bg-green-500"
                                    >
                                        Download
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </>
    );
}