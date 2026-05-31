require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const theatreRoutes = require('./routes/theatres');
const showRoutes = require('./routes/shows');
const reservationRoutes = require('./routes/reservations');

app.use('/api/auth', authRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});