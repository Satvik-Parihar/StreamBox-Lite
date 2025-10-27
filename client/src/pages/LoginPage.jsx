// TODO: Import useState, axios, and useNavigate

export default function LoginPage() {
    // TODO: Add state for email/password
    // TODO: Add login function that calls API with axios
    // On success, save token to localStorage and navigate to '/dashboard'

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form className="flex flex-col w-full max-w-sm gap-4 p-8 bg-gray-800 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-center">StreamBox Lite</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="p-2 font-bold bg-blue-600 rounded hover:bg-blue-500">
                    Login
                </button>
            </form>
        </div>
    );
}