const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const registerUser = (req, res) => {
    const { email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    db.run(query, [email, hashedPassword, role], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Erreur d\'ajout de l\'utilisateur', error: err.message });
        }
        res.status(201).json({ message: 'Utilisateur enregistré', userId: this.lastID });
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Connexion réussie', token });
    });
};

module.exports = { registerUser, loginUser };
