import { createContext, useContext, useEffect } from 'react';
import { authClient } from '../lib/auth-client';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        const interceptor = axios.interceptors.request.use((config) => {
            config.withCredentials = true; 
            return config;
        });
        return () => axios.interceptors.request.eject(interceptor);
    }, []);

    useEffect(() => {
        const syncUser = async () => {
            if (session?.user) {
                try {
                    // Use getSession() which returns the JWT under data.session.token
                    // (same path the SDK's own getJWTToken uses internally)
                    const sessionResult = await authClient.getSession();
                    console.log('getSession() data:', JSON.stringify(sessionResult?.data, null, 2));
                    const token = sessionResult?.data?.session?.token;
                    
                    if (token) {
                        const res = await axios.get('http://localhost:8081/api/users/me', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
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
