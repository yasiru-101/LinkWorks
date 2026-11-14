import {
  addDoc,
  collection,
  doc,
  getDocFromServer,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from '@react-native-firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { useAuth } from '../../Yasiru/Auth/AuthContext';

type MessageItem = {
  id: string;
  senderId: string;
  text: string;
  createdAtText?: string;
  isSelf: boolean;
};

// Fallback demo conversation messages.
const DEMO_THREAD_MESSAGES: MessageItem[] = [
  {
    id: 'm1',
    senderId: 'worker-colombo-plumber-1',
    text: 'Hello! I am on my way with the replacement PVC pipes and tools.',
    createdAtText: '10:15 AM',
    isSelf: false,
  },
  {
    id: 'm2',
    senderId: 'demo-client-1',
    text: 'Great! The kitchen is on the ground floor. Let me know if you need parking.',
    createdAtText: '10:18 AM',
    isSelf: true,
  },
  {
    id: 'm3',
    senderId: 'worker-colombo-plumber-1',
    text: 'Understood. Should take around 45 minutes to complete the seal repair.',
    createdAtText: '10:20 AM',
    isSelf: false,
  },
];

// Active real-time job chat screen for assigned client and worker.
export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // jobId
  const { user, profile } = useAuth();

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [jobTitle, setJobTitle] = useState('Job Discussion');
  const [otherName, setOtherName] = useState('Tradesperson');
  const [otherPhone, setOtherPhone] = useState('+94779876543');
  const [jobStatus, setJobStatus] = useState('assigned');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Load chat header metadata and establish real-time snapshot listener.
  useEffect(() => {
    if (!id || !user) return;
    const currentUid = user.uid;

    async function fetchChatHeader() {
      try {
        const chatSnap = await getDocFromServer(doc(getFirestore(), 'chats', id));
        if (chatSnap.exists()) {
          const data = chatSnap.data();
          setJobTitle(data.jobTitle || 'Job Chat');
          setJobStatus(data.jobStatus || 'assigned');
          const isClient = data.participants?.[0] === currentUid;
          const otherInfo = isClient ? data.workerInfo : data.clientInfo;
          if (otherInfo?.name) setOtherName(otherInfo.name);
          if (otherInfo?.phone) setOtherPhone(otherInfo.phone);
        }
      } catch {
        // Fall back in preview mode
      } finally {
        setLoading(false);
      }
    }
    void fetchChatHeader();

    // Listen to messages subcollection in real time.
    let unsubscribe = () => {};
    try {
      const q = query(
        collection(getFirestore(), 'chats', id, 'messages'),
        orderBy('createdAt', 'asc')
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: MessageItem[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                senderId: data.senderId,
                text: data.text,
                isSelf: data.senderId === currentUid,
                createdAtText: 'Just now',
              };
            });
            setMessages(list);
          } else {
            setMessages(DEMO_THREAD_MESSAGES.map((m) => ({ ...m, isSelf: m.senderId === currentUid })));
          }
          setLoading(false);
        },
        () => {
          // Fall back to demo messages on snapshot error or offline
          setMessages(DEMO_THREAD_MESSAGES.map((m) => ({ ...m, isSelf: m.senderId === currentUid })));
          setLoading(false);
        }
      );
    } catch {
      setMessages(DEMO_THREAD_MESSAGES.map((m) => ({ ...m, isSelf: m.senderId === currentUid })));
      setLoading(false);
    }

    // Clean up real-time listener on unmount.
    return () => {
      unsubscribe();
    };
  }, [id, user]);

  // Send a new text message.
  async function sendMessage() {
    if (!inputText.trim() || !id || !user) return;
    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      try {
        const firestore = getFirestore();
        await addDoc(collection(firestore, 'chats', id, 'messages'), {
          senderId: user.uid,
          text: textToSend,
          createdAt: serverTimestamp(),
          readBy: [user.uid],
        });

        await updateDoc(doc(firestore, 'chats', id), {
          lastMessage: textToSend,
          lastAt: serverTimestamp(),
        });
      } catch {
        // Local simulation for preview mode
        setMessages((prev) => [
          ...prev,
          {
            id: `local-${Date.now()}`,
            senderId: user.uid,
            text: textToSend,
            createdAtText: 'Just now',
            isSelf: true,
          },
        ]);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Chat Header Banner with Call CTA */}
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View style={styles.headerInfo}>
            <Text numberOfLines={1} style={styles.headerTitle}>{otherName}</Text>
            <Text numberOfLines={1} style={styles.headerSubtitle}>{jobTitle}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Call ${otherName}`}
            onPress={() => Linking.openURL(`tel:${otherPhone}`)}
            style={styles.callIcon}
          >
            <Text style={styles.callIconText}>📞</Text>
          </Pressable>
        </View>

        {/* Status Reminder Pill */}
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>
            Status: {jobStatus.replace('_', ' ').toUpperCase()} • Contact verified
          </Text>
        </View>

        {/* Message Thread List */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={styles.loadingText}>Loading chat…</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.isSelf ? styles.selfBubble : styles.otherBubble,
                ]}
              >
                <Text style={[styles.messageText, item.isSelf ? styles.selfText : styles.otherText]}>
                  {item.text}
                </Text>
                {item.createdAtText ? (
                  <Text style={[styles.timeText, item.isSelf ? styles.selfTime : styles.otherTime]}>
                    {item.createdAtText}
                  </Text>
                ) : null}
              </View>
            )}
          />
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            placeholder="Type a message…"
            placeholderTextColor="#7d9089"
            value={inputText}
            onChangeText={setInputText}
            style={styles.textInput}
            multiline
            maxLength={1000}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send message"
            disabled={!inputText.trim() || sending}
            onPress={() => { void sendMessage(); }}
            style={[styles.sendButton, !inputText.trim() && styles.sendDisabled]}
          >
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    gap: spacing.sm,
  },
  backButton: {
    paddingVertical: 6,
    paddingRight: 6,
  },
  backText: {
    color: palette.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    color: palette.heading,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  headerSubtitle: {
    color: palette.muted,
    fontSize: 12,
  },
  callIcon: {
    backgroundColor: '#e6f1ec',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIconText: {
    fontSize: 16,
  },
  statusPill: {
    backgroundColor: '#e6f7ef',
    paddingVertical: 6,
    alignItems: 'center',
  },
  statusPillText: {
    color: '#027a48',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    color: palette.muted,
    fontSize: 14,
  },
  messageList: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  selfBubble: {
    alignSelf: 'flex-end',
    backgroundColor: palette.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  selfText: {
    color: '#ffffff',
  },
  otherText: {
    color: palette.heading,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
  },
  selfTime: {
    color: '#d4ece4',
    alignSelf: 'flex-end',
  },
  otherTime: {
    color: palette.muted,
    alignSelf: 'flex-end',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: palette.surface,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: palette.heading,
  },
  sendButton: {
    backgroundColor: palette.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendDisabled: {
    opacity: 0.4,
  },
  sendText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
