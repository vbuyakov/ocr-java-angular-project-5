# MDD Application

Application web full-stack pour une plateforme de discussion technique (Monde de Dév).

## Stack Technologique

### Backend
- **Java 21** - Langage de programmation
- **Spring Boot 3.5.8** - Framework d'application
- **Spring Security** - Authentification et autorisation
- **Spring Data JPA** - Accès aux données
- **MySQL 8.0+** - Base de données relationnelle
- **JWT** - Authentification par token
- **Maven** - Gestion des dépendances et build
- **JaCoCo** - Analyse de couverture de code

### Frontend
- **Angular 21** - Framework frontend
- **TypeScript** - Langage de programmation
- **TailwindCSS 4** - Framework CSS
- **RxJS** - Programmation réactive
- **Vitest** - Framework de tests unitaires
- **Cypress** - Tests end-to-end

### Infrastructure
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration des services
- **Nginx** - Serveur web et reverse proxy
- **MySQL** - Base de données

## Démarrage du Projet avec Docker

### Prérequis
- Docker et Docker Compose installés
- Ports disponibles : 80 (Nginx), 3306 (MySQL), 8080 (Backend)

### Configuration

1. **Créer le fichier `.env`** à la racine du projet en copiant `.env.example` :

```bash
cp .env.example .env
```

2. **Vérifier et ajuster les variables d'environnement** dans `.env` si nécessaire :

```env
# Configuration de l'application
APP_NAME=MDDApp
SERVER_PORT=8080
API_PATH=/api

# Configuration de la base de données
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=mddapp
MYSQL_USER=mdduser
MYSQL_PASSWORD=mddpassword
MYSQL_DB_URL=jdbc:mysql://db:3306/mddapp
MYSQL_PORT=3306

# Configuration JWT
JWT_SECRET_KEY=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b
JWT_EXPIRATION_TIME=7200000

# Configuration Nginx
NGINX_PORT=80
NGINX_VERSION=alpine

# Configuration Docker
DOCKER_BUILDKIT=1
COMPOSE_DOCKER_CLI_BUILD=1
```

### Démarrage

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier le statut des services
docker-compose ps

# Consulter les logs
docker-compose logs -f
```

L'application sera accessible à :
- **Frontend** : http://localhost
- **API** : http://localhost/api
- **Swagger UI** : http://localhost/api/swagger-ui/index.html
- **Base de données** : localhost:3306

### Arrêt

```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (supprime les données)
docker-compose down -v
```

## Outils de Base de Données

### Réinitialisation de la Base de Données

Pour réinitialiser la base de données avec le dump SQL initial :

```bash
./docker/tools/reinit-db.sh
```

Cette commande :
- Arrête tous les services
- Supprime le volume de données
- Redémarre les services (la base est réinitialisée depuis `docker/dev-data/db/dump.sql`)

**Attention** : Cette opération supprime toutes les données existantes.

### Rechargement de la Base de Données

Pour recharger la base de données depuis le fichier dump sans supprimer le conteneur :

```bash
./docker/tools/reload-db.sh
```

### Génération de Données Factices

Pour générer des données de test réalistes :

```bash
# Première utilisation : installer les dépendances Python
./docker/tools/setup_venv.sh

# Générer les données
./docker/tools/generate_fake_data.sh
```

Le script génère :
- 15 utilisateurs avec des noms français
- Abonnements utilisateurs (2-7 sujets par utilisateur)
- 10-20 articles par sujet
- 0-5 commentaires par article

Les identifiants des utilisateurs sont sauvegardés dans :
```
docker/tools/generated_data/users_credentials.json
```

Tous les utilisateurs ont le mot de passe : `Password123!`

## Développement Backend

### Prérequis
- Java 21 ou supérieur
- Maven 3.6+
- MySQL 8.0+ (ou Docker avec MySQL)

### Configuration pour le Développement

1. **Arrêter les services Docker** (sauf la base de données) :

```bash
# Arrêter uniquement le backend et nginx
docker-compose stop backend nginx frontend

# La base de données continue de tourner
```

2. **Configurer les variables d'environnement** pour le développement local :

Dans `.env`, utiliser :
```env
MYSQL_DB_URL=jdbc:mysql://127.0.0.1:3306/mddapp
```

3. **Configurer les variables d'environnement** :

**Option A : IntelliJ IDEA (recommandé)**

Dans IntelliJ IDEA, configurer les variables d'environnement dans la configuration d'exécution :
- Ouvrir `Run` > `Edit Configurations...`
- Sélectionner la configuration Spring Boot
- Dans `Environment variables`, ajouter toutes les variables du fichier `.env`
- Ou utiliser `EnvFile` plugin pour charger automatiquement le fichier `.env`

**Option B : Ligne de commande**

```bash
export $(cat .env | xargs)
```

### Exécution en Mode Développement

```bash
cd back

# Exécuter l'application
./mvnw spring-boot:run

# Ou avec Maven installé globalement
mvn spring-boot:run
```

L'API sera accessible sur : http://localhost:8080/api

### Tests Backend

#### Tests Unitaires

```bash
cd back

# Exécuter tous les tests unitaires
mvn test

# Exécuter un test spécifique
mvn test -Dtest=AuthServiceTest

# Exécuter une catégorie de tests
mvn test -Dtest="*ServiceTest"
```

**Résultats** : 125 tests unitaires

#### Tests d'Intégration (E2E)

```bash
cd back

# Exécuter tous les tests (unitaires + intégration)
mvn verify

# Exécuter uniquement les tests d'intégration
mvn failsafe:integration-test

# Exécuter un test d'intégration spécifique
mvn verify -Dtest=AuthControllerIT
```

**Résultats** : 49 tests d'intégration (12 topics + 16 auth + 13 articles + 8 user)

#### Couverture de Code

```bash
cd back

# Exécuter tous les tests avec génération du rapport de couverture
mvn clean verify jacoco:report
```

**Rapport de couverture** :
- **Rapport HTML** : `back/target/site/jacoco/index.html`
- **Rapport Markdown** : `back/RAPPORT_COUVERTURE.md` (généré via script)

**Génération du rapport Markdown** :

```bash
cd back

# Générer uniquement le rapport Markdown (nécessite des données JaCoCo existantes)
python3 scripts/generate_coverage_report.py

# Ou exécuter les tests et générer le rapport complet
mvn clean verify jacoco:report && python3 scripts/generate_coverage_report.py
```

**Visualisation du rapport HTML** :
```bash
# macOS
open back/target/site/jacoco/index.html

# Linux
xdg-open back/target/site/jacoco/index.html

# Windows
start back/target/site/jacoco/index.html
```

Le rapport inclut :
- Couverture des lignes, branches, méthodes et classes
- Détails par package et classe
- Statistiques des tests unitaires et d'intégration
- Lignes non couvertes mises en évidence

**Seuil minimum** : 75% de couverture de code

## Développement Frontend

### Prérequis
- Node.js 18+ et npm
- Angular CLI 21+

### Installation des Dépendances

```bash
cd front
npm install
```

### Exécution en Mode Développement

```bash
cd front

# Démarrer le serveur de développement
npm start
# ou
ng serve
```

L'application sera accessible sur : http://localhost:4200

Le serveur de développement recharge automatiquement l'application lors des modifications.

### Configuration du Proxy

Le fichier `front/proxy.conf.json` est configuré pour rediriger les requêtes `/api` vers le backend :
- En développement : `http://localhost:8080`
- En production : géré par Nginx

### Tests Frontend

#### Tests Unitaires

```bash
cd front

# Exécuter les tests en mode watch
npm test
# ou
ng test

# Exécuter les tests une seule fois
npm test -- --watch=false

# Exécuter avec couverture
npm test -- --watch=false --coverage
```

**Résultats** : 549 tests unitaires

**Rapport de couverture** :
- **Emplacement HTML** : `front/coverage/mdd-webui/index.html`
- **Rapport Markdown** : `front/RAPPORT_COUVERTURE.md` (généré via script)

#### Génération du Rapport de Couverture

```bash
cd front

# Générer uniquement le rapport (nécessite des données de couverture existantes)
npm run coverage:report

# Exécuter les tests et générer le rapport complet
npm run coverage:full
```

Le rapport Markdown inclut :
- Statistiques de couverture (lignes, statements, fonctions, branches)
- Couverture par fichier
- Statistiques des tests E2E
- Résumé global

#### Tests End-to-End (E2E)

```bash
cd front

# Ouvrir Cypress en mode interactif
npm run cypress:open
# ou
ng e2e

# Exécuter les tests E2E en mode headless (CI/CD)
npm run e2e:ci
# ou
npm run cypress:run
```

**Tests E2E disponibles** :
- Authentification (login, register)
- Navigation
- Articles
- Sujets (Topics)
- Profil utilisateur
- Page d'accueil

**Résultats** : Les rapports et captures d'écran sont disponibles dans `front/cypress/`

## Structure du Projet

```
mddapp/
├── back/                 # Application Spring Boot
│   ├── src/
│   │   ├── main/        # Code source
│   │   └── test/        # Tests unitaires et intégration
│   └── target/          # Build et rapports (généré)
│       └── site/
│           └── jacoco/  # Rapport de couverture
├── front/               # Application Angular
│   ├── src/             # Code source
│   ├── cypress/         # Tests E2E
│   ├── coverage/        # Rapports de couverture
│   └── dist/            # Build de production (généré)
├── docker/              # Configuration Docker
│   ├── dev-data/        # Données de développement
│   │   ├── db/          # Dump SQL
│   │   └── nginx/       # Configuration Nginx
│   └── tools/           # Scripts utilitaires
│       └── generated_data/  # Identifiants générés
├── docker-compose.yml   # Orchestration Docker
└── .env                 # Variables d'environnement (à créer)
```

## Commandes Utiles

### Docker

```bash
# Voir les logs d'un service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
docker-compose logs -f db

# Redémarrer un service
docker-compose restart backend

# Reconstruire un service
docker-compose up -d --build backend
```

### Base de Données

```bash
# Se connecter à la base de données
docker exec -it mdd-db mysql -u mdduser -p mddapp

# Exporter la base de données
docker exec mdd-db mysqldump -u mdduser -p mddapp > backup.sql
```

### Backend

```bash
# Nettoyer et compiler
mvn clean compile

# Package l'application
mvn clean package

# Exécuter avec profil spécifique
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend

```bash
# Linter le code
npm run lint

# Build de production
npm run build

# Analyser le bundle
npm run build -- --stats-json
```

## Support

Pour toute question ou problème, consultez la documentation spécifique :
- **Backend** : `back/README.md`
- **Frontend** : `front/README.md`
- **Tests E2E** : `front/cypress/README.md`
