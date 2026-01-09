import { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function DrinksScreen() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('tea');
  const [drinks, setDrinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDrinks = async () => {
    if (!keyword.trim()) {
      setDrinks([]);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${keyword}`
      );
      const json = await res.json();
      setDrinks(json.drinks || []);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (keyword) {
      fetchDrinks();
    }
  }, []);

  return (
    <LinearGradient
      colors={['#f0f9ff', '#bae6fd', '#60a5fa']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </TouchableOpacity>
            <View>
              <Text style={styles.subtitle}>Premium Collections</Text>
              <Text style={styles.title}>Explore Drinks</Text>
            </View>
          </View>
          <View style={styles.filterBtn}>
            <Ionicons name="wine-outline" size={22} color="#1e293b" />
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Search drinks..."
              placeholderTextColor="#94a3b8"
              value={keyword}
              onChangeText={setKeyword}
              onSubmitEditing={fetchDrinks}
              style={styles.input}
            />
          </View>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : (
          <FlatList
            data={drinks}
            keyExtractor={(item) => item.idDrink}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              !loading && keyword !== '' ? (
                <Text style={styles.emptyText}>No drinks found</Text>
              ) : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.card}
                onPress={() => router.push(`/home/drinks/${item.idDrink}`)}
              >
                <Image source={{ uri: item.strDrinkThumb }} style={styles.image} />
                <View style={styles.info}>
                  <View>
                    <Text style={styles.categoryBadge}>{item.strCategory}</Text>
                    <Text style={styles.name} numberOfLines={1}>{item.strDrink}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.glassText}>{item.strGlass}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#2563eb" />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  subtitle: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '500',
    opacity: 0.7,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#1e293b',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    marginBottom: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563eb',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  glassText: {
    fontSize: 12,
    color: '#64748b',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#1e293b',
    fontWeight: '500',
  },
});