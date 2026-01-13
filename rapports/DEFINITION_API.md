# Définition d'API

**Projet:** MDD API  
**Author:** BUIAKOV Viktor (vikbuyakov@gmail.com)  
**Git:** [https://github.com/vbuyakov/ocr-java-angular-project-5](https://github.com/vbuyakov/ocr-java-angular-project-5)

## Configuration initiale

### Variables d'environnement

Avant de démarrer l'application, il est nécessaire de configurer les variables d'environnement :

1. **Copier le fichier `.env.example` vers `.env`** :

```bash
cp .env.example .env
```

2. **Configurer les variables d'environnement dans le fichier `.env`** :

- `SERVER_PORT` : Port du serveur (ex: 8080)
- `API_PATH` : Chemin de base de l'API (ex: /api)
- `MYSQL_DB_URL` : URL de connexion à la base de données MySQL (ex: jdbc:mysql://localhost:3306/mddapp)
- `MYSQL_USER` : Nom d'utilisateur de la base de données
- `MYSQL_PASSWORD` : Mot de passe de la base de données
- `MYSQL_DATABASE` : Nom de la base de données
- `JWT_SECRET_KEY` : Clé secrète pour la génération des tokens JWT
- `JWT_EXPIRATION_TIME` : Durée d'expiration des tokens JWT (ex: 7200000 pour 2h en millisecondes)

### Accès à la documentation Swagger

Une fois l'application démarrée, la documentation interactive de l'API est accessible via Swagger UI :

- **Swagger UI** : http://localhost/api/swagger-ui/index.html
- **OpenAPI JSON** : http://localhost/api/v3/api-docs

---

## Endpoints API

### Authentification

| URL | Méthode | Description | Params (path/query) | Body (JSON) | Status | Exemple de réponse |
| --- | --- | --- | --- | --- | --- | --- |
| `/api/auth/register` | POST | Créer un compte utilisateur | - | `{ "username": "string", "email": "string", "password": "string" }` | 201, 400, 409, 500 | `{ "message": "Inscription réussie" }` |
| `/api/auth/login` | POST | Authentifier un utilisateur | - | `{ "login": "string", "password": "string" }` | 200, 400, 401, 500 | `{ "token": "jwt_token" }` |

#### Détails des endpoints d'authentification

**POST `/api/auth/register`**

Créer un nouveau compte utilisateur.

- **Body** :
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

- **Validation** :
  - `username` : Obligatoire, non vide
  - `email` : Obligatoire, format email valide
  - `password` : Obligatoire, respecte les règles de validation (minimum 8 caractères, au moins une majuscule, une minuscule, un chiffre et un caractère spécial)

- **Réponses** :
  - `201 Created` : Utilisateur créé avec succès
    ```json
    {
      "message": "Inscription réussie"
    }
    ```
  - `400 Bad Request` : Données invalides
  - `409 Conflict` : Email ou username déjà utilisé
  - `500 Internal Server Error` : Erreur serveur

**POST `/api/auth/login`**

Authentifier un utilisateur et obtenir un token JWT.

- **Body** :
```json
{
  "login": "string",
  "password": "string"
}
```

- **Validation** :
  - `login` : Obligatoire, peut être l'email ou le username
  - `password` : Obligatoire

- **Réponses** :
  - `200 OK` : Authentification réussie
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - `400 Bad Request` : Données invalides
  - `401 Unauthorized` : Identifiants incorrects
  - `500 Internal Server Error` : Erreur serveur

---

### Sujets (Topics)

| URL | Méthode | Description | Params (path/query) | Body (JSON) | Status | Exemple de réponse |
| --- | --- | --- | --- | --- | --- | --- |
| `/api/topics` | GET | Récupérer tous les sujets avec statut d'abonnement | - | - | 200, 401, 500 | `[{ "id": 1, "name": "Angular", "description": "...", "isUserSubscribed": true, "createdAt": "2025/12/26", "updatedAt": "2025/12/26" }]` |
| `/api/topics/selector` | GET | Récupérer tous les sujets triés par nom (pour sélecteur) | - | - | 200, 500 | `[{ "id": 1, "name": "Angular" }]` |
| `/api/topics/{id}/subscribe` | POST | S'abonner à un sujet | `id` (path) | - | 204, 401, 404, 500 | - |
| `/api/topics/{id}/subscribe` | DELETE | Se désabonner d'un sujet | `id` (path) | - | 204, 401, 404, 500 | - |
| `/api/topics/subscribed` | GET | Récupérer les sujets auxquels l'utilisateur est abonné | - | - | 200, 401, 500 | `[{ "id": 1, "name": "Angular", ... }]` |

#### Détails des endpoints de sujets

**GET `/api/topics`**

Récupère la liste de tous les sujets disponibles avec le statut d'abonnement de l'utilisateur authentifié.

- **Authentification** : Requise (JWT)
- **Réponses** :
  - `200 OK` : Liste des sujets
    ```json
    [
      {
        "id": 1,
        "name": "Angular",
        "description": "Frontend framework by Google...",
        "isUserSubscribed": true,
        "createdAt": "2025/12/26",
        "updatedAt": "2025/12/26"
      }
    ]
    ```
  - `401 Unauthorized` : Token manquant ou invalide
  - `500 Internal Server Error` : Erreur serveur

**GET `/api/topics/selector`**

Récupère la liste de tous les sujets triés par nom, format simplifié pour les sélecteurs.

- **Authentification** : Non requise
- **Réponses** :
  - `200 OK` : Liste des sujets
    ```json
    [
      {
        "id": 1,
        "name": "Angular"
      }
    ]
    ```
  - `500 Internal Server Error` : Erreur serveur

**POST `/api/topics/{id}/subscribe`**

S'abonner à un sujet spécifique.

- **Authentification** : Requise (JWT)
- **Paramètres** :
  - `id` (path) : Identifiant du sujet
- **Réponses** :
  - `204 No Content` : Abonnement réussi
  - `401 Unauthorized` : Token manquant ou invalide
  - `404 Not Found` : Sujet non trouvé
  - `500 Internal Server Error` : Erreur serveur

**DELETE `/api/topics/{id}/subscribe`**

Se désabonner d'un sujet spécifique.

- **Authentification** : Requise (JWT)
- **Paramètres** :
  - `id` (path) : Identifiant du sujet
- **Réponses** :
  - `204 No Content` : Désabonnement réussi
  - `401 Unauthorized` : Token manquant ou invalide
  - `404 Not Found` : Sujet non trouvé
  - `500 Internal Server Error` : Erreur serveur

**GET `/api/topics/subscribed`**

Récupère uniquement les sujets auxquels l'utilisateur authentifié est abonné.

- **Authentification** : Requise (JWT)
- **Réponses** :
  - `200 OK` : Liste des sujets abonnés
    ```json
    [
      {
        "id": 1,
        "name": "Angular",
        "description": "...",
        "isUserSubscribed": true,
        "createdAt": "2025/12/26",
        "updatedAt": "2025/12/26"
      }
    ]
    ```
  - `401 Unauthorized` : Token manquant ou invalide
  - `500 Internal Server Error` : Erreur serveur

---

### Articles

| URL | Méthode | Description | Params (path/query) | Body (JSON) | Status | Exemple de réponse |
| --- | --- | --- | --- | --- | --- | --- |
| `/api/articles` | GET | Récupérer tous les articles | `sort` (query, optionnel) | - | 200, 401, 500 | `[{ "id": 1, "title": "...", "content": "...", "author": "...", "topicId": 1, "topic": "...", "createdAt": "2025/12/26", "updatedAt": "2025/12/26" }]` |
| `/api/articles/{articleId}` | GET | Récupérer un article par son ID | `articleId` (path) | - | 200, 401, 404, 500 | `{ "id": 1, "title": "...", "content": "...", "author": "...", "topicId": 1, "topic": "...", "createdAt": "2025/12/26", "updatedAt": "2025/12/26" }` |
| `/api/articles` | POST | Créer un nouvel article | - | `{ "title": "string", "content": "string", "topicId": number }` | 201, 400, 401, 500 | - |
| `/api/articles/{articleId}/comments` | GET | Récupérer les commentaires d'un article | `articleId` (path) | - | 200, 401, 404, 500 | `[{ "id": 1, "content": "...", "author": "...", "articleId": 1, "createdAt": "2025/12/26 10:30" }]` |
| `/api/articles/{articleId}/comments` | POST | Créer un commentaire sur un article | `articleId` (path) | `{ "comment": "string" }` | 201, 400, 401, 404, 500 | - |

#### Détails des endpoints d'articles

**GET `/api/articles`**

Récupère la liste de tous les articles.

- **Authentification** : Requise (JWT)
- **Paramètres de requête** :
  - `sort` (optionnel) : Critère de tri (ex: `createdAt,desc`, `title,asc`)
- **Réponses** :
  - `200 OK` : Liste des articles
    ```json
    [
      {
        "id": 1,
        "title": "Introduction à Angular",
        "content": "Angular est un framework...",
        "author": "john.doe",
        "topicId": 1,
        "topic": "Angular",
        "createdAt": "2025/12/26",
        "updatedAt": "2025/12/26"
      }
    ]
    ```
  - `401 Unauthorized` : Token manquant ou invalide
  - `500 Internal Server Error` : Erreur serveur

**GET `/api/articles/{articleId}`**

Récupère les détails d'un article spécifique.

- **Authentification** : Requise (JWT)
- **Paramètres** :
  - `articleId` (path) : Identifiant de l'article
- **Réponses** :
  - `200 OK` : Détails de l'article
    ```json
    {
      "id": 1,
      "title": "Introduction à Angular",
      "content": "Angular est un framework...",
      "author": "john.doe",
      "topicId": 1,
      "topic": "Angular",
      "createdAt": "2025/12/26",
      "updatedAt": "2025/12/26"
    }
    ```
  - `401 Unauthorized` : Token manquant ou invalide
  - `404 Not Found` : Article non trouvé
  - `500 Internal Server Error` : Erreur serveur

**POST `/api/articles`**

Créer un nouvel article.

- **Authentification** : Requise (JWT)
- **Body** :
```json
{
  "title": "string",
  "content": "string",
  "topicId": 1
}
```

- **Validation** :
  - `title` : Obligatoire, non vide, maximum 255 caractères
  - `content` : Obligatoire, non vide, maximum 10000 caractères
  - `topicId` : Obligatoire, doit référencer un sujet existant

- **Réponses** :
  - `201 Created` : Article créé avec succès
  - `400 Bad Request` : Données invalides
  - `401 Unauthorized` : Token manquant ou invalide
  - `500 Internal Server Error` : Erreur serveur

**GET `/api/articles/{articleId}/comments`**

Récupère tous les commentaires d'un article.

- **Authentification** : Requise (JWT)
- **Paramètres** :
  - `articleId` (path) : Identifiant de l'article
- **Réponses** :
  - `200 OK` : Liste des commentaires
    ```json
    [
      {
        "id": 1,
        "content": "Excellent article !",
        "author": "jane.doe",
        "articleId": 1,
        "createdAt": "2025/12/26 10:30"
      }
    ]
    ```
  - `401 Unauthorized` : Token manquant ou invalide
  - `404 Not Found` : Article non trouvé
  - `500 Internal Server Error` : Erreur serveur

**POST `/api/articles/{articleId}/comments`**

Créer un commentaire sur un article.

- **Authentification** : Requise (JWT)
- **Paramètres** :
  - `articleId` (path) : Identifiant de l'article
- **Body** :
```json
{
  "comment": "string"
}
```

- **Validation** :
  - `comment` : Obligatoire, non vide, maximum 500 caractères

- **Réponses** :
  - `201 Created` : Commentaire créé avec succès
  - `400 Bad Request` : Données invalides
  - `401 Unauthorized` : Token manquant ou invalide
  - `404 Not Found` : Article non trouvé
  - `500 Internal Server Error` : Erreur serveur

---

### Utilisateurs

| URL | Méthode | Description | Params (path/query) | Body (JSON) | Status | Exemple de réponse |
| --- | --- | --- | --- | --- | --- | --- |
| `/api/user/profile` | GET | Récupérer le profil de l'utilisateur authentifié | - | - | 200, 401, 500 | `{ "id": 1, "username": "john.doe", "email": "john@example.com" }` |
| `/api/user/profile` | PUT | Mettre à jour le profil de l'utilisateur authentifié | - | `{ "username": "string", "email": "string", "password": "string" }` | 200, 400, 401, 500 | `{ "id": 1, "username": "john.doe", "email": "john@example.com" }` |

#### Détails des endpoints utilisateurs

**GET `/api/user/profile`**

Récupère les informations du profil de l'utilisateur authentifié.

- **Authentification** : Requise (JWT)
- **Réponses** :
  - `200 OK` : Profil utilisateur
    ```json
    {
      "id": 1,
      "username": "john.doe",
      "email": "john@example.com"
    }
    ```
  - `401 Unauthorized` : Token manquant ou invalide
  - `500 Internal Server Error` : Erreur serveur

**PUT `/api/user/profile`**

Met à jour le profil de l'utilisateur authentifié.

- **Authentification** : Requise (JWT)
- **Body** :
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

- **Validation** :
  - `username` : Obligatoire, non vide
  - `email` : Obligatoire, format email valide
  - `password` : Optionnel, si fourni, doit respecter les règles de validation

- **Réponses** :
  - `200 OK` : Profil mis à jour
    ```json
    {
      "id": 1,
      "username": "john.doe",
      "email": "john@example.com"
    }
    ```
  - `400 Bad Request` : Données invalides
  - `401 Unauthorized` : Token manquant ou invalide
  - `500 Internal Server Error` : Erreur serveur

---

## DTOs (Data Transfer Objects)

### Authentification

**RegistrationRequest** (pour `/api/auth/register`)

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**LoginRequest** (pour `/api/auth/login`)

```json
{
  "login": "string",
  "password": "string"
}
```

**LoginResponse** (pour `/api/auth/login`)

```json
{
  "token": "jwt_token"
}
```

**MessageResponse** (pour les réponses de succès)

```json
{
  "message": "string"
}
```

---

### Sujets

**TopicResponse** (GET `/api/topics`, GET `/api/topics/subscribed`)

```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "isUserSubscribed": true,
  "createdAt": "2025/12/26",
  "updatedAt": "2025/12/26"
}
```

**TopicName** (GET `/api/topics/selector`)

```json
{
  "id": 1,
  "name": "string"
}
```

---

### Articles

**CreateArticleRequest** (POST `/api/articles`)

```json
{
  "title": "string",
  "content": "string",
  "topicId": 1
}
```

**ArticleResponse** (GET `/api/articles`, GET `/api/articles/{articleId}`)

```json
{
  "id": 1,
  "title": "string",
  "content": "string",
  "author": "string",
  "topicId": 1,
  "topic": "string",
  "createdAt": "2025/12/26",
  "updatedAt": "2025/12/26"
}
```

**CreateCommentRequest** (POST `/api/articles/{articleId}/comments`)

```json
{
  "comment": "string"
}
```

**CommentResponse** (GET `/api/articles/{articleId}/comments`)

```json
{
  "id": 1,
  "content": "string",
  "author": "string",
  "articleId": 1,
  "createdAt": "2025/12/26 10:30"
}
```

---

### Utilisateurs

**ProfileResponse** (GET `/api/user/profile`, PUT `/api/user/profile`)

```json
{
  "id": 1,
  "username": "string",
  "email": "string"
}
```

**ProfileUpdateRequest** (PUT `/api/user/profile`)

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

---

## Authentification

Tous les endpoints (sauf `/api/auth/register`, `/api/auth/login` et `/api/topics/selector`) nécessitent une authentification par token JWT.

### Utilisation du token

Le token JWT doit être inclus dans l'en-tête `Authorization` de chaque requête :

```
Authorization: Bearer <token>
```

### Expiration du token

Le token JWT a une durée de vie limitée définie par la variable d'environnement `JWT_EXPIRATION_TIME`. Une fois expiré, l'utilisateur doit se reconnecter pour obtenir un nouveau token.

---

## Codes de statut HTTP

| Code | Description |
| --- | --- |
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée avec succès |
| 204 | No Content - Requête réussie, pas de contenu à retourner |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Authentification requise ou token invalide |
| 404 | Not Found - Ressource non trouvée |
| 409 | Conflict - Conflit (ex: email/username déjà utilisé) |
| 500 | Internal Server Error - Erreur serveur |

---

## Fonctionnalités majeures

- **Inscription et authentification** : Création de compte utilisateur et authentification par JWT
- **Gestion des sujets** : Consultation, abonnement et désabonnement aux sujets
- **Gestion des articles** : Création, consultation et tri des articles par sujet
- **Gestion des commentaires** : Ajout de commentaires sur les articles
- **Gestion du profil** : Consultation et mise à jour du profil utilisateur

---

## Dépendances Spring Boot

Les dépendances principales utilisées dans ce projet :

- `spring-boot-starter-web` : Pour exposer les controllers REST, gérer les routes HTTP, la sérialisation JSON
- `spring-boot-starter-data-jpa` : Pour la couche d'accès aux données avec JPA/Hibernate et les Repository
- `spring-boot-starter-validation` : Pour valider les DTO (emails, champs obligatoires, tailles, etc.)
- `spring-boot-starter-security` : Pour gérer la sécurité, filtres, configuration des routes protégées, gestion du contexte d'authentification
- `jjwt` (jjwt-api, jjwt-impl, jjwt-jackson) : Pour créer et vérifier les tokens JWT
- `mysql-connector-j` : Driver JDBC pour communiquer avec MySQL
- `lombok` : Pour réduire le code boilerplate
- `mapstruct` et `mapstruct-processor` : Pour le mapping automatique entre entités et DTOs
- `springdoc-openapi-starter-webmvc-ui` : Pour générer la documentation Swagger/OpenAPI
- `jackson-datatype-jsr310` : Pour la sérialisation/désérialisation des types Java 8+ (LocalDateTime, etc.) en JSON
