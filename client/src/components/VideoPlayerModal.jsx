import { useState, useEffect } from 'react';

// This is a basic modal. In a real app, you'd use a library like react-modal.
export default function VideoPlayerModal({ isOpen, onClose, videoUrl, isFreeUser }) {
    const [showAd, setShowAd] = useState(isFreeUser);
    const [adCountdown, setAdCountdown] = useState(5);

    // This effect runs when the modal opens
    useEffect(() => {
        if (isOpen && isFreeUser) {
            setShowAd(true);
            setAdCountdown(5);

            // Start the ad countdown
            const timer = setInterval(() => {
                setAdCountdown(prev => prev - 1);
            }, 1000);

            // After 5 seconds, clear interval and hide ad
            const adTimer = setTimeout(() => {
                clearInterval(timer);
                setShowAd(false);
            }, 5000);

            return () => { // Cleanup on unmount/close
                clearInterval(timer);
                clearTimeout(adTimer);
            };
        } else if (isOpen && !isFreeUser) {
            setShowAd(false); // Non-free users never see ads
        }
    }, [isOpen, isFreeUser]);

    if (!isOpen) {
        return null;
    }

    return (
        // Backdrop
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
        >
            {/* Modal Content */}
            <div
                onClick={(e) => e.stopPropagation()} // Prevent closing modal on content click
                className="relative w-full max-w-4xl bg-black rounded-lg shadow-xl"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute z-10 p-1 text-2xl text-white bg-gray-800 rounded-full -top-3 -right-3 hover:bg-red-500"
                >
                    &times;
                </button>

                <div className="aspect-video">
                    {showAd ? (
                        // --- Ad Player ---
                        <div className="flex flex-col items-center justify-center w-full h-full text-white bg-gray-900">
                            <h2 className="text-3xl font-bold">Your ad will play here</h2>
                            <p className="mt-4 text-xl">Video will begin in... {adCountdown}</p>
                            <button
                                onClick={() => setShowAd(false)}
                                className="px-4 py-2 mt-6 text-sm bg-gray-700 rounded hover:bg-gray-600"
                            >
                                Skip Ad
                            </button>
                        </div>
                    ) : (
                        // --- Real Video Player ---
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            width="100%"
                            height="100%"
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            </div>
        </div>
    );
}