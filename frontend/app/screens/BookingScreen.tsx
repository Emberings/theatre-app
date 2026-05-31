import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createReservation, getShowtimes } from '../../api';

export default function BookingScreen({ navigation, route }: any) {
  const { show } = route.params;
  const [showtimes, setShowtimes] = useState([]);
  const [selected, setSelected] = useState<any>(null);
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    loadShowtimes();
  }, []);

  const loadShowtimes = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await getShowtimes(token!, show.show_id);
      setShowtimes(res.data);
    } catch (err) {
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η φόρτωση ωραρίων');
    }
  };

  const handleBook = async () => {
    if (!selected) {
      Alert.alert('Σφάλμα', 'Επίλεξε ημερομηνία/ώρα');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      await createReservation(token!, selected.showtime_id, seats);
      Alert.alert('Επιτυχία', 'Η κράτηση ολοκληρώθηκε!');
      navigation.navigate('Reservations');
    } catch (err) {
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η κράτηση');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('el-GR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.showInfo}>
        <Text style={styles.showTitle}>{show.title}</Text>
        <Text style={styles.showDesc}>{show.description}</Text>
        <View style={styles.showMeta}>
          <Text style={styles.metaText}>⏱ {show.duration} λεπτά</Text>
          <Text style={styles.metaText}>👤 {show.age_rating}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Επίλεξε Ημερομηνία & Ώρα</Text>
      <FlatList
        data={showtimes}
        keyExtractor={(item: any) => item.showtime_id.toString()}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={[styles.card, selected?.showtime_id === item.showtime_id && styles.cardSelected]}
            onPress={() => setSelected(item)}>
            <View style={styles.cardLeft}>
              <Text style={[styles.cardDate, selected?.showtime_id === item.showtime_id && styles.textSelected]}>
                {formatDate(item.show_date)}
              </Text>
              <Text style={[styles.cardTime, selected?.showtime_id === item.showtime_id && styles.textSelected]}>
                🕐 {item.show_time}
              </Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={[styles.cardPrice, selected?.showtime_id === item.showtime_id && styles.textSelected]}>
                {item.price}€
              </Text>
              <Text style={[styles.cardSeats, selected?.showtime_id === item.showtime_id && styles.textSelected]}>
                {item.available_seats} θέσεις
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.sectionTitle}>Αριθμός Θέσεων</Text>
      <View style={styles.seatsRow}>
        <TouchableOpacity style={styles.seatBtn} onPress={() => setSeats(Math.max(1, seats - 1))}>
          <Text style={styles.seatBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.seatsCount}>{seats}</Text>
        <TouchableOpacity style={styles.seatBtn} onPress={() => setSeats(seats + 1)}>
          <Text style={styles.seatBtnText}>+</Text>
        </TouchableOpacity>
        {selected && (
          <Text style={styles.totalPrice}>
            Σύνολο: {(seats * selected.price).toFixed(2)}€
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleBook}>
        <Text style={styles.buttonText}>Ολοκλήρωση Κράτησης</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20 },
  showInfo: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 15, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#c9a227' },
  showTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  showDesc: { fontSize: 13, color: '#888', marginBottom: 10 },
  showMeta: { flexDirection: 'row', gap: 15 },
  metaText: { color: '#c9a227', fontSize: 13 },
  sectionTitle: { fontSize: 14, color: '#aaa', marginBottom: 10, marginTop: 5, letterSpacing: 1 },
  card: { backgroundColor: '#1a1a2e', borderRadius: 10, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#333' },
  cardSelected: { backgroundColor: '#c9a227', borderColor: '#c9a227' },
  cardLeft: { flex: 1 },
  cardRight: { alignItems: 'flex-end' },
  cardDate: { fontSize: 14, color: '#fff', fontWeight: 'bold' },
  cardTime: { fontSize: 13, color: '#aaa', marginTop: 4 },
  cardPrice: { fontSize: 18, fontWeight: 'bold', color: '#c9a227' },
  cardSeats: { fontSize: 12, color: '#888', marginTop: 4 },
  textSelected: { color: '#0f0f1a' },
  seatsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  seatBtn: { backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#c9a227', width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  seatBtnText: { color: '#c9a227', fontSize: 22, fontWeight: 'bold' },
  seatsCount: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginHorizontal: 20 },
  totalPrice: { fontSize: 16, color: '#c9a227', fontWeight: 'bold', marginLeft: 'auto' },
  button: { backgroundColor: '#c9a227', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#0f0f1a', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});