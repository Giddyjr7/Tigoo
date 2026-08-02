import { createContext, useContext, useEffect } from 'react';
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
                        const res = await api.get('/api/users/me');
                        console.log('User synced to backend:', res.data);
                    } else {
                        console.log('No JWT token found — full result:', JSON.stringify(sessionResult, null, 2));
                    }
                } catch (err) {
                    console.error('Failed to sync user to backend:', err);
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
