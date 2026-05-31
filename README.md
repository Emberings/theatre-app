# Theatre App

Εφαρμογή κράτησης θέσεων σε θεατρικές παραστάσεις, αναπτυγμένη στο πλαίσιο της εργασίας CN6035.

## Τεχνολογίες
- **Frontend**: React Native (Expo)
- **Backend**: Node.js + Express.js
- **Database**: MariaDB

## Λειτουργίες
- Εγγραφή και σύνδεση χρηστών (JWT Authentication)
- Προβολή θεάτρων και παραστάσεων
- Κράτηση θέσεων
- Ιστορικό και ακύρωση κρατήσεων
- Αναζήτηση θεάτρων

## Εγκατάσταση

### Προαπαιτούμενα
- Node.js
- MariaDB
- Expo CLI

### Backend
```bash
cd backend
npm install
```

Δημιούργησε αρχείο `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=theatre_db
JWT_SECRET=your_secret_key
PORT=3000
```

```bash
node index.js
```

### Frontend
```bash
cd frontend
npm install
npx expo start --web
```

## API Endpoints
| Method | Endpoint | Περιγραφή |
|--------|----------|-----------|
| POST | /api/auth/register | Εγγραφή χρήστη |
| POST | /api/auth/login | Σύνδεση χρήστη |
| GET | /api/theatres | Λίστα θεάτρων |
| GET | /api/shows | Λίστα παραστάσεων |
| GET | /api/reservations | Κρατήσεις χρήστη |
| POST | /api/reservations | Νέα κράτηση |
| DELETE | /api/reservations/:id | Ακύρωση κράτησης |
