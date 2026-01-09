import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const SLIDER_DATA = [
  { id: '1', title: 'Minuman Segar', subtitle: 'Nikmati kopi dan minuman favoritmu', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500' },
  { id: '2', title: 'Tour Kuliner Lokal', subtitle: 'Eksplor rasa autentik', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500' },
  { id: '3', title: 'Kuliner Favorit', subtitle: 'Cicipi hidangan lezat dan autentik', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500' },
];

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [username, setUsername] = useState(''); 
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUsername(data.username || 'User');
        setPhotoURL(data.profilePhoto || user.photoURL || 'https://via.placeholder.com/60'); 
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  fetchUserData();

    const interval = setInterval(() => {
      if (activeIndex < SLIDER_DATA.length - 1) {
        flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
      } else {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const menuItems = [
    { id: '1', title: 'Location', icon: 'location-outline', route: '/home/location', color: '#2563eb' },
    { id: '2', title: 'Drinks', icon: 'beer-outline', route: '/home/drinks', color: '#2563eb' },
    { id: '3', title: 'Review', icon: 'camera-outline', route: null, color: '#2563eb' },
    { id: '4', title: 'Booking', icon: 'restaurant-outline', route: null, color: '#2563eb' },
    { id: '5', title: 'Food', icon: 'cart-outline', route: '/home/food', color: '#60a5fa' },
    { id: '6', title: 'Coupon', icon: 'ticket-outline', route: null, color: '#60a5fa' },
    { id: '7', title: 'About', icon: 'information-circle-outline', route: '/home/about', color: '#60a5fa' },
    { id: '8', title: 'Support', icon: 'headset-outline', route: null, color: '#60a5fa' },
  ];

  return (
    <LinearGradient
       colors={['#f0f9ff', '#bae6fd', '#60a5fa']}
      style={{ flex: 1 }}
    >
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.topSection}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Halo!,</Text>
              <Text style={styles.username}>{username}</Text>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}></Text>
              </View>
            </View>
            <Image source={{ uri: photoURL }} style={styles.avatar} />
          </View>

          <View style={styles.walletCard}>
            <View style={styles.walletRow}>
              <Ionicons name="wallet-outline" size={20} color="#000" />
              <Text style={styles.walletLabel}>MY BALANCE</Text>
            </View>
            <Text style={styles.walletAmount}>Rp. 500.000,00</Text>
            <TouchableOpacity>
              <Text style={styles.tapHistory}>Tap for history</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={SLIDER_DATA}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const contentOffset = e.nativeEvent.contentOffset.x;
              const index = Math.round(contentOffset / width);
              setActiveIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={styles.slideItem}>
                <Image source={{ uri: item.image }} style={styles.slideImage} />
                <View style={styles.slideOverlay}>
                   <Text style={styles.slideTitle}>{item.title}</Text>
                   <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
            )}
          />
          <View style={styles.dotContainer}>
            {SLIDER_DATA.map((_, i) => (
              <View key={i} style={[styles.dot, { opacity: activeIndex === i ? 1 : 0.3 }]} />
            ))}
          </View>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((menu) => (
            <View key={menu.id} style={styles.menuWrapper}>
              <TouchableOpacity
                disabled={!menu.route}
                onPress={() => {
                  if (!menu.route) return;
                  router.push({ pathname: menu.route as any });
                }}
                style={[
                  styles.menuIconCircle,
                  {
                    backgroundColor: menu.color,
                    opacity: menu.route ? 1 : 0.5,
                  },
                ]}
              >
                <Ionicons
                  name={menu.icon as any}
                  size={28}
                  color="#fff"
                />
              </TouchableOpacity>

              <Text style={styles.menuTitle}>{menu.title}</Text>
              {!menu.route && (
                <Text style={{ fontSize: 10, color: '#475569' }}>Soon</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>What's New</Text>
        </View>
        <View style={styles.newsCard}>
          <View style={styles.newsTextContainer}>
            <Text style={styles.newsSource}>MyTravel Journal</Text>
            <Text style={styles.newsTitle}>5 Tempat Makan Tersembunyi di Yogyakarta yang Wajib Turis Kunjungi</Text>
            <Text style={styles.newsDesc}>Temukan sensasi rasa lokal yang belum banyak diketahui orang...</Text>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300' }} 
            style={styles.newsImage} 
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>F.A.Q</Text>
        </View>
        <TouchableOpacity style={styles.faqCard}>
           <Text style={styles.faqText}>Bagaimana cara memesan tempat melalui aplikasi?</Text>
           <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.faqCard, { marginBottom: 40 }]}>
           <Text style={styles.faqText}>Apakah ada biaya tambahan untuk reservasi?</Text>
           <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topSection: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 80,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  greeting: {
    color: '#fff',
    fontSize: 18,
    opacity: 0.8,
  },

  username: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  rankBadge: {
    marginTop: 5,
  },

  rankText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },

  walletCard: {
    position: 'absolute',
    bottom: -40,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  walletLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },

  walletAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },

  tapHistory: {
    fontSize: 12,
    color: '#115E59',
    marginTop: 5,
  },

  carouselContainer: {
    marginTop: 60,
    marginBottom: 20,
  },

  slideItem: {
    width: width,
    paddingHorizontal: 20,
    position: 'relative',
  },

  slideImage: {
    width: '100%',
    height: 180,
    borderRadius: 20,
  },

  slideOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  slideTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  slideSubtitle: {
    color: '#fff',
    fontSize: 12,
  },

  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#115E59',
    marginHorizontal: 4,
  },

  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  menuWrapper: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 20,
  },

  menuIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  menuTitle: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },

  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  newsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },

  newsTextContainer: {
    flex: 1,
    paddingRight: 10,
  },

  newsSource: {
    fontSize: 10,
    color: '#115E59',
    fontWeight: 'bold',
    marginBottom: 5,
  },

  newsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  newsDesc: {
    fontSize: 12,
    color: '#666',
  },

  newsImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  faqCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    marginBottom: 10,
  },

  faqText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});
