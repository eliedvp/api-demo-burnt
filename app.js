const express = require('express');
require('dotenv/config');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");


const app = express();
const env = process.env;

app.use(bodyParser.json());


const categorieRoutes = require('./src/routes/categorie');


app.use('/api/categories', categorieRoutes);


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