import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="screens/RegisterScreen" options={{ title: 'Εγγραφή' }} />
      <Stack.Screen name="screens/TheatresScreen" options={{ title: 'Θέατρα' }} />
      <Stack.Screen name="screens/ReservationsScreen" options={{ title: 'Κρατήσεις' }} />
    </Stack>
  );
}