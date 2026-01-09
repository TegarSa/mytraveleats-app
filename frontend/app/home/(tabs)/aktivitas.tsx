import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AktivitasSaya() {
  const [activities, setActivities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActivities = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setActivities((data.preferences?.lastVisited || []).slice().reverse());
      }
    } catch (error) {
      console.log('Error fetching activities:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      fetchActivities();
    });

    return () => unsubscribe();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  return (
    <LinearGradient colors={['#f0f9ff', '#bae6fd', '#60a5fa']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>Riwayat Jelajah</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.title}>Aktivitas Saya</Text>
            <Ionicons name="refresh-outline" size={24} color="#2563eb" onPress={handleRefresh} />
          </View>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : activities.length === 0 ? (
          <View style={styles.centerContainer}>
            <View style={styles.emptyCard}>
              <Ionicons name="receipt-outline" size={64} color="#60a5fa" />
              <Text style={styles.emptyText}>Belum ada aktivitas yang tercatat</Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={activities}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#2563eb" />
            }
            renderItem={({ item }) => (
              <View style={styles.activityCard}>
                <View style={styles.iconContainer}>
                  <Ionicons name="time-outline" size={22} color="#2563eb" />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{item}</Text>
                  <Text style={styles.activityTime}>Baru saja dikunjungi</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 50,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 45,
    height: 45,
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 15,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 40,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    opacity: 0.7,
  },
});
