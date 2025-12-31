# Figma Design vs Implementation Analysis

## Overview
This document analyzes the Figma maquette and compares it with the current Angular 21 + TailwindCSS implementation.

**Figma Design URL:** https://www.figma.com/design/GMXXPxcVGQypri2Iu0vBWQ/p5_my_copy?node-id=0-1

## Design Structure Analysis

### Pages Identified in Figma:
1. **Welcome Page** (Landing page with logo and auth buttons)
2. **Registration Page** (Inscription)
3. **Login Page** (Se connecter)
4. **Topics Page** (Thèmes) - List of topics with subscribe/unsubscribe functionality
5. **Articles Page** - List of articles with sorting
6. **Article View Page** - Individual article with comments section
7. **Article Create Page** - Form to create new articles
8. **Profile Page** - User profile with subscriptions management

### Layout Components:
- **Blank Layout** - For welcome page (no header)
- **Auth Layout** - For login/register (minimal header with logo)
- **App Layout** - For authenticated pages (full header with navigation)

---

## Current Implementation Status

### ✅ COMPLETED

#### 1. Welcome Page (`/features/welcome/welcome-page/`)
- **Status:** ✅ Fully implemented
- **Features:**
  - Responsive illustration (mobile/desktop)
  - Two action buttons: "Se connecter" and "S'inscrire"
  - Proper routing to auth pages
  - Uses BlankLayout (no header)
- **Styling:** Matches design with TailwindCSS

#### 2. Register Page (`/features/auth/register/register-page/`)
- **Status:** ⚠️ Partially implemented
- **Features:**
  - Form structure with 3 inputs (username, email, password)
  - Back arrow navigation
  - Mobile logo display
  - Submit button
- **Issues:**
  - Import path error: `'../../../../common/input/input'` should be `'../../shared/components/form-input/form-input.component'`
  - Missing form-input template file
  - Needs styling refinement to match Figma exactly

#### 3. Global Styles (`/styles.css`)
- **Status:** ✅ Well configured
- **Features:**
  - TailwindCSS v4 setup
  - Custom color palette (primary, secondary, accent, danger, success)
  - MDD-specific color tokens
  - Utility classes (btn-primary, btn-outline, card, input-field, etc.)
  - Container classes (container-page, container-auth, container-narrow)

#### 4. Routing (`/app.routes.ts`)
- **Status:** ✅ Complete structure
- **Routes:**
  - `/` - Welcome page (BlankLayout)
  - `/auth/register` - Registration (AuthLayout)
  - `/auth/login` - Login (AuthLayout)
  - `/articles` - Articles list (AppLayout, protected)
  - `/articles/create` - Create article (AppLayout, protected)
  - `/articles/:id` - Article view (AppLayout, protected)
  - `/topics` - Topics list (AppLayout, protected)
  - `/profile` - User profile (AppLayout, protected)

---

### ❌ NOT IMPLEMENTED / PLACEHOLDER

#### 1. Login Page (`/features/auth/login/login-page/`)
- **Status:** ❌ Placeholder only
- **Current:** Just displays "login-page works!"
- **Needs:**
  - Form with email/username and password fields
  - "Se connecter" submit button
  - Back arrow navigation
  - Mobile logo display
  - Similar structure to register page

#### 2. App Layout Header (`/core/layouts/app-layout/`)
- **Status:** ❌ Placeholder only
- **Current:** Empty header comment
- **Needs (from Figma):**
  - Desktop header (94px height):
    - Logo on left (140x81px)
    - Navigation links: "Articles" and "Thèmes" (center)
    - User avatar/icon (48x48px circle) on right
    - "Se déconnecter" link (appears on hover/click of user icon)
  - Mobile header (62px height):
    - Logo on left (92x53px)
    - Hamburger menu icon on right
    - Navigation menu (drawer/sidebar)

#### 3. Topics Page (`/features/topics/topics-page/`)
- **Status:** ❌ Placeholder only
- **Current:** Just displays "topics-page works!"
- **Needs (from Figma):**
  - Grid layout (desktop: 2 columns, mobile: 1 column)
  - Topic cards with:
    - Title ("Titre du thème")
    - Description (truncated with ellipsis)
    - Subscribe button ("S'abonner") - purple when not subscribed
    - "Déjà abonné" button - grey when subscribed
  - Responsive design

#### 4. Articles Page (`/features/articles/articles-page/`)
- **Status:** ❌ Placeholder only
- **Current:** Just displays "articles-page works!"
- **Needs (from Figma):**
  - Header with "Créer un article" button (purple, 153x40px)
  - "Trier par" (Sort by) dropdown
  - Grid of article cards (desktop: 2 columns, mobile: 1 column)
  - Each card shows:
    - Title
    - Date, Author, Theme labels
    - Content preview (truncated)
  - Responsive design

#### 5. Article View Page (`/features/articles/article-view-page/`)
- **Status:** ❌ Placeholder only
- **Current:** Empty component
- **Needs (from Figma):**
  - Back arrow (mobile)
  - Article header:
    - Title
    - Metadata: Date, Auteur, Thème
  - Article content (full text)
  - Divider line
  - Comments section:
    - "Commentaires" heading
    - List of existing comments (username + content in grey boxes)
    - Comment input field: "Écrivez ici votre commentaire"
    - Send button (purple paper airplane icon, 43x43px)
  - Responsive design

#### 6. Article Create Page (`/features/articles/article-create-page/`)
- **Status:** ❌ Placeholder only
- **Current:** Empty component
- **Needs (from Figma):**
  - Form with:
    - "Sélectionner un thème" dropdown (281x48px desktop, 250x48px mobile)
    - "Titre de l'article" input (281x48px desktop, 250x48px mobile)
    - "Contenu de l'article" textarea (281x212px desktop, 250x212px mobile)
  - "Créer" button (purple, 139x40px)
  - Responsive design

#### 7. Profile Page (`/features/profile/profile-page/`)
- **Status:** ❌ Placeholder only
- **Current:** Empty component
- **Needs (from Figma):**
  - "Profil utilisateur" section:
    - Username input
    - Email input (pre-filled)
    - Password input
    - "Sauvegarder" button (purple, 139x40px)
  - "Abonnements" section:
    - List of subscribed topics
    - Each topic card with:
      - Title
      - Description
      - "Se désabonner" button (purple)
  - Divider line between sections
  - Responsive design

#### 8. Form Input Component (`/shared/components/form-input/`)
- **Status:** ⚠️ Missing template
- **Current:** Component logic exists but no HTML template
- **Needs:**
  - HTML template file
  - CSS styling
  - Proper label, input, and error handling structure

---

## Design Specifications from Figma

### Colors
- **Primary Purple:** `#6b46c1` (primary-600)
- **Primary Purple Light:** `#7c3aed` (primary-500)
- **Primary Purple Dark:** `#5b21b6` (primary-700)
- **Text:** Black (`#000000`)
- **Text Secondary:** `#737373` (secondary-500)
- **Background:** White
- **Card Background:** `#f5f5f5` (secondary-100)
- **Border:** `#e5e5e5` (secondary-200)

### Typography
- **Font Family:** Inter (Regular and Bold)
- **Heading Sizes:**
  - Page titles: 24px
  - Section headings: 20px
  - Card titles: 16px (bold)
- **Body Text:**
  - Regular: 14px
  - Small: 12px

### Spacing & Layout
- **Header Height:**
  - Desktop: 94px
  - Mobile: 62px
- **Container Padding:** 36px (desktop), 16px (mobile)
- **Card Border Radius:** 8px
- **Button Border Radius:** Varies (rounded-md to rounded-lg)
- **Gap between elements:** 10-16px typically

### Components Dimensions
- **Logo:**
  - Desktop: 140x81px
  - Mobile: 92x53px
- **User Avatar:** 48x48px (circle)
- **Buttons:**
  - Primary: 139-156px width, 40px height
  - Outline: 156px width, standard height
- **Input Fields:**
  - Desktop: 250-281px width, 48px height
  - Mobile: 250px width, 48px height
- **Textarea:** 281x212px (desktop), 250x212px (mobile)

---

## Implementation Priorities

### High Priority (Core Functionality)
1. ✅ Welcome page - DONE
2. 🔧 Fix Register page import path
3. 🔧 Create Form Input component template
4. ⚠️ Implement Login page
5. ⚠️ Implement App Layout header (critical for all authenticated pages)

### Medium Priority (Main Features)
6. ⚠️ Implement Topics page
7. ⚠️ Implement Articles page
8. ⚠️ Implement Article View page
9. ⚠️ Implement Article Create page
10. ⚠️ Implement Profile page

### Low Priority (Polish)
11. Responsive refinements
12. Loading states
13. Error handling UI
14. Animations/transitions

---

## Technical Notes

### Current Stack
- **Framework:** Angular 21 (standalone components)
- **Styling:** TailwindCSS v4
- **Routing:** Angular Router with lazy loading
- **Forms:** Angular Forms (ReactiveFormsModule likely needed)

### Architecture Patterns
- Standalone components (no NgModules)
- Lazy-loaded routes
- Layout components (BlankLayout, AuthLayout, AppLayout)
- Shared components (form-input)
- Feature-based folder structure

### Missing Dependencies
- May need `@angular/forms` for form handling (check if already installed)
- May need icons library or SVG handling for icons (user, send, hamburger menu)

---

## Next Steps Recommendations

1. **Fix existing issues:**
   - Fix register page import path
   - Create form-input template

2. **Implement Login page:**
   - Similar structure to register page
   - Two fields: email/username, password
   - "Se connecter" button

3. **Implement App Layout header:**
   - This is critical as it's used by all authenticated pages
   - Desktop and mobile variants
   - User menu with logout option

4. **Implement remaining pages in order:**
   - Topics page (simpler, good starting point)
   - Articles page
   - Article view page
   - Article create page
   - Profile page

5. **Add services:**
   - Auth service (likely exists, check)
   - Topics service
   - Articles service
   - Comments service

---

## Files to Review/Update

### Existing Files Needing Updates:
- `/front/src/app/features/auth/register/register-page/register-page.ts` - Fix import path
- `/front/src/app/shared/components/form-input/form-input.component.html` - Create missing template
- `/front/src/app/core/layouts/app-layout/app-layout.html` - Implement header

### New Files to Create:
- Form input template and styles
- All page templates and styles for unimplemented pages
- Header component (if extracted from app-layout)
- Navigation component
- User menu component

---

*Analysis completed based on Figma design and current codebase review.*

