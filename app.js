const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const projectorRoutes = require('./routes/projectorRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Charger les variables d'environnement
dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projectors', projectorRoutes);
app.use('/api/reservations', reservationRoutes);


// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
