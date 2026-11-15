import { collection, getDocs, query, where } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { useAuth } from '../../Yasiru/Auth/AuthContext';
import { getSafeFirestore } from '../../Yasiru/Auth/firebase';

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

// Fallback demo chats matching the LinkWorks mockup.
const DEMO_CHATS: ChatListItem[] = [
  {
    id: 'job-colombo-kitchen-pipe',
    jobId: 'job-colombo-kitchen-pipe',
    jobTitle: 'Fix Main Water Leak & Pressure Pump',
    jobStatus: 'assigned',
    lastMessage: 'Here is the high-pressure brass valve I will be installing:',
    otherPartyName: 'Sunil Perera',
    otherPartyRole: 'Worker',
    unreadCount: 1,
    lastAt: '10:22 AM',
  },
  {
    id: 'job-moratuwa-door-frame',
    jobId: 'job-moratuwa-door-frame',
    jobTitle: 'Install 2 solid teak door frames',
    jobStatus: 'in_progress',
    lastMessage: 'Door frame leveling is completed. Starting hinge fittings.',
    otherPartyName: 'Pradeep Silva',
    otherPartyRole: 'Worker',
    unreadCount: 0,
    lastAt: 'Yesterday',
  },
];

// Screen listing all active job-linked conversations for the signed-in user.
export default function ChatListScreen() {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
        const db = getSafeFirestore();
        const snapshot = await getDocs(
          query(collection(db, 'chats'), where('participants', 'array-contains', user.uid))
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
              otherPartyName: otherInfo?.name || (isClient ? 'Sunil Perera' : 'Kamal Perera'),
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

  const filteredChats = chats.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.otherPartyName.toLowerCase().includes(q) || c.jobTitle.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
  });

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>LINKWORKS MESSAGING</Text>
          <Text style={styles.heading}>Job Messages</Text>
          <Text style={styles.subtitle}>Direct communication with your assigned tradespeople</Text>
        </View>

        {/* Search Input Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search conversations by name or job…"
            placeholderTextColor="#8aa096"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </Pressable>
          )}
        </View>

        {loading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={styles.stateText}>Loading your conversations…</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={loadChats} style={styles.retryBtn}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </Pressable>
          </View>
        ) : filteredChats.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>No Active Conversations</Text>
            <Text style={styles.stateText}>
              Job chat unlocks automatically as soon as a quote is accepted and a worker is assigned.
            </Text>
          </View>
        ) : (
          filteredChats.map((chat) => (
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
                  <View style={styles.onlineDot} />
                </View>

                <View style={styles.chatInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.partyName} numberOfLines={1}>{chat.otherPartyName}</Text>
                    {chat.lastAt ? <Text style={styles.timeText}>{chat.lastAt}</Text> : null}
                  </View>

                  <View style={styles.jobBadgeRow}>
                    <Text style={styles.jobBadge} numberOfLines={1}>
                      🛠️ {chat.jobTitle}
                    </Text>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusPillText}>
                        {chat.jobStatus.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                  </View>
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
    backgroundColor: '#ffffff',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 4,
  },
  eyebrow: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    fontFamily: 'Plus Jakarta Sans',
  },
  heading: {
    color: palette.heading,
    fontSize: 26,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  subtitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: palette.muted,
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faf9',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#d2e2db',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 4,
    marginBottom: 8,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: palette.heading,
    paddingVertical: 6,
  },
  clearSearch: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '700',
    padding: 4,
  },
  chatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e2ece7',
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  pressed: {
    opacity: 0.92,
    backgroundColor: '#fafefc',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e6f1ec',
    borderWidth: 1.5,
    borderColor: '#c6dfd4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '800',
    color: palette.primary,
  },
  onlineDot: {
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
  chatInfo: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partyName: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '800',
    color: palette.heading,
    flex: 1,
  },
  timeText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: '#8aa096',
    fontWeight: '600',
  },
  jobBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobBadge: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: palette.primary,
    fontWeight: '700',
    flex: 1,
  },
  statusPill: {
    backgroundColor: '#e6f7ef',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPillText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 9,
    fontWeight: '800',
    color: '#055b49',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f5f2',
    gap: 8,
  },
  lastMessageText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: '#344454',
    flex: 1,
    lineHeight: 18,
  },
  unreadBadge: {
    backgroundColor: palette.primary,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  unreadText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
  },
  stateBox: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2ece7',
    marginVertical: 16,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 17,
    fontWeight: '800',
    color: palette.heading,
  },
  stateText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: palette.muted,
    textAlign: 'center',
    lineHeight: 19,
  },
  errorText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: palette.danger,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#eaf4f0',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
  },
  retryBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: palette.primary,
  },
});
