import {
  addDoc,
  collection,
  doc,
  getDocFromServer,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from '@react-native-firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
import { getSafeFirestore } from '../../Yasiru/Auth/firebase';

type MessageItem = {
  id: string;
  senderId: string;
  text: string;
  createdAtText?: string;
  isSelf: boolean;
  photoUrl?: string;
  photoCaption?: string;
};

// High-fidelity real-time job-linked chat thread powered purely by Cloud Firestore.
export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // jobId
  const { user, profile } = useAuth();

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [jobTitle, setJobTitle] = useState('Job Details');
  const [otherName, setOtherName] = useState('Member');
  const [otherPhone, setOtherPhone] = useState('');
  const [otherRole, setOtherRole] = useState('Online');
  const [targetWorkerId, setTargetWorkerId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState('assigned');
  const [agreedPrice, setAgreedPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Load chat header metadata and establish real-time snapshot listener on Cloud Firestore.
  useEffect(() => {
    if (!id || !user) return;
    const currentUid = user.uid;

    async function fetchChatHeader() {
      try {
        const chatSnap = await getDocFromServer(doc(getSafeFirestore(), 'chats', id));
        if (chatSnap.exists()) {
          const data = chatSnap.data();
          setJobTitle(data.jobTitle || 'Job Details');
          setJobStatus(data.jobStatus || 'assigned');
          const isClient = data.clientId ? data.clientId === currentUid : data.participants?.[0] === currentUid;
          const otherInfo = isClient ? data.workerInfo : data.clientInfo;
          if (otherInfo?.name) setOtherName(otherInfo.name);
          if (otherInfo?.phone) setOtherPhone(otherInfo.phone);
          if (data.workerId) setTargetWorkerId(data.workerId);
          setOtherRole(isClient ? (otherInfo?.trade || 'Verified Tradesperson • Online') : 'Client • Online');
        }
      } catch {
        // Fall back gracefully in offline mode
      } finally {
        setLoading(false);
      }
    }
    void fetchChatHeader();

    // Listen to messages subcollection in real time via Cloud Firestore onSnapshot.
    let unsubscribe = () => {};
    try {
      const q = query(
        collection(getSafeFirestore(), 'chats', id, 'messages'),
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
                photoCaption: data.photoCaption,
              };
            });
            setMessages(list);
          } else {
            setMessages([]);
          }
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    } catch {
      setLoading(false);
    }

    // Clean up real-time listener on unmount.
    return () => {
      unsubscribe();
    };
  }, [id, user]);

  // Send a new text message directly to Cloud Firestore.
  async function sendMessage() {
    if (!inputText.trim() || !id || !user) return;
    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const firestore = getSafeFirestore();
      await addDoc(collection(firestore, 'chats', id, 'messages'), {
        senderId: user.uid,
        senderName: profile?.name || 'LinkWorks Member',
        text: textToSend,
        createdAt: serverTimestamp(),
        readBy: [user.uid],
      });

      await updateDoc(doc(firestore, 'chats', id), {
        lastMessage: textToSend,
        lastAt: serverTimestamp(),
      });
    } catch (cause) {
      console.warn('[LinkWorks Chat] Could not send message to Cloud Firestore:', cause);
    } finally {
      setSending(false);
    }
  }

  // Upload photo attachment message directly to Cloud Firestore.
  async function sendHardwarePhoto() {
    if (!id || !user) return;
    try {
      const firestore = getSafeFirestore();
      await addDoc(collection(firestore, 'chats', id, 'messages'), {
        senderId: user.uid,
        senderName: profile?.name || 'LinkWorks Member',
        text: 'Attaching hardware photo for reference:',
        photoCaption: 'Hardware Spec Attachment',
        createdAt: serverTimestamp(),
        readBy: [user.uid],
      });

      await updateDoc(doc(firestore, 'chats', id), {
        lastMessage: 'Attaching hardware photo for reference:',
        lastAt: serverTimestamp(),
      });
    } catch (cause) {
      console.warn('[LinkWorks Chat] Could not send photo attachment to Cloud Firestore:', cause);
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header Navigation Row */}
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>

          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarLetter}>{otherName.charAt(0).toUpperCase()}</Text>
            <View style={styles.headerOnlineDot} />
          </View>

          <View style={styles.headerInfo}>
            <Text numberOfLines={1} style={styles.headerTitle}>{otherName}</Text>
            <Text numberOfLines={1} style={styles.headerSubtitle}>
              {otherRole}
            </Text>
          </View>

          {otherPhone ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Call ${otherName}`}
              onPress={() => { void Linking.openURL(`tel:${otherPhone}`); }}
              style={({ pressed }) => [styles.callIconBtn, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.callIconText}>📞</Text>
            </Pressable>
          ) : null}
        </View>

        {/* Persistent Pinned Job / Inquiry Context Banner */}
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (id.startsWith('direct_')) {
              if (targetWorkerId) {
                router.push({ pathname: '/worker/[id]', params: { id: targetWorkerId } });
              }
            } else {
              router.push({ pathname: '/job/[id]', params: { id } });
            }
          }}
          style={styles.jobContextBanner}
        >
          <View style={styles.jobBannerLeft}>
            <View style={styles.jobBannerIconBox}>
              <Text style={styles.jobBannerIcon}>{id.startsWith('direct_') ? '💬' : '🛠️'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.jobBannerTitle}>{jobTitle}</Text>
              <Text style={styles.jobBannerSub}>
                {id.startsWith('direct_')
                  ? 'Direct inquiry • Tap to view public profile'
                  : `Agreed Rate: LKR ${agreedPrice}`}
              </Text>
            </View>
          </View>

          <View style={styles.jobBannerRight}>
            <View style={styles.jobBannerStatusPill}>
              <Text style={styles.jobBannerStatusText}>
                {jobStatus.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.jobBannerDetailsLink}>
              {id.startsWith('direct_') ? 'Profile →' : 'Details →'}
            </Text>
          </View>
        </Pressable>

        {/* Date Timestamp Divider */}
        <View style={styles.dateDivider}>
          <Text style={styles.dateDividerText}>TODAY</Text>
        </View>

        {/* Message Thread List */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={styles.loadingText}>Loading messages…</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.messageList, messages.length === 0 && styles.emptyListContent]}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Direct Messaging Active</Text>
                <Text style={styles.emptySubtitle}>
                  {id.startsWith('direct_')
                    ? 'Start the conversation! Discuss your service needs, availability, and job scope directly with this tradesperson.'
                    : 'This job has been assigned. You can now coordinate schedule, location details, and materials in real time.'}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageRow,
                  item.isSelf ? styles.selfRow : styles.otherRow,
                ]}
              >
                {!item.isSelf && (
                  <View style={styles.bubbleAvatar}>
                    <Text style={styles.bubbleAvatarLetter}>
                      {otherName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}

                <View
                  style={[
                    styles.messageBubble,
                    item.isSelf ? styles.selfBubble : styles.otherBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      item.isSelf ? styles.selfText : styles.otherText,
                    ]}
                  >
                    {item.text}
                  </Text>

                  {/* Optional Hardware Photo Attachment Card */}
                  {item.photoCaption && (
                    <View style={styles.photoAttachmentCard}>
                      <View style={styles.photoPlaceholderBox}>
                        <Text style={styles.photoCameraIcon}>📷</Text>
                        <Text style={styles.photoAttachmentLabel}>Hardware Spec Attachment</Text>
                      </View>
                      <Text style={styles.photoCaptionText}>{item.photoCaption}</Text>
                    </View>
                  )}

                  <View style={styles.bubbleFooter}>
                    {item.createdAtText ? (
                      <Text
                        style={[
                          styles.timeText,
                          item.isSelf ? styles.selfTime : styles.otherTime,
                        ]}
                      >
                        {item.createdAtText}
                      </Text>
                    ) : null}
                    {item.isSelf && <Text style={styles.readTicks}> ✓✓</Text>}
                  </View>
                </View>
              </View>
            )}
          />
        )}

        {/* Bottom Chat Input Bar */}
        <View style={styles.inputBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Attach photo"
            onPress={sendHardwarePhoto}
            style={styles.attachmentButton}
          >
            <Text style={styles.attachmentIcon}>📷</Text>
          </Pressable>

          <TextInput
            placeholder="Type a message…"
            placeholderTextColor="#8aa096"
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
            style={[
              styles.sendButton,
              (!inputText.trim() || sending) && styles.sendDisabled,
            ]}
          >
            {sending ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.sendIcon}>➤</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f0',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eaf4f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: palette.primary,
    fontWeight: '700',
  },
  headerAvatar: {
    position: 'relative',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e6f1ec',
    borderWidth: 1.5,
    borderColor: '#c6dfd4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarLetter: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '800',
    color: palette.primary,
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    color: palette.heading,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  headerSubtitle: {
    color: '#055b49',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
  callIconBtn: {
    backgroundColor: '#e6f7ef',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c6e7d9',
  },
  callIconText: {
    fontSize: 16,
  },
  jobContextBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f4faf7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dcece4',
  },
  jobBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  jobBannerIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d2e5dd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobBannerIcon: {
    fontSize: 14,
  },
  jobBannerTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: palette.heading,
  },
  jobBannerSub: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: palette.primary,
    fontWeight: '600',
  },
  jobBannerRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  jobBannerStatusPill: {
    backgroundColor: '#e6f7ef',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  jobBannerStatusText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '800',
    color: '#055b49',
  },
  jobBannerDetailsLink: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: palette.primary,
    fontWeight: '700',
  },
  dateDivider: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dateDividerText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '700',
    color: '#8da49b',
    backgroundColor: '#f0f5f2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    letterSpacing: 0.5,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: palette.muted,
    marginTop: 8,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  selfRow: {
    justifyContent: 'flex-end',
  },
  otherRow: {
    justifyContent: 'flex-start',
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e6f1ec',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c6dfd4',
  },
  bubbleAvatarLetter: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '800',
    color: palette.primary,
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selfBubble: {
    backgroundColor: palette.primary,
    borderBottomRightRadius: 4,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  otherBubble: {
    backgroundColor: '#f7fbf9',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2ece7',
  },
  messageText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    lineHeight: 20,
  },
  selfText: {
    color: '#ffffff',
  },
  otherText: {
    color: '#1e2d27',
  },
  photoAttachmentCard: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#d8e8e0',
  },
  photoPlaceholderBox: {
    height: 90,
    backgroundColor: '#edf5f1',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoCameraIcon: {
    fontSize: 24,
  },
  photoAttachmentLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    color: palette.muted,
  },
  photoCaptionText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '700',
    color: palette.heading,
    marginTop: 6,
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 2,
  },
  timeText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
  },
  selfTime: {
    color: '#c2dfd5',
  },
  otherTime: {
    color: '#8da49b',
  },
  readTicks: {
    fontSize: 10,
    color: '#95d5c0',
    fontWeight: '700',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#edf2f0',
    gap: 8,
  },
  attachmentButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f0f7f4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d2e5dd',
  },
  attachmentIcon: {
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    backgroundColor: '#f8faf9',
    borderRadius: 21,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderWidth: 1.5,
    borderColor: '#d2e2db',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: palette.heading,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  sendDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 2,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '700',
    color: palette.heading,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: palette.muted,
    textAlign: 'center',
    lineHeight: 19,
  },
});
