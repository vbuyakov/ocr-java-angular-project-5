/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login a user
       * @example cy.login('testuser', 'password123')
       */
      login(username: string, password: string): Chainable<void>;
      
      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<void>;
      
      /**
       * Custom command to wait for API requests to complete
       * @example cy.waitForApi()
       */
      waitForApi(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (username: string, password: string) => {
  // Set the token using the correct key that AuthService expects
  // AuthService uses 'auth-token' as the key, not 'token'
  cy.window().then((win) => {
    win.localStorage.setItem('auth-token', 'test-token-123');
  });
});

Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('auth-token');
  });
  cy.visit('/');
});

Cypress.Commands.add('waitForApi', () => {
  // Wait for any pending API requests to complete
  cy.wait(500); // Adjust timing as needed
});

/**
 * Visit a page with authentication token set
 * @example cy.visitAuthenticated('/articles')
 */
Cypress.Commands.add('visitAuthenticated', (url: string) => {
  cy.visit(url, {
    onBeforeLoad: (win) => {
      win.localStorage.setItem('auth-token', 'test-token-123');
    },
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Visit a page with authentication token already set
       * @example cy.visitAuthenticated('/articles')
       */
      visitAuthenticated(url: string): Chainable<void>;
    }
  }
}

export {};

