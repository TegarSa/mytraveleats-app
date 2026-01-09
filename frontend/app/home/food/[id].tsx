import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { addUserActivity } from '@/lib/firestoreHelpers';

export default function FoodDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [food, setFood] = useState<any>(null);

  useEffect(() => {
  if (!id) return;

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((res) => res.json())
        .then((json) => {
        const detail = json.meals?.[0];
        setFood(detail);
        addUserActivity(detail.strMeal);
        });
  }, [id]);

  if (!food) return null;

  return (
    <View style={styles.mainContainer}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: food.strMealThumb }} style={styles.image} />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent']}
            style={styles.imageOverlay}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.headerInfo}>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {food.strCategory}
                </Text>
              </View>
              <View style={[styles.badge, styles.areaBadge]}>
                <Text style={styles.areaBadgeText}>
                  {food.strArea}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>{food.strMeal}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="book-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Instructions</Text>
            </View>
            <Text style={styles.instructionsText}>
              {food.strInstructions}
            </Text>
          </View>

          <View style={{ height: 50 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },

  imageContainer: {
    width: '100%',
    height: 350,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 100,
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -40,
    paddingHorizontal: 25,
    paddingTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  headerInfo: {
    marginBottom: 20,
  },

  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },

  badge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  areaBadge: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  areaBadgeText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 34,
  },

  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    width: '100%',
    marginBottom: 25,
  },

  sectionContainer: {
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },

  instructionsText: {
    fontSize: 15,
    lineHeight: 26,
    color: '#475569',
    textAlign: 'justify',
  },
});
