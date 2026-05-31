import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getTheatres } from '../../api';

export default function TheatresScreen({ navigation }: any) {
  const [theatres, setTheatres] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTheatres();
  }, []);

  const loadTheatres = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await getTheatres(token!);
      setTheatres(res.data);
    } catch (err) {
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η φόρτωση θεάτρων');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  const normalize = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const filtered = theatres.filter((t: any) =>
    normalize(t.name).includes(normalize(search)) ||
    normalize(t.location).includes(normalize(search))
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Θέατρα</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Έξοδος</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.search}
        placeholder="Αναζήτηση θεάτρου ή πόλης..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item: any) => item.theatre_id.toString()}
        renderItem={({ item }: any) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Shows', { theatre: item })}>
            <View style={styles.cardAccent} />
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.location}>📍 {item.location}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Reservations')}>
        <Text style={styles.buttonText}>Οι Κρατήσεις μου</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  logoutBtn: { backgroundColor: '#e74c3c', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  search: { backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 15, borderWidth: 1, borderColor: '#333' },
  card: { backgroundColor: '#1a1a2e', borderRadius: 12, marginBottom: 12, flexDirection: 'row', overflow: 'hidden' },
  cardAccent: { width: 4, backgroundColor: '#c9a227' },
  cardContent: { padding: 15, flex: 1 },
  name: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
  location: { fontSize: 13, color: '#c9a227', marginTop: 4 },
  description: { fontSize: 13, color: '#888', marginTop: 4 },
  button: { backgroundColor: '#c9a227', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#0f0f1a', fontSize: 16, fontWeight: 'bold' },
});