describe('Navigation Flow', () => {
  it('should navigate between pages using header links', () => {
    // Mock APIs before visiting
    cy.intercept('GET', '/api/articles*', {
      statusCode: 200,
      body: { articles: [], total: 0 },
    }).as('getArticles');
    
    cy.intercept('GET', '/api/topics*', {
      statusCode: 200,
      body: [],
    }).as('getTopics');
    
    // Topics page might also call /api/topics/subscribed
    cy.intercept('GET', '/api/topics/subscribed', {
      statusCode: 200,
      body: [],
    }).as('getSubscribedTopics');
    
    cy.intercept('GET', '/api/user/profile', {
      statusCode: 200,
      body: { username: 'testuser', email: 'test@example.com' },
    }).as('getProfile');

    cy.visitAuthenticated('/articles');
    cy.wait('@getArticles');

    // Navigate to topics
    cy.get('a[routerLink="/topics"]').click();
    cy.wait('@getTopics');
    cy.url().should('include', '/topics');

    // Navigate back to articles
    cy.get('a[routerLink="/articles"]').click();
    cy.wait('@getArticles');
    cy.url().should('include', '/articles');

    // Navigate to profile
    cy.get('a[routerLink="/profile"]').click();
    cy.wait('@getProfile');
    cy.url().should('include', '/profile');
  });

  it('should logout and redirect to home', () => {
    cy.intercept('GET', '/api/articles*', {
      statusCode: 200,
      body: { articles: [], total: 0 },
    }).as('getArticles');

    cy.visitAuthenticated('/articles');
    cy.wait('@getArticles');

    // Click logout button
    cy.get('button').contains('Se déconnecter').click();

    // Should redirect to home (handle both with and without trailing slash)
    cy.url().should('satisfy', (url: string) => {
      const baseUrl = Cypress.config().baseUrl || 'http://localhost:4200';
      return url === baseUrl || url === baseUrl + '/';
    });
    
    // Should not show authenticated navigation
    cy.get('nav a[routerLink="/articles"]').should('not.exist');
  });

  it('should redirect unauthenticated users to login', () => {
    cy.logout();
    
    // Try to access protected route
    cy.visit('/articles');
    
    // Should redirect to login
    cy.url().should('include', '/auth/login');
  });

  it('should redirect authenticated users away from login/register', () => {
    // Try to access login page (with auth token set)
    cy.visitAuthenticated('/auth/login');
    
    // Should redirect to articles
    cy.url().should('include', '/articles');
  });

  it('should show mobile menu on small screens', () => {
    // Mock API before visiting
    cy.intercept('GET', '/api/articles*', {
      statusCode: 200,
      body: { articles: [], total: 0 },
    }).as('getArticles');

    cy.viewport(375, 667); // Mobile viewport
    cy.visitAuthenticated('/articles');
    cy.wait('@getArticles');

    // Mobile menu button should be visible
    cy.get('button[aria-label="Toggle menu"]').should('be.visible');
    
    // Click to open menu
    cy.get('button[aria-label="Toggle menu"]').click();
    
    // Mobile menu should be visible
    cy.get('aside').should('be.visible');
    
    // Click backdrop to close (use force since it might be covered)
    cy.get('button[aria-label="Close menu"]').click({ force: true });
    
    // Menu should be hidden
    cy.get('aside').should('not.exist');
  });

  it('should navigate using mobile menu', () => {
    // Mock APIs before visiting
    cy.intercept('GET', '/api/articles*', {
      statusCode: 200,
      body: { articles: [], total: 0 },
    }).as('getArticles');
    
    cy.intercept('GET', '/api/topics*', {
      statusCode: 200,
      body: [],
    }).as('getTopics');
    
    // Topics page might also call /api/topics/subscribed
    cy.intercept('GET', '/api/topics/subscribed', {
      statusCode: 200,
      body: [],
    }).as('getSubscribedTopics');

    cy.viewport(375, 667);
    cy.visitAuthenticated('/articles');
    cy.wait('@getArticles');

    // Open mobile menu
    cy.get('button[aria-label="Toggle menu"]').click();
    
    // Navigate to topics from mobile menu
    cy.get('aside a[routerLink="/topics"]').click();
    cy.wait('@getTopics');
    
    // Should navigate and close menu
    cy.url().should('include', '/topics');
    cy.get('aside').should('not.exist');
  });
});

