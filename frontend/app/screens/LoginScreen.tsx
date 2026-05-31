import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { login } from '../../api';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email και password είναι υποχρεωτικά');
      return;
    }
    try {
      const res = await login(email, password);
      await AsyncStorage.setItem('token', res.data.token);
      navigation.replace('Theatres');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Λάθος email ή password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Theatre App</Text>
        <Text style={styles.subtitle}>Κράτηση θέσεων online</Text>
      </View>
      <View style={styles.form}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="example@email.com" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Σύνδεση</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.loginText}>Δεν έχεις λογαριασμό; <Text style={styles.loginHighlight}>Εγγραφή</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  appName: { fontSize: 36, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  subtitle: { fontSize: 14, color: '#c9a227', marginTop: 6, letterSpacing: 1 },
  form: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 24 },
  error: { color: '#e74c3c', fontSize: 13, marginBottom: 10, textAlign: 'center' },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#0f0f1a', color: '#fff', borderRadius: 8, padding: 12, fontSize: 15, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#c9a227', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#0f0f1a', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  loginLink: { alignItems: 'center', marginTop: 16 },
  loginText: { color: '#888', fontSize: 14 },
  loginHighlight: { color: '#c9a227', fontWeight: 'bold' },
});