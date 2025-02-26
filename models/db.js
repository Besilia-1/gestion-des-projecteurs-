const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'projector_management.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données SQLite:', err.message);
        return;
    }
    console.log('Connecté à la base de données SQLite');
});

// Création des tables
const createUsersTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'student'
        );
    `;
    db.run(query);
};

const createProjectorsTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS projectors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            status TEXT DEFAULT 'working',
            available INTEGER DEFAULT 1  -- Utiliser INTEGER pour BOOLEAN
        );
    `;
    db.run(query);
};

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
    db.run(query);
};

// Appeler les fonctions pour créer les tables
createUsersTable();
createProjectorsTable();
createReservationsTable();

module.exports = db;
