  import axios from 'axios';

  const API_URL = 'http://localhost:3000/api';

  export const register = (name: string, email: string, password: string) =>
    axios.post(`${API_URL}/auth/register`, { name, email, password });

  export const login = (email: string, password: string) =>
    axios.post(`${API_URL}/auth/login`, { email, password });

  export const getTheatres = (token: string) =>
    axios.get(`${API_URL}/theatres`, { headers: { authorization: token } });

  export const getShows = (token: string) =>
    axios.get(`${API_URL}/shows`, { headers: { authorization: token } });

  export const getShowtimes = (token: string, showId: number) =>
    axios.get(`${API_URL}/shows/${showId}/showtimes`, { headers: { authorization: token } });

  export const getReservations = (token: string) =>
    axios.get(`${API_URL}/reservations`, { headers: { authorization: token } });

  export const createReservation = (token: string, showtime_id: number, seats_reserved: number) =>
    axios.post(`${API_URL}/reservations`, { showtime_id, seats_reserved }, { headers: { authorization: token } });

  export const cancelReservation = (token: string, id: number) =>
    axios.delete(`${API_URL}/reservations/${id}`, { headers: { authorization: token } });