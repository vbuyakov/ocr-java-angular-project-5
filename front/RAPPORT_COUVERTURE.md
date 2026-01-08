# 📊 Rapport de Couverture des Tests

**Projet**: MDD WebUI
**Date**: 07/01/2026 23:51:06

---

## Tests Unitaires

**Date de génération**: 07/01/2026 23:51:06

### 📊 Statistiques Globales

| Métrique | Couvert | Total | Pourcentage |
|----------|---------|-------|-------------|
| Lignes | 776 | 880 | 🟡 88.18% |
| Instructions | 776 | 880 | 🟡 88.18% |
| Fonctions | 139 | 167 | 🟡 83.23% |
| Branches | 212 | 218 | 🟢 97.25% |

### 📁 Couverture par Fichier

| Fichier | Lignes | Instructions | Fonctions | Branches |
|---------|--------|--------------|-----------|----------|
| `app/app.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/core/api/api.service.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/core/api/response-interceptor.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/core/auth/auth-guard.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/core/auth/auth-interceptor.ts` | 100.00% | 100.00% | 100.00% | 0.00% |
| `app/core/auth/auth.service.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/core/auth/user-public-guard.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/core/layouts/app-layout/app-layout.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/core/layouts/auth-layout/auth-layout.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/core/layouts/blank-layout/blank-layout.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/features/articles/article-create-page/article-create-page.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/features/articles/article-view-page/article-view-page.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/features/articles/dtos/article-request.dto.ts` | 100.00% | 100.00% | 0.00% | 0.00% |
| `app/features/auth/auth-api.service.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/features/auth/login/login-page/login-page.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/features/auth/register/register-page/register-page.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/features/errors/not-found/not-found.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/features/profile/user-profile-api.service.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/features/profile/profile-page/profile-page.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/features/topics/topics-page/topics-page.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/features/welcome/welcome-page/welcome-page.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/shared/components/icon/app-user-default-avatar.component.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/shared/components/toast/toast.component.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/shared/components/topics-list/topics-list.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/shared/services/toast.service.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/shared/services/topics-api.service.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/shared/validators/form-errors-handler.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/shared/validators/password.validator.ts` | 100.00% | 100.00% | 100.00% | 100.00% |
| `app/features/articles/articles-api.service.ts` | 90.00% | 90.00% | 80.00% | 100.00% |
| `app/shared/components/form-input/form-input.component.ts` | 90.00% | 90.00% | 83.33% | 100.00% |
| `app/features/articles/articles-page/articles-page.ts` | 83.33% | 83.33% | 50.00% | 87.50% |
| `app/features/articles/components/article-comments/article-comments.ts` | 57.14% | 57.14% | 60.00% | 71.43% |

**Total de fichiers**: 32

### 📝 Informations sur les Tests

- **Fichiers de test**: 28
- **Tests unitaires**: 606


---

## Tests d'Intégration (E2E)

**Date de génération**: 07/01/2026 23:51:06

### 📊 Statistiques Globales

| Métrique | Valeur |
|----------|--------|
| Suites de tests | 7 |
| Tests | 40 |
| Fichiers de test | 7 |

### 📁 Tests par Fichier

| Fichier | Suites | Tests |
|---------|--------|-------|
| `articles/articles.cy.ts` | 1 | 7 |
| `auth/login.cy.ts` | 1 | 7 |
| `auth/register.cy.ts` | 1 | 9 |
| `navigation/navigation.cy.ts` | 1 | 6 |
| `profile/profile.cy.ts` | 1 | 4 |
| `topics/topics.cy.ts` | 1 | 4 |
| `welcome/welcome.cy.ts` | 1 | 3 |

### ✅ Zones Couvertes

- ✅ **Flux d'authentification** (Login, Register)
- ✅ **Gestion des articles** (Liste, Création, Affichage, Commentaires)
- ✅ **Gestion du profil** (Affichage, Modification, Mot de passe)
- ✅ **Gestion des sujets** (Liste, Abonnement, Désabonnement)
- ✅ **Navigation** (Menu, Guards, Logout)
- ✅ **Page d'accueil** (Accès non authentifié, Redirection)


---

## 📈 Résumé

### Tests Unitaires

- **Couverture globale**: 🟡 87.60%
  - Instructions: 88.18% (776/880)
  - Fonctions: 83.23% (139/167)
  - Branches: 97.25% (212/218)
  - Lignes: 88.18% (776/880)

### Tests d'Intégration (E2E)

- **Suites de tests**: 7
- **Tests**: 40
- **Fichiers de test**: 7

