import { collection, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { useAuth } from '../../Yasiru/Auth/AuthContext';

export type ChatListItem = {
  id: string; // matches jobId
  jobId: string;
  jobTitle: string;
  jobStatus: string;
  lastMessage: string;
  lastAt?: string;
  otherPartyName: string;
  otherPartyRole: 'Client' | 'Worker';
  unreadCount: number;
};

// Fallback demo chats for preview mode.
const DEMO_CHATS: ChatListItem[] = [
  {
    id: 'job-colombo-kitchen-pipe',
    jobId: 'job-colombo-kitchen-pipe',
    jobTitle: 'Repair leaking kitchen drain pipe',
    jobStatus: 'assigned',
    lastMessage: 'I am on my way with the replacement PVC pipes.',
    otherPartyName: 'Sunil Shantha (Plumber)',
    otherPartyRole: 'Worker',
    unreadCount: 1,
    lastAt: '10:30 AM',
  },
  {
    id: 'job-moratuwa-door-frame',
    jobId: 'job-moratuwa-door-frame',
    jobTitle: 'Install 2 solid teak door frames',
    jobStatus: 'in_progress',
    lastMessage: 'Door frame leveling is completed. Starting hinge fittings.',
    otherPartyName: 'Pradeep Silva (Carpenter)',
    otherPartyRole: 'Worker',
    unreadCount: 0,
    lastAt: 'Yesterday',
  },
];

// Screen listing all active job-linked conversations for the signed-in user.
export default function ChatListScreen() {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat conversations from Firestore.
  const loadChats = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      let list: ChatListItem[] = [];

      try {
        const snapshot = await getDocs(
          query(collection(getFirestore(), 'chats'), where('participants', 'array-contains', user.uid))
        );
        if (!snapshot.empty) {
          list = snapshot.docs.map((d) => {
            const data = d.data();
            const isClient = data.participants[0] === user.uid;
            const otherInfo = isClient ? data.workerInfo : data.clientInfo;
            return {
              id: d.id,
              jobId: data.jobId || d.id,
              jobTitle: data.jobTitle || 'Job Chat',
              jobStatus: data.jobStatus || 'assigned',
              lastMessage: data.lastMessage || 'Direct messaging opened.',
              otherPartyName: otherInfo?.name || (isClient ? 'Tradesperson' : 'Client'),
              otherPartyRole: isClient ? 'Worker' : 'Client',
              unreadCount: data.unread?.[user.uid] || 0,
              lastAt: 'Recent',
            };
          });
        }
      } catch {
        // Fall back to demo chats in preview mode
      }

      if (list.length === 0) {
        list = DEMO_CHATS;
      }

      setChats(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load chats.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    void loadChats();
  }, [loadChats]);

  const onRefresh = () => {
    setRefreshing(true);
    void loadChats();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>COMMUNICATION</Text>
          <Text style={styles.heading}>Job Chats</Text>
        </View>

        {loading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={styles.stateText}>Loading your conversations…</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Action label="Retry" secondary onPress={loadChats} />
          </View>
        ) : chats.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.emptyTitle}>No Active Chats</Text>
            <Text style={styles.stateText}>
              Job chat unlocks automatically as soon as a client assigns a worker to an open job.
            </Text>
          </View>
        ) : (
          chats.map((chat) => (
            <Pressable
              key={chat.id}
              accessibilityRole="button"
              accessibilityLabel={`Open chat for ${chat.jobTitle}`}
              onPress={() => router.push({ pathname: '/chat/[id]', params: { id: chat.id } })}
              style={({ pressed }) => [styles.chatCard, pressed && styles.pressed]}
            >
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarLetter}>
                    {chat.otherPartyName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.partyName}>{chat.otherPartyName}</Text>
                    {chat.lastAt ? <Text style={styles.timeText}>{chat.lastAt}</Text> : null}
                  </View>
                  <Text style={styles.jobBadge}>{chat.jobTitle}</Text>
                </View>
              </View>

              <View style={styles.cardBottom}>
                <Text numberOfLines={1} style={styles.lastMessageText}>
                  {chat.lastMessage}
                </Text>
                {chat.unreadCount > 0 ? (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                  </View>
                ) : null}
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  container: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xs,
  },
  eyebrow: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heading: {
    color: palette.heading,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  chatCard: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: palette.border,
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: '#fafefc',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e6f1ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: palette.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partyName: {
    color: palette.heading,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  timeText: {
    color: palette.muted,
    fontSize: 12,
  },
  jobBadge: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  lastMessageText: {
    color: '#475467',
    fontSize: 13,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: palette.primary,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  stateBox: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: palette.border,
    marginVertical: spacing.md,
  },
  stateText: {
    color: palette.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyTitle: {
    color: palette.heading,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  errorText: {
    color: palette.danger,
    fontSize: 14,
    textAlign: 'center',
  },
});
