import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { register } from '../../api';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Σφάλμα', 'Όλα τα πεδία είναι υποχρεωτικά');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Σφάλμα', 'Μη έγκυρο email');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Σφάλμα', 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες');
      return;
    }
    try {
      await register(name, email, password);
      navigation.navigate('Login');
    } catch (err: any) {
      Alert.alert('Σφάλμα', err.response?.data?.error || 'Κάτι πήγε στραβά');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Theatre App</Text>
        <Text style={styles.subtitle}>Δημιουργία λογαριασμού</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Όνομα</Text>
        <TextInput style={styles.input} placeholder="Το όνομά σου" placeholderTextColor="#888" value={name} onChangeText={setName} />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="example@email.com" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Εγγραφή</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Έχεις ήδη λογαριασμό; <Text style={styles.loginHighlight}>Σύνδεση</Text></Text>
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
  label: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#0f0f1a', color: '#fff', borderRadius: 8, padding: 12, fontSize: 15, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#c9a227', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#0f0f1a', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  loginLink: { alignItems: 'center', marginTop: 16 },
  loginText: { color: '#888', fontSize: 14 },
  loginHighlight: { color: '#c9a227', fontWeight: 'bold' },
});