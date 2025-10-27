const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produit');

router.post('/enregistrer-produit', produitController.enregistrerProduit);
router.get('/lister-produits', produitController.listerProduits);
router.delete('/supprimer-produit/:id', produitController.supprimerProduit);
router.put('/modifier-produit/:id', produitController.modifierProduit);

module.exports = router;
