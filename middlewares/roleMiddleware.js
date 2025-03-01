// Middleware pour vérifier les rôles
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Accès refusé. Rôle insuffisant.' });
        }
        next(); // L'utilisateur a le rôle requis, donc on passe à la route
    };
};

 module.exports = authorizeRole;

