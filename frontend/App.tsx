import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import BookingScreen from './app/screens/BookingScreen';
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import ReservationsScreen from './app/screens/ReservationsScreen';
import ShowsScreen from './app/screens/ShowsScreen';
import TheatresScreen from './app/screens/TheatresScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.removeItem('token').then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
      <Text style={{ color: '#c9a227', fontSize: 24, fontWeight: 'bold' }}>TheatreApp</Text>
      <Text style={{ color: '#fff', marginTop: 10 }}>Φόρτωση...</Text>
    </View>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Theatres" component={TheatresScreen} options={{ title: 'TheatreApp' }} />
        <Stack.Screen name="Shows" component={ShowsScreen} options={{ title: 'Παραστάσεις' }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Κράτηση' }} />
        <Stack.Screen name="Reservations" component={ReservationsScreen} options={{ title: 'Κρατήσεις μου' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}