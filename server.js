// Import des modules nécessaires
const express = require('express');
const app = express();
const Database = require('better-sqlite3');
const cors = require('cors');

const PORT = process.env.PORT || 3000; // Définit 3000 pour les tests locaux si `PORT` n'est pas défini

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

// Utiliser express.json() pour les données JSON
app.use(express.json());
// Utiliser express.urlencoded() pour les données de formulaire encodées
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.static('public'));

// Initialisation de la base de données SQLite avec better-sqlite3
const db = new Database('./database.sqlite', { verbose: console.log });

// Création des tables dans la base de données et insertion des données de test
db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    );

    CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price INTEGER,
        max_speed INTEGER,
        storage_capacity INTEGER,
        category_id INTEGER,
        sub_category TEXT,
        image_url TEXT,
        FOREIGN KEY (category_id) REFERENCES categories(id)
    );
    
    INSERT OR IGNORE INTO categories (name) VALUES ('Sportive'), ('SUV'), ('4x4');
    
    INSERT OR IGNORE INTO vehicles (name, price, max_speed, storage_capacity, category_id, sub_category, image_url)
    VALUES ('Ferrari F8', 250000, 320, 2, 1, 'Sportive', 'https://example.com/ferrari.jpg'),
           ('Lamborghini Huracan', 300000, 340, 2, 1, 'Sportive', 'https://example.com/huracan.jpg'),
           ('Range Rover', 80000, 220, 5, 2, 'SUV', 'https://example.com/range_rover.jpg'),
           ('Jeep Wrangler', 40000, 200, 4, 3, '4x4', 'https://example.com/jeep.jpg');
`);

// Routes pour l'API

// Route pour obtenir tous les véhicules
app.get('/api/vehicles', (req, res) => {
    const vehicles = db.prepare("SELECT * FROM vehicles").all();
    res.json({ vehicles });
});

// Route pour ajouter un véhicule
app.post('/api/vehicles', (req, res) => {
    const { name, price, max_speed, storage_capacity, category_id, sub_category, image_url } = req.body;
    const stmt = db.prepare(`
        INSERT INTO vehicles (name, price, max_speed, storage_capacity, category_id, sub_category, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, price, max_speed, storage_capacity, category_id, sub_category || null, image_url);
    res.status(201).json({ id: info.lastInsertRowid });
});

// Route pour supprimer un véhicule
app.delete('/api/vehicles/:id', (req, res) => {
    const vehicleId = req.params.id;
    const stmt = db.prepare(`DELETE FROM vehicles WHERE id = ?`);
    const info = stmt.run(vehicleId);
    if (info.changes === 0) {
        return res.status(404).json({ error: 'Véhicule non trouvé' });
    }
    res.json({ message: `Véhicule avec ID ${vehicleId} supprimé` });
});

// Route pour obtenir toutes les catégories
app.get('/api/categories', (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json({ categories });
});

// Route pour ajouter une catégorie
app.post('/api/categories', (req, res) => {
    const { name } = req.body;
    const stmt = db.prepare(`INSERT INTO categories (name) VALUES (?)`);
    const info = stmt.run(name);
    res.status(201).json({ id: info.lastInsertRowid });
});