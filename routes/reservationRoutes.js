const express = require('express');
const { addReservation, getReservations } = require('../controllers/reservationController');

const router = express.Router();

// Route pour ajouter une réservation
router.post('/', addReservation);

// Route pour obtenir toutes les réservations (par exemple)
router.get('/', getReservations);

module.exports = router;
