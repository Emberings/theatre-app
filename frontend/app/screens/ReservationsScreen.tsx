import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cancelReservation, getReservations } from '../../api';

export default function ReservationsScreen({ navigation }: any) {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await getReservations(token!);
      setReservations(res.data);
    } catch (err) {
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η φόρτωση κρατήσεων');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await cancelReservation(token!, id);
      Alert.alert('Επιτυχία', 'Η κράτηση ακυρώθηκε');
      loadReservations();
    } catch (err) {
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η ακύρωση');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('el-GR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {reservations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎭</Text>
          <Text style={styles.emptyTitle}>Δεν έχεις κρατήσεις</Text>
          <Text style={styles.emptySubtitle}>Κάνε κράτηση για να δεις τις παραστάσεις σου εδώ</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Βρες Παράσταση</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={reservations}
            keyExtractor={(item: any) => item.reservation_id.toString()}
            renderItem={({ item }: any) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.showTitle}>{item.title}</Text>
                  <View style={[styles.statusBadge, item.status === 'active' ? styles.statusActive : styles.statusCancelled]}>
                    <Text style={styles.statusText}>{item.status === 'active' ? 'Ενεργή' : 'Ακυρωμένη'}</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>📅 Ημερομηνία</Text>
                  <Text style={styles.infoValue}>{formatDate(item.show_date)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>🕐 Ώρα</Text>
                  <Text style={styles.infoValue}>{item.show_time}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>💺 Θέσεις</Text>
                  <Text style={styles.infoValue}>{item.seats_reserved}</Text>
                </View>
                {item.status === 'active' && (
                  <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item.reservation_id)}>
                    <Text style={styles.cancelText}>Ακύρωση Κράτησης</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Πίσω στα Θέατρα</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 60, marginBottom: 20 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 30 },
  card: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 15, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  showTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff', flex: 1 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusActive: { backgroundColor: '#27ae60' },
  statusCancelled: { backgroundColor: '#e74c3c' },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#333', marginBottom: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  infoLabel: { color: '#888', fontSize: 13 },
  infoValue: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#e74c3c', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  cancelText: { color: '#fff', fontWeight: 'bold' },
  button: { backgroundColor: '#c9a227', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#0f0f1a', fontSize: 16, fontWeight: 'bold' },
});