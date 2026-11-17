const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { Categorie } = require("../src/models/categorie");
const { Client } = require("../src/models/client");
const { Produit } = require("../src/models/produit");

// Aucun accès à une vraie base : les méthodes des modèles sont simulées.
const idValide = new mongoose.Types.ObjectId().toString();

afterEach(() => {
    jest.restoreAllMocks();
});

describe("Catégories", () => {
    it("liste les catégories", async () => {
        const categories = [{ libelle: "Boissons" }];
        const sort = jest.fn().mockResolvedValue(categories);
        const select = jest.fn().mockReturnValue({ sort });
        jest.spyOn(Categorie, "find").mockReturnValue({ select });

        const res = await request(app).get("/api/categories/lister-categories");

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(categories);
        expect(sort).toHaveBeenCalledWith({ dateCreation: -1 });
    });

    it("enregistre une catégorie valide", async () => {
        jest.spyOn(Categorie, "create").mockResolvedValue({ libelle: "Boissons", description: "Froides" });

        const res = await request(app)
            .post("/api/categories/enregistrer-categorie")
            .send({ libelle: "Boissons", description: "Froides" });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Catégorie enregistrée avec succès");
        expect(Categorie.create).toHaveBeenCalledWith({ libelle: "Boissons", description: "Froides" });
    });

    it("refuse une catégorie sans libellé (400)", async () => {
        // Pas de mock : la validation du schéma échoue avant tout accès à la base.
        const res = await request(app)
            .post("/api/categories/enregistrer-categorie")
            .send({ description: "Sans libellé" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Données invalides");
    });

    it("renvoie 400 pour un JSON mal formé", async () => {
        const res = await request(app)
            .post("/api/categories/enregistrer-categorie")
            .set("Content-Type", "application/json")
            .send("{mauvais json");

        expect(res.status).toBe(400);
    });

    it("renvoie 400 pour un identifiant invalide", async () => {
        const res = await request(app).delete("/api/categories/supprimer-categorie/abc");

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Identifiant ou valeur invalide");
    });

    it("renvoie 404 si la catégorie à supprimer n'existe pas", async () => {
        jest.spyOn(Categorie, "findByIdAndDelete").mockResolvedValue(null);

        const res = await request(app).delete(`/api/categories/supprimer-categorie/${idValide}`);

        expect(res.status).toBe(404);
    });

    it("modifie une catégorie existante", async () => {
        jest.spyOn(Categorie, "findByIdAndUpdate").mockResolvedValue({ libelle: "Nouveau" });

        const res = await request(app)
            .put(`/api/categories/modifier-categorie/${idValide}`)
            .send({ libelle: "Nouveau" });

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({ libelle: "Nouveau" });
        expect(Categorie.findByIdAndUpdate).toHaveBeenCalledWith(
            idValide,
            { libelle: "Nouveau", description: undefined },
            { new: true, runValidators: true }
        );
    });

    it("n'expose pas le détail d'une erreur serveur", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        jest.spyOn(Categorie, "find").mockImplementation(() => {
            throw new Error("détail interne");
        });

        const res = await request(app).get("/api/categories/lister-categories");

        expect(res.status).toBe(500);
        expect(JSON.stringify(res.body)).not.toContain("détail interne");
    });
});

describe("Clients", () => {
    it("liste les clients", async () => {
        const sort = jest.fn().mockResolvedValue([{ nom: "Kouassi" }]);
        jest.spyOn(Client, "find").mockReturnValue({ sort });

        const res = await request(app).get("/api/clients/lister-clients");

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
    });

    it("renvoie 409 si l'email est déjà utilisé", async () => {
        const erreurDoublon = Object.assign(new Error("E11000 duplicate key"), { code: 11000 });
        jest.spyOn(Client, "create").mockRejectedValue(erreurDoublon);

        const res = await request(app)
            .post("/api/clients/enregistrer-client")
            .send({ nom: "Kouassi", prenom: "Ama", email: "ama@example.com" });

        expect(res.status).toBe(409);
    });

    it("renvoie 404 si le client à modifier n'existe pas", async () => {
        jest.spyOn(Client, "findByIdAndUpdate").mockResolvedValue(null);

        const res = await request(app)
            .put(`/api/clients/modifier-client/${idValide}`)
            .send({ telephone: "0102030405" });

        expect(res.status).toBe(404);
    });

    it("ignore les opérateurs MongoDB et les champs inconnus lors d'une modification", async () => {
        jest.spyOn(Client, "findByIdAndUpdate").mockResolvedValue({ telephone: "0102030405" });

        const res = await request(app)
            .put(`/api/clients/modifier-client/${idValide}`)
            .send({ telephone: "0102030405", $unset: { email: "" }, $rename: { nom: "x" }, dateCreation: "2000-01-01", role: "admin" });

        expect(res.status).toBe(200);
        expect(Client.findByIdAndUpdate).toHaveBeenCalledWith(
            idValide,
            { telephone: "0102030405" },
            { new: true, runValidators: true }
        );
    });

    it("ignore les champs inconnus lors d'une création", async () => {
        jest.spyOn(Client, "create").mockResolvedValue({ nom: "Kouassi" });

        const res = await request(app)
            .post("/api/clients/enregistrer-client")
            .send({ nom: "Kouassi", prenom: "Ama", email: "ama@example.com", $unset: { email: "" }, role: "admin" });

        expect(res.status).toBe(201);
        expect(Client.create).toHaveBeenCalledWith({ nom: "Kouassi", prenom: "Ama", email: "ama@example.com" });
    });
});

describe("Produits", () => {
    it("liste les produits avec leur catégorie", async () => {
        const sort = jest.fn().mockResolvedValue([{ nom: "Jus" }]);
        const populate = jest.fn().mockReturnValue({ sort });
        jest.spyOn(Produit, "find").mockReturnValue({ populate });

        const res = await request(app).get("/api/produits/lister-produits");

        expect(res.status).toBe(200);
        expect(populate).toHaveBeenCalledWith("categorie");
    });

    it("refuse un produit sans prix ni catégorie (400)", async () => {
        const res = await request(app)
            .post("/api/produits/enregistrer-produit")
            .send({ nom: "Jus" });

        expect(res.status).toBe(400);
    });

    it("supprime un produit existant", async () => {
        jest.spyOn(Produit, "findByIdAndDelete").mockResolvedValue({ _id: idValide });

        const res = await request(app).delete(`/api/produits/supprimer-produit/${idValide}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Produit supprimé");
    });

    it("ignore les opérateurs MongoDB lors d'une modification", async () => {
        jest.spyOn(Produit, "findByIdAndUpdate").mockResolvedValue({ prix: 1500 });

        const res = await request(app)
            .put(`/api/produits/modifier-produit/${idValide}`)
            .send({ prix: 1500, $unset: { categorie: "" } });

        expect(res.status).toBe(200);
        expect(Produit.findByIdAndUpdate).toHaveBeenCalledWith(
            idValide,
            { prix: 1500 },
            { new: true, runValidators: true }
        );
    });
});
