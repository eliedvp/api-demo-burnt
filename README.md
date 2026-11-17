# API de démonstration — catégories, produits, clients

API REST construite avec Express et Mongoose pour gérer un petit catalogue :
des **catégories**, des **produits** rattachés à une catégorie et des **clients**.

## Fonctionnalités

- CRUD (création, liste, modification, suppression) pour les catégories, produits et clients
- Produits liés à leur catégorie (`populate` Mongoose lors de la liste)
- Validation par les schémas Mongoose (champs obligatoires, email client unique)
- Réponses d'erreur explicites : `400` (données ou identifiant invalides, JSON mal formé), `404` (ressource introuvable), `409` (email déjà utilisé), `500` sans détail interne
- Tests automatisés sans base de données (modèles simulés) et intégration continue GitHub Actions

## Stack

- Node.js, Express 5
- MongoDB, Mongoose 8
- dotenv
- Jest et supertest (tests)

## Installation et lancement

Prérequis : Node.js 20 ou plus récent et une base MongoDB (locale ou MongoDB Atlas).

```bash
npm install
cp .env.example .env   # puis renseigner MONGO_URI
npm start              # ou npm run dev (rechargement automatique avec nodemon)
```

Le serveur écoute par défaut sur `http://localhost:3000`.

## Variables d'environnement

| Variable    | Obligatoire | Description                                   | Défaut      |
|-------------|-------------|-----------------------------------------------|-------------|
| `MONGO_URI` | oui         | Chaîne de connexion MongoDB                   | —           |
| `PORT`      | non         | Port d'écoute                                 | `3000`      |
| `HOSTNAME`  | non         | Nom d'hôte affiché dans le message de démarrage | `localhost` |

Le serveur s'arrête avec un message explicite si `MONGO_URI` est absente.

## Endpoints

Toutes les réponses sont au format JSON (`{ message, data }`).

| Méthode | Route                                      | Description                       |
|---------|--------------------------------------------|-----------------------------------|
| POST    | `/api/categories/enregistrer-categorie`    | Créer une catégorie (`libelle` requis, `description`) |
| GET     | `/api/categories/lister-categories`        | Lister les catégories (plus récentes d'abord) |
| PUT     | `/api/categories/modifier-categorie/:id`   | Modifier une catégorie            |
| DELETE  | `/api/categories/supprimer-categorie/:id`  | Supprimer une catégorie           |
| POST    | `/api/produits/enregistrer-produit`        | Créer un produit (`nom`, `prix`, `categorie` requis ; `description`, `quantite`) |
| GET     | `/api/produits/lister-produits`            | Lister les produits avec leur catégorie |
| PUT     | `/api/produits/modifier-produit/:id`       | Modifier un produit               |
| DELETE  | `/api/produits/supprimer-produit/:id`      | Supprimer un produit              |
| POST    | `/api/clients/enregistrer-client`          | Créer un client (`nom`, `prenom`, `email` requis ; `telephone`) |
| GET     | `/api/clients/lister-clients`              | Lister les clients                |
| PUT     | `/api/clients/modifier-client/:id`         | Modifier un client                |
| DELETE  | `/api/clients/supprimer-client/:id`        | Supprimer un client               |

Exemple :

```bash
curl -X POST http://localhost:3000/api/categories/enregistrer-categorie \
  -H "Content-Type: application/json" \
  -d '{"libelle": "Boissons", "description": "Boissons fraîches"}'
```

## Tests

```bash
npm test
```

Les tests (Jest + supertest) appellent les routes de l'application en simulant les modèles Mongoose : aucune base MongoDB n'est nécessaire. Ils sont exécutés à chaque push par GitHub Actions (`.github/workflows/ci.yml`).

## Structure

```
app.js              # configuration Express, routes et démarrage
src/
  controllers/      # logique des routes
  models/           # schémas Mongoose
  routes/           # définition des routes
  utils/            # gestion centralisée des erreurs
tests/              # tests d'API
```
