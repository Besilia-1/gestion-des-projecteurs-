const db = require('../models/db');// Assurez-vous que ce chemin pointe bien vers votre fichier de configuration de base de données

// Ajouter une réservation
const addReservation = (req, res) => {
    const { projectorId, userId, startTime, endTime } = req.body;
    
    // Vérifiez si le projecteur est déjà réservé pour cette période
    db.get('SELECT * FROM reservations WHERE projector_id = ? AND (start_time < ? AND end_time > ?)', 
        [projectorId, endTime, startTime], (err, row) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur serveur', error: err });
            }
            if (row) {
                return res.status(400).json({ message: 'Le projecteur est déjà réservé pendant cette période' });
            }

            // Ajouter la réservation dans la base de données
            const query = `INSERT INTO reservations (projector_id, user_id, start_time, end_time)
                           VALUES (?, ?, ?, ?)`;
            db.run(query, [projectorId, userId, startTime, endTime], function(err) {
                if (err) {
                    return res.status(500).json({ message: 'Erreur lors de la réservation', error: err });
                }
                return res.status(201).json({ message: 'Réservation ajoutée', reservationId: this.lastID });
            });
        });
};

// Obtenir toutes les réservations
const getReservations = (req, res) => {
    const query = 'SELECT * FROM reservations';

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur', error: err });
        }
        return res.status(200).json({ reservations: rows });
    });
};

module.exports = { addReservation, getReservations };
