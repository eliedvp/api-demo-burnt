const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client');


router.post('/enregistrer-client', clientController.enregistrerClient);
router.get('/lister-clients', clientController.listerClients);
router.delete('/supprimer-client/:id', clientController.supprimerClient);
router.put('/modifier-client/:id', clientController.modifierClient);

module.exports = router;
