// Import des modules nécessaires
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const PORT = process.env.PORT || 3000; // Définit 3000 pour les tests locaux si `PORT` n'est pas défini

// Utiliser express.json() pour les données JSON
app.use(express.json());
// Utiliser express.urlencoded() pour les données de formulaire encodées
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.static('public'));

// Initialisation de la base de données SQLite
const db = new sqlite3.Database('./database.sqlite');

// Création des tables dans la base de données
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price INTEGER,
        max_speed INTEGER,
        storage_capacity INTEGER,
        category_id INTEGER,
        sub_category TEXT,
        image_url TEXT,
        FOREIGN KEY (category_id) REFERENCES categories(id)
    )`);
});

// Routes pour l'API
// Route pour obtenir tous les véhicules
app.get('/api/vehicles', (req, res) => {
    db.all("SELECT * FROM vehicles", [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ vehicles: rows });
    });
});

// Route pour ajouter un véhicule
app.post('/api/vehicles', (req, res) => {
    const { name, price, max_speed, storage_capacity, category_id, sub_category, image_url } = req.body;

    const query = `INSERT INTO vehicles (name, price, max_speed, storage_capacity, category_id, sub_category, image_url)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [name, price, max_speed, storage_capacity, category_id, sub_category || null, image_url], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// Route pour supprimer un véhicule
app.delete('/api/vehicles/:id', (req, res) => {
    const vehicleId = req.params.id;
    db.run(`DELETE FROM vehicles WHERE id = ?`, vehicleId, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: `Véhicule avec ID ${vehicleId} supprimé` });
    });
});

// Route pour obtenir toutes les catégories
app.get('/api/categories', (req, res) => {
    db.all("SELECT * FROM categories", [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ categories: rows });
    });
});

// Route pour ajouter une catégorie
app.post('/api/categories', (req, res) => {
    const { name } = req.body;
    const query = `INSERT INTO categories (name) VALUES (?)`;
    db.run(query, [name], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

