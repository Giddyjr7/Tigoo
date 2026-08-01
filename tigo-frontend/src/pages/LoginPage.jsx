import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function LoginPage() {
    const { user, signInWithGoogle, isLoading } = useAuth();

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    
    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-3xl font-bold mb-8">Welcome to Tigo</h1>
            <button 
                onClick={signInWithGoogle}
                className="px-6 py-3 bg-accent text-white rounded-lg font-medium shadow-md hover:bg-opacity-90 transition-all"
            >
                Sign in with Google
            </button>
        </div>
    );
}
