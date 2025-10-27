const { Schema, model } = require("mongoose");

const produitSchema = Schema({
    nom: { type: String, required: true },
    description: { type: String },
    prix: { type: Number, required: true },
    quantite: { type: Number, default: 0 },
    categorie: { type: Schema.Types.ObjectId, ref: "Categorie", required: true },
    dateCreation: { type: Date, default: Date.now }
});

produitSchema.set('toJSON', { virtuals: true });
produitSchema.set('toObject', { virtuals: true });

exports.Produit = model("Produit", produitSchema);
