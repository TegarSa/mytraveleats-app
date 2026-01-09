import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { auth } from '../../lib/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isError, setIsError] = useState(true);

  const showToast = (message: string, error = true) => {
    setSnackbarMessage(message);
    setIsError(error);
    setSnackbarVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Semua field harus diisi');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const res = await fetch('http://192.168.18.34:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Login berhasil!', false);
        setTimeout(() => {
          router.replace('/home');
        }, 1000);
      } else {
        showToast(data.error || 'Login gagal');
      }
    } catch (err: any) {
      const code = err.code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        showToast('Email atau password salah');
      } else if (code === 'auth/invalid-email') {
        showToast('Format email tidak valid');
      } else if (code === 'auth/too-many-requests') {
        showToast('Terlalu banyak percobaan, coba lagi nanti');
      } else if (code === 'auth/network-request-failed') {
        showToast('Koneksi internet terputus');
      } else {
        showToast('Gagal terhubung ke server');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1e3c72', '#3b82f6', '#bfdbfe']} style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.card}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Login</Text>
        </View>

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

        <TouchableOpacity activeOpacity={0.85} onPress={handleLogin} disabled={loading}>
          <LinearGradient colors={['#2563eb', '#3b82f6']} style={styles.button}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>LOGIN</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.link} onPress={() => router.push('../register')}>
          Belum punya akun? <Text style={styles.linkBold}>Daftar</Text>
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
