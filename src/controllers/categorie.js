const { Categorie } = require("../models/categorie");
const { gererErreur } = require("../utils/gererErreur");



exports.enregistrerCategorie = async (req, res) => {
    try {
        const { libelle , description } = req.body ?? {};

        const nouvelleCategorieEnregistree = await Categorie.create({
            libelle,
            description
        });

        return res.status(201).json({
            message: "Catégorie enregistrée avec succès",
            data: nouvelleCategorieEnregistree
        });
        

    } catch (error) {
        return gererErreur(res, error);
    }
}

exports.listerCategories = async (req, res) => {
    try {
        const listeCategorie = await Categorie.find()
                                .select("libelle description  dateCreation")
                                .sort({ dateCreation: -1 });

        return res.status(200).json({
            message: "Liste des catégories récupérée avec succès",
            data: listeCategorie
        });


    } catch (error) {
        return gererErreur(res, error);
    }
}

exports.supprimerCategorie = async (req, res) => {
    try {
        const { id } = req.params;
        const categorieSupprimee = await Categorie.findByIdAndDelete(id);

        if (!categorieSupprimee) {
            return res.status(404).json({ message: "Catégorie introuvable" });
        }

        return res.status(200).json({
            message: "Catégorie supprimée avec succès"
        }); 
    } catch (error) {
        return gererErreur(res, error);
    }   
}


exports.modifierCategorie = async (req, res) => {
    try {
        const { id } = req.params;
        const { libelle , description } = req.body ?? {};
        const categorieModifiee = await Categorie.findByIdAndUpdate(id, {
            libelle,
            description
        }, { new: true, runValidators: true });

        if (!categorieModifiee) {
            return res.status(404).json({ message: "Catégorie introuvable" });
        }

        return res.status(200).json({
            message: "Catégorie modifiée avec succès",
            data: categorieModifiee
        });
    } catch (error) {
        return gererErreur(res, error);
    }
}
