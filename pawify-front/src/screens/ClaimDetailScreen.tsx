import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClaimResponseDTO, MessageResponseDTO } from '../types/orders';
import { useWebsocket } from '../context/WebSocket';
import { useAppContext } from '../context/AppContext';
import { ArrowLeftIcon, SendHorizontalIcon } from '../components/Icons';

interface ClaimDetailProps {
    claim: ClaimResponseDTO;
    onBack: () => void;
}

export const ClaimDetailScreen = ({ claim, onBack }: ClaimDetailProps) => {
    const { currentUser } = useAppContext();
    const { messages, isLoading, isLoadingMore, hasMore, loadMore, sendMessage } = useWebsocket(claim.id, currentUser?.token);
    const [inputText, setInputText] = useState('');

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleSend = () => {
        const text = inputText.trim();
        if (!text) return;
        sendMessage(text);
        setInputText('');
    };

    const renderMessage = ({ item }: { item: MessageResponseDTO }) => {
        const senderName = `${item.sender.first_name} ${item.sender.last_name}`.trim() || item.sender.username;
        const isOwn = currentUser ? item.sender.username === currentUser.username : false;

        return (
            <View style={[styles.messageRow, isOwn ? styles.messageRowOwn : styles.messageRowOther]}>
                <View style={[styles.messageBubble, isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther]}>
                    <Text style={[styles.senderName, isOwn ? styles.senderNameOwn : styles.senderNameOther]}>
                        {senderName}
                    </Text>
                    <Text style={[styles.messageContent, isOwn && { color: '#FFF' }]}>
                        {item.content}
                    </Text>
                    <Text style={[styles.messageTime, isOwn && { color: '#FECACA' }]}>
                        {formatTime(item.send_at)}
                    </Text>
                </View>
            </View>
        );
    };

    const renderEmpty = () => {
        if (isLoading) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color="#B91C1C" />
                </View>
            );
        }
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay mensajes aún</Text>
                <Text style={styles.emptySubtext}>Envía un mensaje para iniciar la conversación</Text>
            </View>
        );
    };

    const renderFooter = () => {
        if (isLoadingMore) {
            return <ActivityIndicator size="small" color="#B91C1C" style={styles.footerLoader} />;
        }
        if (!hasMore && messages.length > 0) {
            return <Text style={styles.noMoreText}>No hay más mensajes</Text>;
        }
        return null;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeftIcon size={20} color="#B91C1C" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{claim.detail.product_name}</Text>
                    <Text style={styles.headerSubtitle}>Reclamo #{claim.id}</Text>
                </View>
                <View style={styles.headerSpacer} />
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}
            >
                <FlatList
                    inverted
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmpty}
                    ListFooterComponent={renderFooter}
                    showsVerticalScrollIndicator={false}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.3}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Escribe un mensaje..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <SendHorizontalIcon size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    flex: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: { padding: 4, marginRight: 8 },
    headerInfo: { flex: 1 },
    headerTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
    headerSubtitle: { fontSize: 11, color: '#6B7280', marginTop: 1 },
    headerSpacer: { width: 28 },
    listContent: { padding: 16, paddingBottom: 8, flexGrow: 1 },
    messageRow: { marginBottom: 10 },
    messageRowOwn: { alignItems: 'flex-end' },
    messageRowOther: { alignItems: 'flex-start' },
    messageBubble: {
        maxWidth: '80%',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    messageBubbleOwn: {
        backgroundColor: '#B91C1C',
        borderBottomRightRadius: 4,
    },
    messageBubbleOther: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    senderName: { fontSize: 10, fontWeight: 'bold', marginBottom: 3 },
    senderNameOwn: { color: '#FECACA' },
    senderNameOther: { color: '#6B7280' },
    messageContent: { fontSize: 14, color: '#111827', lineHeight: 20 },
    messageTime: { fontSize: 10, color: '#9CA3AF', marginTop: 4, alignSelf: 'flex-end' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        color: '#111827',
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#B91C1C',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    sendButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: '#6B7280', fontWeight: 'bold' },
    emptySubtext: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
    footerLoader: { marginVertical: 20 },
    noMoreText: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginVertical: 20 },
});
