import { useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { MessageResponseDTO } from '../types/orders';
import { getMessages } from '../services/claimService';
import { API_URL } from '../config';

export const useWebsocket = (claimId: number | null, token?: string | null) => {
    const [messages, setMessages] = useState<MessageResponseDTO[]>([]);
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    const stompClientRef = useRef<Client | null>(null);

    const fetchMessages = async (cursorValue?: string) => {
        if (!claimId) return;
        try {
            const response = await getMessages(claimId, cursorValue);
            setMessages(prev => {
                const existingIds = new Set(prev.map(m => m.id));
                const newMsgs = response.content.filter(m => !existingIds.has(m.id));
                return [...prev, ...newMsgs];
            });
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

    useEffect(() => {
        if (!claimId || !token) return;

        const url = `${API_URL}/ws-sockjs`;

        const client = new Client({
            webSocketFactory: () => new SockJS(url),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log('STOMP Conectado');
            client.subscribe('/user/queue/claim', (message) => {
                if (message.body) {
                    const receivedMessage: MessageResponseDTO = JSON.parse(message.body);
                    if (receivedMessage.claim_id === claimId) {
                        setMessages(prev => {
                            const exists = prev.some(m => m.id === receivedMessage.id);
                            if (exists) return prev;
                            return [receivedMessage, ...prev];
                        });
                    }
                }
            });
        };

        client.onStompError = (frame) => {
            console.error('STOMP Error:', frame.headers['message']);
        };

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [claimId, token]);

    const sendMessage = useCallback((content: string) => {
        if (stompClientRef.current && stompClientRef.current.connected && claimId) {
            const body = {
                claim_id: claimId,
                content: content.trim(),
            };
            stompClientRef.current.publish({
                destination: '/app/claim.send',
                body: JSON.stringify(body),
            });
        } else {
            console.warn('WebSocket no conectado');
        }
    }, [claimId]);

    return {
        messages,
        isLoading,
        isLoadingMore,
        hasMore,
        loadMore,
        sendMessage,
    };
};
