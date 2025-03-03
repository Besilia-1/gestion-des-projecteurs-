const jwt = require('jsonwebtoken');

// Middleware pour vérifier l'authentification
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer invalid_token ', ''); // On récupère le token depuis l'en-tête Authorization

    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide.' });
        }

        req.user = decoded; // On attache les données utilisateur à la requête
        next(); // On passe au prochain middleware ou à la route
    });
};

module.exports = authenticateToken;
