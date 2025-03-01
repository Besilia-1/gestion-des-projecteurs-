const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    // Récupérer le token dans l'en-tête Authorization
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
    }

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded; // Attacher l'utilisateur à req.user
        next(); // Passer à la suite
    } catch (err) {
        res.status(403).json({ message: "Token invalide." });
    }
};

module.exports = authMiddleware;
