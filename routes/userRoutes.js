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

module.exports = router;
