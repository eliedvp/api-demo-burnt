const { Schema, model } = require("mongoose");

const clientSchema = Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String },
    dateCreation: { type: Date, default: Date.now }
});

clientSchema.set('toJSON', { virtuals: true });
clientSchema.set('toObject', { virtuals: true });

exports.Client = model("Client", clientSchema);
