import { Component } from '@angular/core';

@Component({
  selector: 'app-color-test',
  standalone: true,
  template: `
    <div class="p-8 bg-mdd-surface min-h-screen">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-secondary-900 mb-8">MDD Color Palette Test</h1>
        
        <!-- Primary Colors -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-secondary-800 mb-4">Primary Colors</h2>
          <div class="grid grid-cols-5 gap-4">
            <div class="card text-center">
              <div class="w-full h-16 bg-primary-500 rounded mb-2"></div>
              <p class="text-sm font-medium">primary-500</p>
              <p class="text-xs text-secondary-500">#7c3aed</p>
            </div>
            <div class="card text-center">
              <div class="w-full h-16 bg-primary-600 rounded mb-2"></div>
              <p class="text-sm font-medium">primary-600</p>
              <p class="text-xs text-secondary-500">#6b46c1</p>
            </div>
            <div class="card text-center">
              <div class="w-full h-16 bg-primary-700 rounded mb-2"></div>
              <p class="text-sm font-medium">primary-700</p>
              <p class="text-xs text-secondary-500">#5b21b6</p>
            </div>
          </div>
        </section>

        <!-- Button Examples -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-secondary-800 mb-4">Button Components</h2>
          <div class="flex gap-4 flex-wrap">
            <button class="btn-primary">S'abonner</button>
            <button class="btn-secondary">Annuler</button>
            <button class="btn-danger">Se déconnecter</button>
          </div>
        </section>

        <!-- Card Example -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-secondary-800 mb-4">Card Component</h2>
          <div class="card max-w-md">
            <div class="card-header">
              <h3 class="text-lg font-bold text-secondary-900">Titre du thème</h3>
            </div>
            <p class="text-secondary-600 mb-4">
              Description: lorem ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard...
            </p>
            <button class="btn-primary">S'abonner</button>
          </div>
        </section>

        <!-- Form Example -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-secondary-800 mb-4">Form Components</h2>
          <div class="card max-w-md">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Nom d'utilisateur
                </label>
                <input type="text" class="input-field" placeholder="Entrez votre nom">
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Email
                </label>
                <input type="email" class="input-field" placeholder="votre@email.com">
              </div>
              <button class="btn-primary w-full">Créer</button>
            </div>
          </div>
        </section>

        <!-- Text Examples -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-secondary-800 mb-4">Typography</h2>
          <div class="card">
            <h1 class="text-2xl font-bold text-secondary-900 mb-2">Heading 1</h1>
            <h2 class="text-xl font-semibold text-secondary-800 mb-2">Heading 2</h2>
            <h3 class="text-lg font-medium text-secondary-700 mb-2">Heading 3</h3>
            <p class="text-secondary-600 mb-2">Regular body text</p>
            <p class="text-secondary-500 mb-2">Secondary body text</p>
            <p class="text-primary">Primary colored text</p>
            <p class="text-danger-600">Danger colored text</p>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: []
})
export class ColorTestComponent {}
