# Analyse des besoins front-end

**Projet :** MDD (Monde de Dév)

**Auteur :** Viktor BUIAKOV  
**Repository GitHub :** https://github.com/vbuyakov/ocr-java-angular-project-5



---

## 1. Contexte

Le projet MDD (Monde de Dév) est une application web de type Single Page Application (SPA) développée avec Angular. Le front-end communique avec une API REST sécurisée développée avec Spring Boot. Ce document présente l’analyse des besoins front-end pour la version MVP du projet, sur la base exclusive des maquettes Figma et des spécifications fonctionnelles fournies.

L’objectif du front-end est de permettre aux utilisateurs d’interagir avec les fonctionnalités du réseau social (authentification, abonnements, articles, commentaires) de manière fluide, sécurisée et conforme au périmètre défini pour le MVP.

---

## 2. Besoins fonctionnels

### 2.1 Navigation et authentification

Le front-end doit permettre à l’utilisateur de naviguer entre les différentes pages de l’application en fonction de son état d’authentification.

- **Page d’accueil non connectée** : présentation de l’application et accès aux formulaires d’inscription et de connexion.
- **Page d’inscription** : création d’un compte utilisateur via un formulaire comprenant le nom d’utilisateur, l’e-mail et le mot de passe, avec validation des règles de sécurité.
- **Page de connexion** : authentification via e-mail ou nom d’utilisateur et mot de passe.
- **Flux post-inscription** : après une inscription réussie, l’utilisateur est redirigé vers la page de connexion (absence d’auto-authentification).
- **Persistance de session** : après authentification, la session utilisateur doit persister entre les visites conformément aux spécifications.

### 2.2 Gestion du profil utilisateur

- **Consultation du profil** : affichage des informations utilisateur (nom d’utilisateur, e-mail) ainsi que la liste des thèmes auxquels l’utilisateur est abonné.
- **Modification du profil** : possibilité de modifier le nom d’utilisateur, l’e-mail et le mot de passe via un formulaire prérempli.
- **Déconnexion** : accès à une fonctionnalité de déconnexion permettant de terminer la session et de revenir à la page d’accueil non connectée.

### 2.3 Gestion des abonnements aux thèmes

- **Consultation des thèmes** : page dédiée listant l’ensemble des thèmes disponibles, indépendamment de l’état d’abonnement de l’utilisateur.
- **Abonnement** : possibilité de s’abonner à un thème depuis la page des thèmes. Une fois abonné, l’action devient inactive et l’état « Déjà abonné » est affiché.
- **Désabonnement** : possibilité de se désabonner d’un thème depuis la page de profil.

### 2.4 Gestion des articles

- **Fil d’actualité** : la page d’accueil d’un utilisateur connecté affiche un fil composé uniquement des articles associés aux thèmes auxquels il est abonné, conformément aux spécifications fonctionnelles.
- **Tri des articles** : possibilité de trier le fil d’actualité par ordre chronologique (du plus récent au plus ancien ou inversement). L’état du tri n’est pas reflété dans l’URL (choix de simplification pour le MVP).
- **Création d’article** : formulaire permettant de créer un article en sélectionnant un thème, un titre et un contenu. L’auteur et la date sont définis automatiquement.
- **Consultation d’un article** : affichage du détail d’un article (thème associé, titre, auteur, date, contenu) ainsi que des commentaires.
- **Consultation hors abonnement** : possibilité d’accéder à la page de détail d’un article même si l’utilisateur n’est pas abonné au thème correspondant, sans que cet article apparaisse dans le fil principal.

### 2.5 Gestion des commentaires

- **Ajout de commentaire** : possibilité d’ajouter un commentaire à un article depuis sa page de détail. L’auteur et la date sont définis automatiquement.
- **Affichage des commentaires** : les commentaires sont affichés de manière chronologique. Les commentaires ne sont pas récursifs (absence de sous-commentaires dans le MVP).

---

## 3. Contraintes techniques et UX

### 3.1 Architecture SPA

L’application fonctionne selon le modèle SPA : la navigation s’effectue sans rechargement complet de la page afin d’assurer une expérience utilisateur fluide.

### 3.2 Communication avec l’API REST

- Toutes les interactions avec les données passent par des appels HTTP vers l’API REST sécurisée.
- Le front-end gère les états de chargement et les erreurs lors des appels réseau.

### 3.3 Sécurité

- Validation des données côté client en cohérence avec les règles définies côté back-end.
- Accès restreint aux routes protégées pour les utilisateurs authentifiés.
- Gestion de la session utilisateur via des mécanismes d’authentification sécurisés.

### 3.4 Responsive design

L’interface doit être utilisable sur ordinateur, tablette et mobile, avec une adaptation des composants et de la navigation conformément aux maquettes.

### 3.5 Gestion des erreurs et retours utilisateur

- Affichage des erreurs de validation dans les formulaires.
- Retour visuel lors des opérations asynchrones (désactivation temporaire des actions, messages d’erreur généraux).

---

## 4. Limitations de la version MVP

- **Pagination** : la pagination n’est pas implémentée dans le cadre du MVP.
- **État de l’URL** : l’état de tri du fil d’actualité n’est pas reflété dans l’URL.
- **Édition et suppression** : les articles et commentaires ne peuvent pas être modifiés ou supprimés après publication.
- **Réinitialisation de mot de passe** : la fonctionnalité de récupération de mot de passe n’est pas disponible.
- **Commentaires imbriqués** : absence de sous-commentaires.
- **Noms d’utilisateur longs** : aucune adaptation spécifique de l’interface n’est prévue pour la gestion de noms d’utilisateur particulièrement longs (troncature ou retour à la ligne non gérés explicitement dans le MVP).
- **Avatar utilisateur** : les profils utilisateurs ne disposent pas d’avatar dans la version MVP.
- **Mise en forme du contenu des articles** : les articles sont rédigés en texte brut, sans outils de mise en forme avancée (éditeur riche, markdown ou styles personnalisés).

---

## 5. Conclusion

Le front-end du projet MDD répond aux besoins fonctionnels définis pour le MVP en permettant la gestion des utilisateurs, des abonnements, des articles et des commentaires, tout en respectant les contraintes techniques et UX. Les limitations identifiées s’inscrivent dans une approche MVP et constituent des pistes d’évolution pour les versions futures du produit.

