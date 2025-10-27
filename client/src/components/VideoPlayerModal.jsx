import { useState, useEffect, useRef } from 'react';

export default function VideoPlayerModal({ isOpen, onClose, videoUrl, isFreeUser, adPosterUrl }) { // <-- ADDED adPosterUrl
    const videoRef = useRef(null);
    const [isAdPlaying, setIsAdPlaying] = useState(false);
    const [adText, setAdText] = useState('');
    const [midRollPlayed, setMidRollPlayed] = useState(false);

    // This effect runs when the modal opens
    useEffect(() => {
        if (!isOpen) {
            setMidRollPlayed(false); // Reset on close
            return;
        }

        if (isFreeUser) {
            // --- Pre-roll Ad ---
            setIsAdPlaying(true);
            setAdText('Your video will begin in 5...');
            let countdown = 5;

            const timer = setInterval(() => {
                countdown--;
                setAdText(`Your video will begin in ${countdown}...`);
            }, 1000);

            const adTimer = setTimeout(() => {
                clearInterval(timer);
                setIsAdPlaying(false);
                videoRef.current?.play();
            }, 5000);

            return () => {
                clearInterval(timer);
                clearTimeout(adTimer);
            };
        } else {
            // Not a free user, just play the video
            setIsAdPlaying(false);
            // Use a slight delay to ensure the video ref is ready
            setTimeout(() => videoRef.current?.play(), 50);
        }
    }, [isOpen, isFreeUser]);

    // --- Mid-roll Ad Logic ---
    const handleTimeUpdate = () => {
        if (
            isFreeUser &&
            !midRollPlayed &&
            videoRef.current &&
            videoRef.current.currentTime > 10 // Play ad at 10 seconds
        ) {
            videoRef.current.pause();
            setMidRollPlayed(true); // Only play once
            setIsAdPlaying(true);
            setAdText('Ad: Thanks for your patience. Resuming in 5...');

            let countdown = 5;
            const timer = setInterval(() => {
                countdown--;
                setAdText(`Ad: Thanks for your patience. Resuming in ${countdown}...`);
            }, 1000);

            setTimeout(() => {
                clearInterval(timer);
                setIsAdPlaying(false);
                videoRef.current?.play();
            }, 5000);
        }
    };

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
                onClick={(e) => e.stopPropagation()} 
                className="relative w-full max-w-4xl bg-black rounded-lg shadow-xl"
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute z-30 p-1 text-2xl text-white bg-gray-800 rounded-full -top-3 -right-3 hover:bg-red-500"
                >
                    &times;
                </button>

                <div className="relative aspect-video">
                    {/* --- Ad Overlay --- */}
                    {isAdPlaying && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center w-full h-full text-white bg-gray-900">
                            {/* --- THIS WILL NOW SHOW THE POSTER --- */}
                            <img 
                                src={adPosterUrl} 
                                alt="Ad" 
                                className="absolute object-cover w-full h-full opacity-10" 
                            />
                            <h2 className="z-10 text-3xl font-bold">StreamBox Lite Ad</h2>
                            <p className="z-10 mt-4 text-xl">{adText}</p>
                        </div>
                    )}

                    {/* --- Real Video Player --- */}
                    <video 
                        ref={videoRef}
                        src={videoUrl} 
                        controls 
                        autoPlay={!isFreeUser} // Don't autoplay if pre-roll ad is playing
                        width="100%" 
                        height="100%"
                        onTimeUpdate={handleTimeUpdate}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    );
}