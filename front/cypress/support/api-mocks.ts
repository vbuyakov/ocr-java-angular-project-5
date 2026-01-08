/// <reference types="cypress" />

/**
 * Global API mocks to ensure no real API calls are made during tests
 * 
 * IMPORTANT: All API endpoints MUST be mocked in each test using cy.intercept()
 * before making any requests. This file provides a safety net to catch unmocked calls.
 * 
 * Tests should set up their mocks BEFORE cy.visit() or any user actions.
 */

// Safety net: Return 404 for unmocked API calls
// This helps identify tests that forgot to mock APIs
// Note: More specific intercepts in tests will override these
beforeEach(() => {
  // Intercept unmocked calls and return 404
  // Cannot use cy.log() inside intercept callbacks - use console.warn instead
  cy.intercept('GET', '/api/**', (req) => {
    console.warn('⚠️ WARNING: Unmocked GET request to', req.url);
    req.reply({ statusCode: 404, body: { message: 'API not mocked - add cy.intercept() in your test' } });
  }).as('unmockedGet');
  
  cy.intercept('POST', '/api/**', (req) => {
    console.warn('⚠️ WARNING: Unmocked POST request to', req.url);
    req.reply({ statusCode: 404, body: { message: 'API not mocked - add cy.intercept() in your test' } });
  }).as('unmockedPost');
  
  cy.intercept('PUT', '/api/**', (req) => {
    console.warn('⚠️ WARNING: Unmocked PUT request to', req.url);
    req.reply({ statusCode: 404, body: { message: 'API not mocked - add cy.intercept() in your test' } });
  }).as('unmockedPut');
  
  cy.intercept('DELETE', '/api/**', (req) => {
    console.warn('⚠️ WARNING: Unmocked DELETE request to', req.url);
    req.reply({ statusCode: 404, body: { message: 'API not mocked - add cy.intercept() in your test' } });
  }).as('unmockedDelete');
});

