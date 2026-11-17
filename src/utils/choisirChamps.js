// Ne conserve que les champs autorisés (liste blanche) présents dans la source.
// Empêche l'injection d'opérateurs MongoDB ($unset, $rename...) ou de champs
// non prévus (dateCreation, _id...) via le corps de la requête.
exports.choisirChamps = (source, champsAutorises) => {
    const resultat = {};
    if (!source || typeof source !== "object") {
        return resultat;
    }
    for (const champ of champsAutorises) {
        if (Object.prototype.hasOwnProperty.call(source, champ) && source[champ] !== undefined) {
            resultat[champ] = source[champ];
        }
    }
    return resultat;
};
