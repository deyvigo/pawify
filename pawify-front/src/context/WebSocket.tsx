import { useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { MessageResponseDTO } from '../types/orders';
import { getMessages } from '../services/claimService';
import { WS_URL } from '../config';

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

    useEffect(() => {
        if (!claimId || !token) return;

        const url = `${WS_URL}/ws`;

        console.log('Conectando WebSocket a:', url, 'Token:', token?.slice(0, 20) + '...');

        const client = new Client({
            webSocketFactory: () => new WebSocket(url),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            debug: (str) => console.log('STOMP:', str),
        });

        client.onConnect = () => {
            console.log('STOMP Conectado');

            client.subscribe('/user/queue/claim', (message) => {
                if (message.body) {
                    const receivedMessage: MessageResponseDTO = JSON.parse(message.body);
                    if (receivedMessage.claim_id === claimId) {
                        setMessages(prev => [receivedMessage, ...prev]);
                    }
                }
            });
        };

        client.onStompError = (frame) => {
            console.error('STOMP Error:', frame.headers['message']);
        };

        client.onWebSocketClose = (event) => {
            console.log('STOMP WebSocket cerrado - code:', event.code, 'reason:', event.reason);
        };

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                console.log('STOMP Desconectado');
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
