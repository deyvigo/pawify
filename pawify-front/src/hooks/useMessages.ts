import { useState, useEffect, useCallback } from 'react';
import { MessageResponseDTO } from '../types/orders';
import { getMessages } from '../services/claimService';

export const useMessages = (claimId: number | null) => {
    const [messages, setMessages] = useState<MessageResponseDTO[]>([]);
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    const fetchMessages = async (cursorValue?: string) => {
        if (!claimId) return;
        try {
            const response = await getMessages(claimId, cursorValue);
            if (cursorValue) {
                setMessages(prev => [...prev, ...response.content]);
            } else {
                setMessages(response.content);
            }
            setCursor(response.cursor);
            setHasMore(response.has_next);
        } catch (error) {
            console.error("Error obteniendo mensajes:", error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        setMessages([]);
        setCursor(undefined);
        setHasMore(true);
        setIsLoading(true);
        fetchMessages(undefined);
    }, [claimId]);

    const loadMore = useCallback(() => {
        if (hasMore && !isLoadingMore && !isLoading) {
            setIsLoadingMore(true);
            fetchMessages(cursor);
        }
    }, [hasMore, isLoadingMore, isLoading, cursor]);

    return {
        messages,
        isLoading,
        isLoadingMore,
        hasMore,
        loadMore,
    };
};