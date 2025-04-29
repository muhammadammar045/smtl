import { useNavigate } from "react-router-dom";

export function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center space-y-6 p-8">
                <h1 className="text-9xl font-bold text-gray-800">404</h1>
                
                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold text-gray-700">Page Not Found</h2>
                    <p className="text-gray-500">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="space-x-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Go Back
                    </button>
                    
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Home Page
                    </button>
                </div>
            </div>
        </div>
    );
}