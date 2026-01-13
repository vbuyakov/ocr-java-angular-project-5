# Rapport de revue technique

**Projet :** MDD (Monde de Dév)

**Auteur :** Viktor BUIAKOV  
**Repository GitHub :** https://github.com/vbuyakov/ocr-java-angular-project-5

---

## 1. Points forts

### 1.1 Architecture et séparation des responsabilités

L’application repose sur une architecture en couches claire et cohérente, favorisant la lisibilité, la maintenabilité et l’évolutivité du code.

- **Back-end** : séparation nette entre les contrôleurs (exposition des endpoints REST), les services (logique métier) et les repositories (accès aux données). Cette organisation permet une meilleure testabilité et limite les effets de bord.
- **Front-end** : structure modulaire avec une séparation entre les vues fonctionnelles, les composants partagés et les services transverses (authentification, communication API). L’utilisation de guards assure une protection cohérente des routes nécessitant une authentification.

### 1.2 Sécurité

La sécurité a été intégrée dès la conception de l’application, en cohérence avec les bonnes pratiques attendues pour un MVP.

- **Authentification par token** : mise en place d’une authentification basée sur des tokens JWT afin de sécuriser les échanges entre le front-end et le back-end.
- **Validation des données** : contrôle systématique des données entrantes côté back-end via des mécanismes de validation, complété par une validation côté front-end pour améliorer l’expérience utilisateur.
- **Contrôle des accès** : restriction de l’accès aux ressources protégées en fonction de l’état d’authentification de l’utilisateur.
- **Gestion des mots de passe** : stockage sécurisé des mots de passe via un algorithme de hachage conforme aux standards de sécurité.

### 1.3 Stratégie de tests

Une stratégie de tests multi-niveaux a été mise en place afin de garantir la qualité et la fiabilité du code.

- **Tests unitaires back-end** : couverture des services, contrôleurs et composants utilitaires.
- **Tests d’intégration back-end** : validation du bon fonctionnement des endpoints REST dans un environnement proche de la production.
- **Tests unitaires front-end** : vérification du comportement des composants et des services.
- **Tests end-to-end** : scénarios utilisateur critiques couvrant l’authentification, la navigation et les principales fonctionnalités.
- **Couverture de code** : génération automatique de rapports de couverture permettant de suivre la qualité du code.

### 1.4 Containerisation et déploiement

L’application est entièrement containerisée afin de garantir la reproductibilité des environnements.

- **Docker Compose** : orchestration des différents services (base de données, back-end, front-end).
- **Images optimisées** : utilisation de builds multi-étapes afin de limiter la taille des images.
- **Configuration externalisée** : gestion de la configuration via des variables d’environnement, facilitant les déploiements sur différents environnements.

### 1.5 Documentation

Une documentation complète accompagne le projet :

- documentation technique (architecture, analyse des besoins, revue technique) ;
- documentation utilisateur via une FAQ dédiée ;
- documentation des endpoints de l’API.

---

## 2. Axes d’amélioration et limites

### 2.1 Limitations volontaires du MVP

Certaines fonctionnalités ont été volontairement exclues du périmètre du MVP afin de limiter la complexité initiale.

- **Pagination** : les listes ne sont pas paginées, ce qui peut limiter les performances en cas de volume de données important.
- **État de l’URL** : l’état de tri du fil d’actualité n’est pas reflété dans l’URL.
- **Édition et suppression** : les articles et commentaires ne peuvent pas être modifiés ou supprimés après publication.
- **Réinitialisation de mot de passe** : cette fonctionnalité n’est pas disponible dans la version actuelle.

### 2.2 Gestion des erreurs

La gestion des erreurs est fonctionnelle mais perfectible.

- Les messages d’erreur pourraient être davantage harmonisés et contextualisés.
- Le retour utilisateur en cas d’erreurs réseau pourrait être amélioré dans certaines situations.

### 2.3 Performance et optimisation

Plusieurs axes d’optimisation peuvent être envisagés pour une montée en charge future.

- Chargement de l’ensemble des données en une seule requête pour certaines vues.
- Absence de mécanisme de cache.
- Possibilités d’optimisation des requêtes vers la base de données.

### 2.4 Maintenabilité

Quelques points méritent une attention particulière pour la maintenance à long terme.

- Répartition de la configuration sur plusieurs fichiers.
- Gestion des dépendances nécessitant une surveillance régulière afin d’éviter des incompatibilités futures.

---

## 3. Pistes d’évolution et actions correctives

### 3.1 Évolutions fonctionnelles

- Mise en place de la pagination pour les listes principales.
- Ajout d’un mécanisme de réinitialisation de mot de passe.
- Possibilité de modifier ou supprimer les articles et commentaires avec gestion des permissions.

### 3.2 Améliorations techniques

- Introduction d’un mécanisme de cache côté back-end.
- Optimisation des requêtes et limitation des données transférées.
- Prise en compte de l’état du tri dans l’URL.

### 3.3 Maintenabilité et qualité

- Centralisation progressive de la configuration.
- Mise à jour régulière des dépendances.
- Renforcement de la documentation du code.

### 3.4 Monitoring et observabilité

Dans une perspective de mise en production :

- amélioration du logging applicatif ;
- ajout de métriques pour le suivi des performances ;
- mise en place d’outils de suivi des erreurs.

---

## 4. Conclusion

Le projet MDD présente une base technique solide et cohérente, adaptée aux objectifs d’un MVP. Les choix architecturaux, la prise en compte de la sécurité et la stratégie de tests permettent d’assurer une bonne qualité globale du code.

Les limitations identifiées sont assumées et clairement documentées. Elles constituent des axes d’évolution naturels pour les versions futures de l’application, notamment en matière de performances, de fonctionnalités utilisateur et d’observabilité.

---

*Document mis à jour : Janvier 2026*  
*Version : 1.0*

