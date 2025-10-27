const { Produit } = require("../models/produit");

exports.enregistrerProduit = async (req, res) => {
    try {
        const { nom, description, prix, quantite, categorie } = req.body;
        const produit = await Produit.create({ nom, description, prix, quantite, categorie });
        res.status(201).json({ message: "Produit enregistré", data: produit });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.listerProduits = async (req, res) => {
    try {
        const produits = await Produit.find().populate("categorie").sort({ dateCreation: -1 });
        res.status(200).json({ message: "Liste des produits", data: produits });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.supprimerProduit = async (req, res) => {
    try {
        await Produit.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Produit supprimé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.modifierProduit = async (req, res) => {
    try {
        const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Produit modifié", data: produit });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
