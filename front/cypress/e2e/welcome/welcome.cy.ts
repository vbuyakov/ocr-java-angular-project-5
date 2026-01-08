describe('Welcome Page', () => {
  it('should display welcome page for unauthenticated users', () => {
    cy.logout();
    cy.visit('/');

    // Welcome page should show login and register buttons
    // Check for actual elements that exist on the page
    cy.get('a[routerLink="/auth/login"]').should('be.visible');
    cy.get('a[routerLink="/auth/register"]').should('be.visible');
    
    // Also check for the welcome image
    cy.get('img[alt*="Welcome"], img[alt*="MDD"]').should('exist');
  });

  it('should show login and register links', () => {
    cy.logout();
    cy.visit('/');

    // Check for login link
    cy.get('a[routerLink="/auth/login"], a[href*="login"]').should('be.visible');
    // Check for register link
    cy.get('a[routerLink="/auth/register"], a[href*="register"]').should('be.visible');
  });

  it('should redirect authenticated users to articles', () => {
    // Visit with auth token set
    cy.visitAuthenticated('/');

    // Should redirect to articles
    cy.url().should('include', '/articles');
  });
});

