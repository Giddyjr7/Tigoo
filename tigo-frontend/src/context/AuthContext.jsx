import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { authClient } from '../lib/auth-client';
import { api } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { data: session, isPending } = authClient.useSession();

    // Fix sandboxed iframe permissions for OAuth popup flow.
    // Mobile simulators (DevTools, Neon preview, etc.) embed the app in an
    // iframe with allow-scripts + allow-same-origin but WITHOUT allow-popups
    // or allow-top-navigation. Since allow-same-origin gives us parent DOM
    // access, we can upgrade our own iframe's sandbox to add the missing
    // permissions. This triggers one automatic reload.
    useEffect(() => {
        try {
            if (window.self === window.top) return; // Not in an iframe

            const parentDoc = window.parent.document;
            const iframes = parentDoc.querySelectorAll('iframe');
            for (const iframe of iframes) {
                try {
                    if (iframe.contentWindow !== window) continue;
                    const sandbox = iframe.getAttribute('sandbox');
                    if (!sandbox) break; // No sandbox attribute = no restrictions

                    // Check if we need to add permissions
                    const needsPopups = !sandbox.includes('allow-popups');
                    const needsTopNav = !sandbox.includes('allow-top-navigation');
                    if (!needsPopups && !needsTopNav) break; // Already has permissions

                    // Add missing permissions — this will reload the iframe once
                    let updated = sandbox;
                    if (needsPopups) updated += ' allow-popups allow-popups-to-escape-sandbox';
                    if (needsTopNav) updated += ' allow-top-navigation-by-user-activation';
                    iframe.setAttribute('sandbox', updated);
                    console.log('[Auth] Upgraded iframe sandbox permissions for OAuth');
                    break;
                } catch {}
            }
        } catch {
            // Cross-origin or no parent access — can't fix sandbox
        }
    }, []);

    const [backendUser, setBackendUser] = useState(null);

    useEffect(() => {
        const syncUser = async () => {
            if (session?.user) {
                try {
                    const sessionResult = await authClient.getSession();
                    const token = sessionResult?.data?.session?.token;

                    if (token) {
                        const res = await api.get('/api/users/me');
                        setBackendUser(res.data);
                    }
                } catch (err) {
                    console.error('Failed to sync user to backend:', err);
                    toast.error('Failed to sync your account. Some features may not work correctly.');
                }
            } else {
                setBackendUser(null);
            }
        };
        syncUser();
    }, [session]);

    const signInWithGoogle = async () => {
        // Pre-open the popup synchronously to preserve the user gesture.
        // The SDK opens window.open() after an async fetch(), which loses
        // the gesture and gets blocked on mobile. Pre-opening with the same
        // window name ("neon_oauth_popup") lets the SDK reuse it.
        //
        // In non-iframe contexts, the SDK uses redirect flow (no popup),
        // so this pre-open is harmless — the window is never navigated.
        // In iframe contexts, the sandbox fix above ensures popups work.
        try {
            if (window.self !== window.top) {
                window.open('about:blank', 'neon_oauth_popup', 'width=500,height=700,popup=yes');
            }
        } catch {}

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
            user: backendUser || session?.user, // Fallback to session.user to prevent complete breakage, but backendUser takes precedence
            backendUser,
            session,
            isLoading: isPending || (session?.user && !backendUser), // also load while backend user is fetching
            signInWithGoogle,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

