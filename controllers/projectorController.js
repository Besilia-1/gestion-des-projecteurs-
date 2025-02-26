const db = require('../models/db');

const addProjector = (req, res) => {
    const { name, status, available } = req.body;
    const query = 'INSERT INTO projectors (name, status, available) VALUES (?, ?, ?)';
    db.run(query, [name, status, available], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Erreur d\'ajout du projecteur', error: err.message });
        }
        res.status(201).json({ message: 'Projecteur ajouté', projectorId: this.lastID });
    });
};

module.exports = { addProjector };
