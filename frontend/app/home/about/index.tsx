import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView, } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AboutScreen() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const InfoDropdown = ({ id, title, content, icon }: any) => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={styles.dropdownHeader} 
        onPress={() => toggleDropdown(id)}
        activeOpacity={0.7}
      >
        <View style={styles.row}>
          <Ionicons name={icon} size={22} color="#2563eb" style={{ marginRight: 12 }} />
          <Text style={styles.dropdownTitle}>{title}</Text>
        </View>
        <Ionicons 
          name={expanded === id ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#94a3b8" 
        />
      </TouchableOpacity>
      
      {expanded === id && (
        <View style={styles.dropdownContent}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={['#f0f9ff', '#bae6fd', '#60a5fa']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <View>
            <Text style={styles.subtitle}>Our Story</Text>
            <Text style={styles.title}>About MyTravelEats</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.heroContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000' }} 
              style={styles.heroImage} 
            />
            <LinearGradient 
              colors={['transparent', 'rgba(0,0,0,0.4)']} 
              style={styles.imageOverlay} 
            />
          </View>

          <View style={styles.mainCard}>
            <View style={styles.brandSection}>
                <Ionicons name="restaurant" size={28} color="#2563eb" />
                <Text style={styles.brandName}>MyTravelEats</Text>
            </View>
            <Text style={styles.description}>
              Kami percaya bahwa perjalanan terbaik selalu melibatkan rasa yang otentik. 
              MyTravelEats dirancang untuk membantu Anda menemukan permata kuliner tersembunyi 
              di seluruh dunia dengan pengalaman yang eksklusif dan terkurasi.
            </Text>
          </View>

          <InfoDropdown 
            id="vision"
            icon="eye-outline"
            title="Our Vision"
            content="Menjadi jembatan utama bagi para penjelajah untuk merasakan keaslian kuliner lokal di setiap destinasi perjalanan mereka."
          />

          <InfoDropdown 
            id="contact"
            icon="mail-outline"
            title="Support & Contact"
            content="Hubungi tim bantuan kami melalui email di support@mytraveleats.com untuk pertanyaan atau kerja sama bisnis."
          />

          <InfoDropdown 
            id="version"
            icon="information-circle-outline"
            title="App Information"
            content="Version 1.0.0 - Premium Edition. Dibuat khusus untuk para pecinta kuliner dunia."
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 MyTravelEats Global</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 20,
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '500',
    opacity: 0.7,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    marginHorizontal: 20,
    height: 240,
    marginBottom: 25,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 3,
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e3a8a',
    marginLeft: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
  dropdownContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  dropdownContent: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  contentText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#1e40af',
    opacity: 0.6,
  },
});