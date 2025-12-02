import { StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Spacer } from '../../components/Spacer';
import { ThemedButton } from '../../components/ThemedButton';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { useUser } from '../../hooks/useUser';
import ThemedLoader from '../../components/ThemedLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Login = () => {
  const { user, authChecked, login } = useUser();
  const router = useRouter();

  const [userId, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Nếu đã login thì chuyển sang eforms
  useEffect(() => {
    if (authChecked && user) router.replace('/eforms');
  }, [user, authChecked]);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login({ userId, password });

      if (res.success) {
        const token = res.token;
        console.log("Token từ backend login:", token);
        console.log('Login thành công, token:', token);

        // Lưu token cho cả web và mobile
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('token', token);
            console.log('💾 Token saved to localStorage');
          }
          await AsyncStorage.setItem('token', token);
          console.log('💾 Token saved to AsyncStorage');
        } catch (storageErr) {
          console.error('⚠️ Lỗi lưu token:', storageErr);
        }

        // Chuyển tới eforms thay vì profile
        router.replace('/eforms');
      } else {
        setErrorMsg(res.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setErrorMsg(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked || (authChecked && user)) return <ThemedLoader />;

  return (
    <ThemedView style={styles.container}>
      <Spacer />
      <ThemedText title={true} style={styles.title}>
        Đăng Nhập
      </ThemedText>
      <Spacer height={50} />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <ThemedTextInput
        style={styles.input}
        placeholder="ID"
        keyboardType="numeric"
        onChangeText={setId}
        value={userId}
        autoCapitalize="none"
      />
      <ThemedTextInput
        style={styles.input}
        placeholder="Mật Khẩu"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      <Spacer height={40} />

      <ThemedButton onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <Text style={{ color: '#fff' }}>Đang đăng nhập...</Text>
        ) : (
          <Text style={{ color: '#fff' }}>Đăng Nhập</Text>
        )}
      </ThemedButton>

      <Spacer />
      <Spacer height={100} />

      {/* <Link href="/register">
        <ThemedText style={{ textAlign: 'center' }}>Đăng ký</ThemedText>
      </Link> */}
    </ThemedView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 30,
  },
  input: {
    width: '80%',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.8,
  },
  error: {
    color: Colors.warning,
    padding: 10,
    backgroundColor: '#f5c1c8',
    borderColor: Colors.warning,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 10,
    textAlign: 'center',
    marginBottom: 15,
  },
});
