const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// Route protégée : récupérer le profil utilisateur
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Profil utilisateur récupéré avec succès", user: req.user });
});

// Route protégée pour les administrateurs uniquement
router.get("/admin", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
    res.json({ message: "Bienvenue, administrateur !" });
});

const reserveProjector = (req, res) => {
    const { projector_id, date, time } = req.body;
    const userId = req.user.userId; // L'utilisateur authentifié

    // Vérifier si le projecteur est disponible
    const queryCheckAvailability = 'SELECT available FROM projectors WHERE id = ?';
    db.get(queryCheckAvailability, [projector_id], (err, projector) => {
        if (err || !projector) {
            return res.status(404).json({ message: 'Projecteur non trouvé' });
        }
        if (projector.available === 0) {
            return res.status(400).json({ message: 'Le projecteur n\'est pas disponible' });
        }

        // Réserver le projecteur
        const queryReserve = 'INSERT INTO reservations (user_id, projector_id, date, time) VALUES (?, ?, ?, ?)';
        db.run(queryReserve, [userId, projector_id, date, time], function(err) {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de la réservation du projecteur', error: err.message });
            }

            // Marquer le projecteur comme réservé
            const queryUpdateProjector = 'UPDATE projectors SET available = 0 WHERE id = ?';
            db.run(queryUpdateProjector, [projector_id], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Erreur lors de la mise à jour du statut du projecteur', error: err.message });
                }
                res.status(201).json({ message: 'Réservation réussie' });
            });
        });
    });
};


module.exports = router;
