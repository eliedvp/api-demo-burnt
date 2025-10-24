const express = require('express'); 

const router = express.Router();

const categorieController = require('../controllers/categorie');

// creation des routes pour le module categorie ici

router.post('/enregistrer-categorie', categorieController.enregistrerCategorie);
router.get('/lister-categories', categorieController.listerCategories);
router.delete('/supprimer-categorie/:id', categorieController.supprimerCategorie);
router.put('/modifier-categorie/:id', categorieController.modifierCategorie);


module.exports = router;