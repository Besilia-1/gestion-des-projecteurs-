const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// Route protégée : récupérer le profil utilisateur
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Profil utilisateur récupéré avec succès", user: req.user });
});

module.exports = router;
