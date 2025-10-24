const { Categorie } = require("../models/categorie");



exports.enregistrerCategorie = async (req, res) => {
    try {
        // console.log(req.body);
        const { libelle , description } = req.body;

        const nouvelleCategorieEnregistree = await Categorie.create({
            libelle,
            description
        });

        return res.status(201).json({
            message: "Catégorie enregistrée avec succès",
            data: nouvelleCategorieEnregistree
        });
        

    } catch (error) {

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
        
    }
}

exports.supprimerCategorie = async (req, res) => {
    try {
        const { id } = req.params;
        await Categorie.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Catégorie supprimée avec succès"
        }); 
    } catch (error) {
        
    }   
}


exports.modifierCategorie = async (req, res) => {
    try {
        const { id } = req.params;
        const { libelle , description } = req.body;
        const categorieModifiee = await Categorie.findByIdAndUpdate(id, {
            libelle,
            description
        }, { new: true });
        return res.status(200).json({
            message: "Catégorie modifiée avec succès",
            data: categorieModifiee
        });
    } catch (error) {
        
    }
}