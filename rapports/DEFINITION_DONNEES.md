# Définition de Données

**Projet:** MDD API  
**Author:** BUIAKOV Viktor (vikbuyakov@gmail.com)  
**Git:** [https://github.com/vbuyakov/ocr-java-angular-project-5](https://github.com/vbuyakov/ocr-java-angular-project-5)

## Vue d'ensemble

Cette documentation décrit la structure de la base de données MySQL utilisée par l'application MDD (Monde de Dév). La base de données stocke les informations relatives aux utilisateurs, sujets, articles et commentaires.

**Base de données** : `mddapp`  
**Moteur** : InnoDB  
**Encodage** : utf8mb4  
**Collation** : utf8mb4_0900_ai_ci

---

## Schéma de la base de données

```
┌─────────────┐
│   users     │
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       │                  │
┌──────▼──────┐    ┌──────▼──────┐
│ user_topics │    │  articles   │
└──────┬──────┘    └──────┬──────┘
       │                  │
       │                  │
┌──────▼──────┐    ┌──────▼──────┐
│   topics    │    │  comments   │
└─────────────┘    └─────────────┘
```

---

## Tables

### Table `users`

Table principale stockant les informations des utilisateurs de l'application.

| Colonne | Type | Contraintes | Description |
| --- | --- | --- | --- |
| `id` | `bigint` | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique de l'utilisateur |
| `username` | `varchar(255)` | NOT NULL, UNIQUE | Nom d'utilisateur (unique) |
| `email` | `varchar(255)` | NOT NULL, UNIQUE | Adresse email (unique) |
| `password` | `varchar(255)` | NOT NULL | Mot de passe hashé (BCrypt) |
| `created_at` | `datetime(6)` | NOT NULL | Date et heure de création |
| `updated_at` | `datetime(6)` | NULL | Date et heure de dernière modification |

**Index** :
- PRIMARY KEY sur `id`
- UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` sur `username`
- UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` sur `email`

**Relations** :
- Un utilisateur peut avoir plusieurs abonnements (`user_topics`)
- Un utilisateur peut créer plusieurs articles (`articles.author_id`)
- Un utilisateur peut créer plusieurs commentaires (`comments.author_id`)

**Exemple de données** :
```sql
INSERT INTO users (id, username, email, password, created_at, updated_at) 
VALUES (1, 'john.doe', 'john@example.com', '$2a$10$...', '2025-12-26 10:00:00.000000', NULL);
```

---

### Table `topics`

Table stockant les sujets thématiques disponibles dans l'application.

| Colonne | Type | Contraintes | Description |
| --- | --- | --- | --- |
| `id` | `bigint` | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique du sujet |
| `name` | `varchar(255)` | NOT NULL | Nom du sujet |
| `description` | `varchar(1000)` | NULL | Description du sujet |
| `created_at` | `datetime(6)` | NOT NULL | Date et heure de création |
| `updated_at` | `datetime(6)` | NULL | Date et heure de dernière modification |

**Index** :
- PRIMARY KEY sur `id`

**Relations** :
- Un sujet peut avoir plusieurs abonnés (`user_topics.topic_id`)
- Un sujet peut contenir plusieurs articles (`articles.topic_id`)

**Exemple de données** :
```sql
INSERT INTO topics (id, name, description, created_at, updated_at) 
VALUES (7, 'Angular', 'Frontend framework by Google for building scalable, enterprise-grade web applications.', '2025-12-26 19:59:20.603957', '2025-12-26 19:59:20.611682');
```

**Sujets par défaut** :
- Angular
- DevOps
- Spring Boot
- Docker
- Kubernetes
- Python
- JavaScript
- Cloud Computing

---

### Table `user_topics`

Table de liaison entre les utilisateurs et les sujets (relation many-to-many).

| Colonne | Type | Contraintes | Description |
| --- | --- | --- | --- |
| `user_id` | `bigint` | PRIMARY KEY, FOREIGN KEY | Identifiant de l'utilisateur |
| `topic_id` | `bigint` | PRIMARY KEY, FOREIGN KEY | Identifiant du sujet |

**Index** :
- PRIMARY KEY composite sur (`user_id`, `topic_id`)
- FOREIGN KEY `FKqu8wvgdxo8kbdf35h77yahhie` sur `user_id` référençant `users(id)`
- FOREIGN KEY `FK9oow3ns9gdswmj72245fwlsuk` sur `topic_id` référençant `topics(id)`

**Relations** :
- `user_id` → `users.id` (ON DELETE CASCADE)
- `topic_id` → `topics.id` (ON DELETE CASCADE)

**Exemple de données** :
```sql
INSERT INTO user_topics (user_id, topic_id) 
VALUES (1, 7);
```

---

### Table `articles`

Table stockant les articles publiés par les utilisateurs.

| Colonne | Type | Contraintes | Description |
| --- | --- | --- | --- |
| `id` | `bigint` | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique de l'article |
| `title` | `varchar(255)` | NOT NULL | Titre de l'article |
| `content` | `varchar(10000)` | NULL | Contenu de l'article (maximum 10000 caractères) |
| `author_id` | `bigint` | NOT NULL, FOREIGN KEY | Identifiant de l'auteur |
| `topic_id` | `bigint` | NOT NULL, FOREIGN KEY | Identifiant du sujet |
| `created_at` | `datetime(6)` | NOT NULL | Date et heure de création |
| `updated_at` | `datetime(6)` | NULL | Date et heure de dernière modification |

**Index** :
- PRIMARY KEY sur `id`
- FOREIGN KEY `FKe02fs2ut6qqoabfhj325wcjul` sur `author_id` référençant `users(id)`
- FOREIGN KEY `FKtr90v51q71w7rpslscsfjf3cv` sur `topic_id` référençant `topics(id)`

**Relations** :
- `author_id` → `users.id` (ON DELETE CASCADE)
- `topic_id` → `topics.id` (ON DELETE CASCADE)
- Un article peut avoir plusieurs commentaires (`comments.article_id`)

**Exemple de données** :
```sql
INSERT INTO articles (id, title, content, author_id, topic_id, created_at, updated_at) 
VALUES (1, 'Introduction à Angular', 'Angular est un framework...', 1, 7, '2025-12-26 10:00:00.000000', NULL);
```

---

### Table `comments`

Table stockant les commentaires associés aux articles.

| Colonne | Type | Contraintes | Description |
| --- | --- | --- | --- |
| `id` | `bigint` | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique du commentaire |
| `content` | `varchar(500)` | NOT NULL | Contenu du commentaire (maximum 500 caractères) |
| `article_id` | `bigint` | NOT NULL, FOREIGN KEY | Identifiant de l'article |
| `author_id` | `bigint` | NOT NULL, FOREIGN KEY | Identifiant de l'auteur du commentaire |
| `created_at` | `datetime(6)` | NOT NULL | Date et heure de création |

**Index** :
- PRIMARY KEY sur `id`
- FOREIGN KEY `FKk4ib6syde10dalk7r7xdl0m5p` sur `article_id` référençant `articles(id)`
- FOREIGN KEY `FKn2na60ukhs76ibtpt9burkm27` sur `author_id` référençant `users(id)`

**Relations** :
- `article_id` → `articles.id` (ON DELETE CASCADE)
- `author_id` → `users.id` (ON DELETE CASCADE)

**Exemple de données** :
```sql
INSERT INTO comments (id, content, article_id, author_id, created_at) 
VALUES (1, 'Excellent article !', 1, 2, '2025-12-26 10:30:00.000000');
```

---

## Contraintes d'intégrité référentielle

### Clés étrangères

| Table | Colonne | Table référencée | Colonne référencée | Action |
| --- | --- | --- | --- | --- |
| `user_topics` | `user_id` | `users` | `id` | CASCADE |
| `user_topics` | `topic_id` | `topics` | `id` | CASCADE |
| `articles` | `author_id` | `users` | `id` | CASCADE |
| `articles` | `topic_id` | `topics` | `id` | CASCADE |
| `comments` | `article_id` | `articles` | `id` | CASCADE |
| `comments` | `author_id` | `users` | `id` | CASCADE |

**Note** : Les contraintes CASCADE garantissent que la suppression d'un enregistrement parent supprime automatiquement les enregistrements enfants associés.

---

## Règles de validation

### Utilisateurs (`users`)

- **username** : Obligatoire, unique, maximum 255 caractères
- **email** : Obligatoire, unique, format email valide, maximum 255 caractères
- **password** : Obligatoire, hashé avec BCrypt, minimum 8 caractères avec au moins :
  - Une majuscule
  - Une minuscule
  - Un chiffre
  - Un caractère spécial

### Sujets (`topics`)

- **name** : Obligatoire, maximum 255 caractères
- **description** : Optionnel, maximum 1000 caractères

### Articles (`articles`)

- **title** : Obligatoire, maximum 255 caractères
- **content** : Optionnel, maximum 10000 caractères
- **author_id** : Obligatoire, doit référencer un utilisateur existant
- **topic_id** : Obligatoire, doit référencer un sujet existant

### Commentaires (`comments`)

- **content** : Obligatoire, maximum 500 caractères
- **article_id** : Obligatoire, doit référencer un article existant
- **author_id** : Obligatoire, doit référencer un utilisateur existant

---

## Types de données

### Types numériques

- **bigint** : Entier de grande taille (64 bits), utilisé pour les identifiants

### Types de chaînes

- **varchar(n)** : Chaîne de caractères de longueur variable, maximum n caractères
  - `varchar(255)` : Pour les noms, emails, usernames
  - `varchar(500)` : Pour les commentaires
  - `varchar(1000)` : Pour les descriptions
  - `varchar(10000)` : Pour le contenu des articles

### Types de dates

- **datetime(6)** : Date et heure avec précision à la microseconde
  - Format : `YYYY-MM-DD HH:MM:SS.ffffff`
  - Utilisé pour `created_at` et `updated_at`

---

## Index et performances

### Index primaires

Toutes les tables possèdent un index primaire sur la colonne `id` (AUTO_INCREMENT).

### Index uniques

- `users.username` : Garantit l'unicité des noms d'utilisateur
- `users.email` : Garantit l'unicité des adresses email

### Index de clés étrangères

Toutes les clés étrangères sont indexées automatiquement pour optimiser les jointures :
- `user_topics.user_id`
- `user_topics.topic_id`
- `articles.author_id`
- `articles.topic_id`
- `comments.article_id`
- `comments.author_id`

---

## Scripts d'initialisation

### Structure des tables

Le script `docker/dev-data/db/dump.sql` contient :
1. La création de toutes les tables avec leurs contraintes
2. Les données initiales pour la table `topics` (8 sujets par défaut)

### Réinitialisation de la base de données

Pour réinitialiser complètement la base de données :

```bash
./docker/tools/reinit-db.sh
```

Cette commande :
- Arrête tous les services Docker
- Supprime le volume de données `db_data`
- Redémarre les services (la base est réinitialisée depuis `dump.sql`)

---

## Exemples de requêtes SQL

### Récupérer tous les articles d'un utilisateur

```sql
SELECT a.id, a.title, a.content, a.created_at, t.name as topic_name
FROM articles a
JOIN topics t ON a.topic_id = t.id
WHERE a.author_id = 1
ORDER BY a.created_at DESC;
```

### Récupérer tous les sujets auxquels un utilisateur est abonné

```sql
SELECT t.id, t.name, t.description
FROM topics t
JOIN user_topics ut ON t.id = ut.topic_id
WHERE ut.user_id = 1;
```

### Récupérer tous les commentaires d'un article avec les auteurs

```sql
SELECT c.id, c.content, c.created_at, u.username as author
FROM comments c
JOIN users u ON c.author_id = u.id
WHERE c.article_id = 1
ORDER BY c.created_at ASC;
```

### Compter les articles par sujet

```sql
SELECT t.name, COUNT(a.id) as article_count
FROM topics t
LEFT JOIN articles a ON t.id = a.topic_id
GROUP BY t.id, t.name
ORDER BY article_count DESC;
```

### Récupérer les articles récents avec leurs commentaires

```sql
SELECT 
    a.id,
    a.title,
    a.created_at,
    u.username as author,
    t.name as topic,
    COUNT(c.id) as comment_count
FROM articles a
JOIN users u ON a.author_id = u.id
JOIN topics t ON a.topic_id = t.id
LEFT JOIN comments c ON a.id = c.article_id
GROUP BY a.id, a.title, a.created_at, u.username, t.name
ORDER BY a.created_at DESC
LIMIT 10;
```

---

## Maintenance et sauvegarde

### Sauvegarde de la base de données

```bash
docker exec mdd-db mysqldump -u mdduser -p mddapp > backup.sql
```

### Restauration de la base de données

```bash
docker exec -i mdd-db mysql -u mdduser -p mddapp < backup.sql
```

### Vérification de l'intégrité

```sql
-- Vérifier les contraintes de clés étrangères
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'mddapp'
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

---

## Évolutions futures possibles

### Améliorations suggérées

1. **Table `tags`** : Système de tags pour les articles
2. **Table `likes`** : Système de likes pour les articles et commentaires
3. **Table `notifications`** : Notifications pour les utilisateurs
4. **Table `subscriptions`** : Historique des abonnements/désabonnements
5. **Table `article_views`** : Statistiques de vues des articles
6. **Champs additionnels** :
   - `users.avatar_url` : URL de l'avatar utilisateur
   - `users.bio` : Biographie de l'utilisateur
   - `articles.views_count` : Nombre de vues
   - `articles.likes_count` : Nombre de likes

---

## Notes techniques

### Encodage

L'utilisation de `utf8mb4` permet de stocker des caractères Unicode complets, y compris les emojis et les caractères spéciaux de toutes les langues.

### Précision des dates

La précision à la microseconde (`datetime(6)`) permet un ordre chronologique précis même pour des opérations rapides.

### Contraintes CASCADE

Les contraintes CASCADE garantissent la cohérence des données en supprimant automatiquement les enregistrements orphelins lors de la suppression d'un enregistrement parent.

---

## Documentation de référence

- **Swagger UI** : http://localhost/api/swagger-ui/index.html
- **OpenAPI JSON** : http://localhost/api/v3/api-docs
- **Voir aussi** : `DEFINITION_API.pdf`
