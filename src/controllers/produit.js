const { Produit } = require("../models/produit");
const { gererErreur } = require("../utils/gererErreur");

exports.enregistrerProduit = async (req, res) => {
    try {
        const { nom, description, prix, quantite, categorie } = req.body ?? {};
        const produit = await Produit.create({ nom, description, prix, quantite, categorie });
        res.status(201).json({ message: "Produit enregistré", data: produit });
    } catch (error) {
        gererErreur(res, error);
    }
};

exports.listerProduits = async (req, res) => {
    try {
        const produits = await Produit.find().populate("categorie").sort({ dateCreation: -1 });
        res.status(200).json({ message: "Liste des produits", data: produits });
    } catch (error) {
        gererErreur(res, error);
    }
};

exports.supprimerProduit = async (req, res) => {
    try {
        const produit = await Produit.findByIdAndDelete(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: "Produit introuvable" });
        }
        res.status(200).json({ message: "Produit supprimé" });
    } catch (error) {
        gererErreur(res, error);
    }
};

exports.modifierProduit = async (req, res) => {
    try {
        const produit = await Produit.findByIdAndUpdate(req.params.id, req.body ?? {}, { new: true, runValidators: true });
        if (!produit) {
            return res.status(404).json({ message: "Produit introuvable" });
        }
        res.status(200).json({ message: "Produit modifié", data: produit });
    } catch (error) {
        gererErreur(res, error);
    }
};
