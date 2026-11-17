const { Client } = require("../models/client");
const { gererErreur } = require("../utils/gererErreur");

exports.enregistrerClient = async (req, res) => {
    try {
        const client = await Client.create(req.body ?? {});
        res.status(201).json({ message: "Client enregistré", data: client });
    } catch (error) {
        gererErreur(res, error);
    }
};

exports.listerClients = async (req, res) => {
    try {
        const clients = await Client.find().sort({ dateCreation: -1 });
        res.status(200).json({ message: "Liste des clients", data: clients });
    } catch (error) {
        gererErreur(res, error);
    }
};

exports.supprimerClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({ message: "Client introuvable" });
        }
        res.status(200).json({ message: "Client supprimé" });
    } catch (error) {
        gererErreur(res, error);
    }
};

exports.modifierClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body ?? {}, { new: true, runValidators: true });
        if (!client) {
            return res.status(404).json({ message: "Client introuvable" });
        }
        res.status(200).json({ message: "Client modifié", data: client });
    } catch (error) {
        gererErreur(res, error);
    }
};
