import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClaimResponseDTO, MessageResponseDTO } from '../types/orders';
import { useAppContext } from '../context/AppContext';

interface ClaimDetailProps {
    claim: ClaimResponseDTO;
    onBack: () => void;
}

const MOCK_MESSAGES: MessageResponseDTO[] = [
    {
        id: 1,
        claim_id: 10,
        content: "Hola, el producto llegó dañado. Quisiera hacer un reclamo.",
        send_at: "2026-06-14T05:27:23.411Z",
        sender: { id: 11, username: "buyer1", first_name: "Andrea", last_name: "Buyer" },
    },
    {
        id: 2,
        claim_id: 10,
        content: "Hola Andrea, lamento los inconvenientes. ¿Podrías indicarme qué parte del producto está dañada?",
        send_at: "2026-06-14T05:28:00.000Z",
        sender: { id: 1, username: "admin1", first_name: "Juan", last_name: "Admin" },
    },
    {
        id: 3,
        claim_id: 10,
        content: "La pantalla tiene una raya y no enciende correctamente.",
        send_at: "2026-06-14T05:29:15.000Z",
        sender: { id: 11, username: "buyer1", first_name: "Andrea", last_name: "Buyer" },
    },
    {
        id: 4,
        claim_id: 10,
        content: "Entendido. Vamos a proceder con el cambio. Te enviaremos un comprobante por correo.",
        send_at: "2026-06-14T05:30:45.000Z",
        sender: { id: 1, username: "admin1", first_name: "Juan", last_name: "Admin" },
    },
];

export const ClaimDetailScreen = ({ claim, onBack }: ClaimDetailProps) => {
    const { currentUser } = useAppContext();
    const [messages, setMessages] = useState<MessageResponseDTO[]>(MOCK_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    let nextId = useRef(MOCK_MESSAGES.length + 1);

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

        const newMessage: MessageResponseDTO = {
            id: nextId.current++,
            claim_id: claim.id,
            content: text,
            send_at: new Date().toISOString(),
            sender: {
                id: currentUser?.id ?? 0,
                username: currentUser?.username ?? 'buyer1',
                first_name: currentUser?.first_name ?? 'Usuario',
                last_name: currentUser?.last_name ?? '',
            },
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
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

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay mensajes aún</Text>
            <Text style={styles.emptySubtext}>Envía un mensaje para iniciar la conversación</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Image source={require('../../assets/arrowLeftIcon.png')} style={styles.backIcon} />
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
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmpty}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => {
                        if (messages.length > 0) {
                            flatListRef.current?.scrollToEnd({ animated: false });
                        }
                    }}
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
                        <Image
                            source={require('../../assets/arrowLeftIcon.png')}
                            style={styles.sendIcon}
                        />
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
    backIcon: { width: 20, height: 20, tintColor: '#B91C1C' },
    headerInfo: { flex: 1 },
    headerTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
    headerSubtitle: { fontSize: 11, color: '#6B7280', marginTop: 1 },
    headerSpacer: { width: 28 },
    listContent: { padding: 16, paddingBottom: 8, flexGrow: 1, justifyContent: 'flex-end' },
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
    sendIcon: {
        width: 18,
        height: 18,
        tintColor: '#FFFFFF',
        transform: [{ rotate: '180deg' }],
    },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: '#6B7280', fontWeight: 'bold' },
    emptySubtext: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
});
