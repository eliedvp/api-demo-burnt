const express = require('express');
require('dotenv/config');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");


const app = express();
const env = process.env;

app.use(bodyParser.json());


const categorieRoutes = require('./src/routes/categorie');
const produitRoutes = require('./src/routes/produit');
const clientRoutes = require('./src/routes/client');

app.use('/api/categories', categorieRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/clients', clientRoutes);

// JSON mal formé : réponse 400 au lieu de la page d'erreur par défaut (avec stack)
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: "Corps de requête JSON invalide" });
    }
    if (err.status >= 400 && err.status < 500) {
        return res.status(err.status).json({ message: "Requête invalide" });
    }
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur", error: "Une erreur interne est survenue" });
});

module.exports = app;

// Le serveur et la connexion MongoDB ne démarrent que si le fichier est exécuté
// directement (et non importé, par exemple par les tests).
if (require.main === module) {
    if (!env.MONGO_URI) {
        console.error("Variable d'environnement MONGO_URI manquante : copiez .env.example vers .env et renseignez-la.");
        process.exit(1);
    }

    const port = env.PORT || 3000;
    const hostname = env.HOSTNAME || 'localhost';

    mongoose.connect(env.MONGO_URI).then(() => {
        console.log('Connexion à la base de données réussie');
    }).catch((err) => {
        console.error('Erreur de connexion à la base de données:', err);
    });

    app.listen(port, () => {
        console.log(`Server démarré sur http://${hostname}:${port}`);
    });
}
