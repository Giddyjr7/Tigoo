import { createContext, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authClient } from '../lib/auth-client';
import { api } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        const syncUser = async () => {
            if (session?.user) {
                try {
                    const sessionResult = await authClient.getSession();
                    const token = sessionResult?.data?.session?.token;
                    
                    if (token) {
                        await api.get('/api/users/me');
                    }
                } catch (err) {
                    console.error('Failed to sync user to backend:', err);
                    toast.error('Failed to sync your account. Some features may not work correctly.');
                }
            }
        };
        syncUser();
    }, [session]);

    const signInWithGoogle = async () => {
        await authClient.signIn.social({ 
            provider: 'google', 
            callbackURL: window.location.origin 
        });
    };

    const signOut = async () => {
        await authClient.signOut();
    };

    return (
        <AuthContext.Provider value={{ 
            user: session?.user, 
            session, 
            isLoading: isPending, 
            signInWithGoogle, 
            signOut 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
