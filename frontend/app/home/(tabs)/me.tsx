import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView, SafeAreaView, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      setEmail(user.email || '');
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setUsername(data.username || '');
        setProfilePhoto(data.profilePhoto || null);
      }
    };
    fetchProfile();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    setProfilePhoto(uri);
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), { profilePhoto: uri });
  };

  const saveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), { username });
    setEditing(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/login');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return (
    <LinearGradient colors={['#f0f9ff', '#bae6fd', '#60a5fa']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Profile</Text>
          </View>

          <View style={styles.photoSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: profilePhoto || 'https://via.placeholder.com/120' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userNameHeader}>{username || 'User'}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Username</Text>
              <View style={[styles.inputWrapper, editing && styles.editingInput]}>
                <Ionicons name="person-outline" size={20} color="#64748b" />
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  editable={editing}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapperDisabled}>
                <Ionicons name="mail-outline" size={20} color="#94a3b8" />
                <Text style={styles.disabledText}>{email}</Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapperDisabled}>
                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                <Text style={styles.disabledText}>
                  {showPassword ? 'password123' : '••••••••'}
                </Text>
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.actionSection}>
            {editing ? (
              <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
                <Text style={styles.saveText}>Save Changes</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
                <Ionicons name="create-outline" size={20} color="#2563eb" />
                <Text style={styles.editText}>Edit Profile</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },

  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },

  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },

  avatarWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#fff',
    padding: 5,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    backgroundColor: '#2563eb',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },

  userNameHeader: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 15,
  },

  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
    marginLeft: 4,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
  },

  inputWrapperDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(241, 245, 249, 0.7)',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
  },

  editingInput: {
    borderWidth: 1.5,
    borderColor: '#2563eb',
  },

  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },

  disabledText: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#94a3b8',
  },

  eyeBtn: {
    padding: 5,
  },

  actionSection: {
    marginTop: 30,
    paddingHorizontal: 20,
    gap: 15,
  },

  editBtn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  editText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 16,
  },

  saveBtn: {
    backgroundColor: '#2563eb',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(254, 226, 226, 0.7)',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  logoutText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 16,
  },
});
