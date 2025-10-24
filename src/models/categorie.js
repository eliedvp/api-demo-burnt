const { Schema, model } = require("mongoose");



const categorieSchema = Schema({
    libelle: { type: String, required: true },
    description: { type: String },
    dateCreation: { type: Date, default: Date.now }
});

categorieSchema.set('toJSON', {virtuals: true});
categorieSchema.set('toObject', {virtuals: true});

exports.Categorie = model("Categorie", categorieSchema);