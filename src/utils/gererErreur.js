const mongoose = require("mongoose");

// Convertit les erreurs Mongoose courantes en réponses HTTP adaptées
// et n'expose aucun détail interne pour les erreurs serveur.
exports.gererErreur = (res, error) => {
    if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: "Données invalides", error: error.message });
    }

    // Identifiant MongoDB mal formé ou valeur de type incorrect
    if (error instanceof mongoose.Error.CastError) {
        return res.status(400).json({ message: "Identifiant ou valeur invalide", error: error.message });
    }

    // Violation d'un index unique (ex. email client déjà utilisé)
    if (error && error.code === 11000) {
        return res.status(409).json({ message: "Cette ressource existe déjà", error: "Valeur déjà utilisée" });
    }

    console.error(error);
    return res.status(500).json({ message: "Erreur serveur", error: "Une erreur interne est survenue" });
};
