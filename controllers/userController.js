const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db'); // Assurez-vous que le bon chemin est utilisé

console.log("DB Object:", db);
console.log("DB Methods:", Object.keys(db));

const registerUser = (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const validRoles = ['student', 'teacher', 'admin'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Rôle invalide. Utilisez: student, teacher, admin' });
    }

    const queryCheckEmail = 'SELECT * FROM users WHERE email = ?';
    db.get(queryCheckEmail, [email], (err, existingUser) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'email:', err);
            return res.status(500).json({ message: 'Erreur serveur', error: err.message });
        }
        if (existingUser) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
        db.run(query, [email, hashedPassword, role], function(err) {
            if (err) {
                console.error('Erreur d\'ajout de l\'utilisateur:', err);
                return res.status(500).json({ message: 'Erreur serveur', error: err.message });
            }
            res.status(201).json({ message: 'Utilisateur enregistré', userId: this.lastID });
        });
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], (err, user) => {
        if (err) {
            console.error('Erreur lors de la recherche de l\'utilisateur:', err);
            return res.status(500).json({ message: 'Erreur serveur', error: err.message });
        }
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ message: 'Connexion réussie', token });
    });
};

module.exports = { registerUser, loginUser };
