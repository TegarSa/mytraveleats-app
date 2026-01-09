import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isError, setIsError] = useState(true);

  const showToast = (message: string, error = true) => {
    setSnackbarMessage(message);
    setIsError(error);
    setSnackbarVisible(true);
  };

  const handleRegister = async () => {
    if (!email || !password || !username || !fullname) {
      showToast('Semua field harus diisi');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://192.168.18.34:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, fullname }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Registrasi berhasil!', false);

        setEmail('');
        setPassword('');
        setUsername('');
        setFullname('');

        setTimeout(() => {
          router.replace('/login');
        }, 1500);
      } else {
        showToast(data.message || 'Gagal registrasi');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1e3c72', '#3b82f6', '#bfdbfe']} style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.card}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Register</Text>
        </View>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#94a3b8"
          value={fullname}
          onChangeText={setFullname}
          style={styles.input}
        />

        <TextInput
          placeholder="Username"
          placeholderTextColor="#94a3b8"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          value={email}
          autoCapitalize="none"
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity activeOpacity={0.85} onPress={handleRegister} disabled={loading}>
          <LinearGradient colors={['#2563eb', '#3b82f6']} style={styles.button}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>DAFTAR</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.link} onPress={() => router.replace('../login')}>
          Sudah punya akun? <Text style={styles.linkBold}>Login</Text>
        </Text>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        wrapperStyle={styles.snackbarWrapper}
        style={[styles.snackbarBase, { backgroundColor: isError ? '#e11d48' : '#10b981' }]}
      >
        <View style={styles.snackbarContent}>
          <Ionicons 
            name={isError ? "alert-circle" : "checkmark-circle"} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.snackbarText}>{snackbarMessage}</Text>
        </View>
      </Snackbar>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 12,
  },
  titleWrapper: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#fff',
    borderColor: '#3b82f6',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  input: {
    backgroundColor: '#f8fafc',
    padding: 14,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  link: {
    marginTop: 18,
    textAlign: 'center',
    color: '#475569',
  },
  linkBold: {
    color: '#2563eb',
    fontWeight: '600',
  },
  snackbarWrapper: {
    top: 50,
    bottom: undefined,
  },
  snackbarBase: {
    borderRadius: 12,
    marginHorizontal: 15,
    elevation: 10,
  },
  snackbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  snackbarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
