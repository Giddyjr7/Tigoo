import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function useClaps(postId, initialClapCount = 0) {
    const { user } = useAuth();
    const [totalClaps, setTotalClaps] = useState(initialClapCount);
    const [userClaps, setUserClaps] = useState(0);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        if (!postId) return;
        
        const fetchClaps = async () => {
            try {
                const res = await api.get(`/api/posts/${postId}/claps`);
                setTotalClaps(res.data.totalClapCount);
                if (user) {
                    setUserClaps(res.data.userClapCount);
                }
            } catch (error) {
                console.error("Failed to fetch claps", error);
            }
        };

        fetchClaps();
    }, [postId, user]);

    const handleClap = useCallback(async () => {
        if (!user) {
            toast.error("Sign in to clap for this story");
            return;
        }

        if (userClaps >= 50) {
            toast.success("You've given the maximum 50 claps!");
            return;
        }

        if (isLiking) return;

        setIsLiking(true);
        // Optimistic update
        setTotalClaps(prev => prev + 1);
        setUserClaps(prev => prev + 1);

        try {
            const res = await api.post(`/api/posts/${postId}/claps`, { count: 1 });
            setTotalClaps(res.data.totalClapCount);
            setUserClaps(res.data.userClapCount);
        } catch (error) {
            console.error("Failed to add clap", error);
            // Revert optimistic update
            setTotalClaps(prev => prev - 1);
            setUserClaps(prev => prev - 1);
            toast.error("Failed to add clap");
        } finally {
            setIsLiking(false);
        }
    }, [postId, user, userClaps, isLiking]);

    return { totalClaps, userClaps, handleClap };
}
