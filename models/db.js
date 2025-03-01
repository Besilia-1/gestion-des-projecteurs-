const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Spécifie le chemin vers la base de données SQLite
const dbPath = path.resolve(__dirname, 'projector_management.db');
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données SQLite:', err.message);
        return;
    }
    console.log('Connecté à la base de données SQLite');
});

// Création de la table users
const createUsersTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT CHECK(role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.run(query, function(err) {
        if (err) {
            console.error('Erreur lors de la création de la table users:', err.message);
        } else {
            console.log('Table "users" créée ou déjà existante');
        }
    });
};

// Création de la table projectors
const createProjectorsTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS projectors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            status TEXT DEFAULT 'working',
            available INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.run(query, function(err) {
        if (err) {
            console.error('Erreur lors de la création de la table projectors:', err.message);
        } else {
            console.log('Table "projectors" créée ou déjà existante');
        }
    });
};

// Création de la table reservations (sans created_at pour tester)
const createReservationsTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            projector_id INTEGER NOT NULL,
            date DATE NOT NULL,
            time TIME NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (projector_id) REFERENCES projectors(id)
        );
    `;
    db.run(query, function(err) {
        if (err) {
            console.error('Erreur lors de la création de la table reservations:', err.message);
        } else {
            console.log('Table "reservations" créée ou déjà existante');
        }
    });
};

// Appel des fonctions pour créer les tables
createUsersTable();
createProjectorsTable();
createReservationsTable();

// Vérifier la création des tables
db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des tables:', err.message);
        } else {
            console.log('Tables dans la base de données:', rows);
        }
    });
});

module.exports = db;
