// TODO: Import useState, useEffect, axios

export default function DashboardPage() {
    // TODO: Add state for shows and user
    // TODO: Use useEffect to fetch user data and '/api/content/shows'
    // Remember to set the 'x-auth-token' header in axios!

    // --- DUMMY DATA (until you wire it up) ---
    // Change this to 'FREE' or 'PREMIUM' to test the UI!
    const user = { plan: 'STANDARD' };
    const shows = [
        { _id: 1, title: 'Show 1', duration: '50 min' },
        { _id: 2, title: 'Show 2', duration: '42 min' }
    ];
    // ---

    return (
        <div className="container p-8 mx-auto">
            {/* Ad Banner: Only for FREE users */}
            {user.plan === 'FREE' && (
                <div className="p-4 mb-6 text-center text-yellow-800 bg-yellow-200 rounded-lg">
                    You are on the FREE plan. Ads will show here.
                </div>
            )}

            <h1 className="mb-6 text-4xl font-bold">Available Shows</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {shows.map(show => (
                    <div key={show._id} className="p-6 bg-gray-800 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold">{show.title}</h3>
                        <p className="mb-4 text-sm text-gray-400">{show.duration}</p>

                        <div className="flex flex-wrap gap-2">
                            {/* Play SD: For all users */}
                            <button className="px-4 py-2 text-sm font-medium bg-gray-600 rounded hover:bg-gray-500">Play SD</button>

                            {/* HD Button: Only for STANDARD and PREMIUM */}
                            {user.plan !== 'FREE' && (
                                <button className="px-4 py-2 text-sm font-medium bg-blue-600 rounded hover:bg-blue-500">Play HD</button>
                            )}

                            {/* Download Button: Only for PREMIUM */}
                            {user.plan === 'PREMIUM' && (
                                <button className="px-4 py-2 text-sm font-medium bg-green-600 rounded hover:bg-green-500">Download</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}