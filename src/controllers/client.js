const { Client } = require("../models/client");

exports.enregistrerClient = async (req, res) => {
    try {
        const client = await Client.create(req.body);
        res.status(201).json({ message: "Client enregistré", data: client });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.listerClients = async (req, res) => {
    try {
        const clients = await Client.find().sort({ dateCreation: -1 });
        res.status(200).json({ message: "Liste des clients", data: clients });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.supprimerClient = async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Client supprimé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.modifierClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Client modifié", data: client });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
