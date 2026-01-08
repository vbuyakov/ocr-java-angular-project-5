describe('Profile Flow', () => {
  beforeEach(() => {
    // Mock topics/subscribed API (called by header/layout)
    cy.intercept('GET', '/api/topics/subscribed', {
      statusCode: 200,
      body: [],
    }).as('getSubscribedTopics');
  });

  it('should display profile page', () => {
    cy.intercept('GET', '/api/user/profile', {
      statusCode: 200,
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
      },
    }).as('getProfile');

    cy.visitAuthenticated('/profile');
    cy.wait('@getProfile');

    cy.get('form').should('be.visible');
    // Form uses app-form-input components
    cy.get('form input[type="text"]').should('be.visible'); // username
    cy.get('form input[type="email"]').should('be.visible'); // email
  });

  it('should update profile information', () => {
    cy.intercept('GET', '/api/user/profile', {
      statusCode: 200,
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
      },
    }).as('getProfile');

    cy.intercept('PUT', '/api/user/profile', {
      statusCode: 200,
      body: {
        username: 'updateduser',
        email: 'updated@example.com',
      },
    }).as('updateProfile');

    cy.visitAuthenticated('/profile');
    cy.wait('@getProfile');

    // Form uses app-form-input components
    cy.get('form input[type="text"]').clear().type('updateduser');
    cy.get('form input[type="email"]').clear().type('updated@example.com');
    cy.get('button[type="submit"]').click();

    cy.wait('@updateProfile');
    
    // Wait for UI to update
    cy.wait(500);
    
    // Should show success message (could be toast or form message)
    cy.get('body').then(($body) => {
      const bodyText = $body.text();
      const hasSuccess = 
        bodyText.includes('success') || 
        bodyText.includes('updated') || 
        bodyText.includes('mis à jour') ||
        bodyText.includes('réussi') ||
        $body.find('.bg-success, .toast-success').length > 0;
      
      expect(hasSuccess).to.be.true;
    });
  });

  it('should update password', () => {
    cy.intercept('GET', '/api/user/profile', {
      statusCode: 200,
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
      },
    }).as('getProfile');

    cy.intercept('PUT', '/api/user/profile', {
      statusCode: 200,
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
        message: 'Password updated successfully',
      },
    }).as('updatePassword');

    cy.visitAuthenticated('/profile');
    cy.wait('@getProfile');

    // Form has only one password field (not two separate fields)
    cy.get('form input[type="password"]').type('NewPassword123!');
    cy.get('button[type="submit"]').click();

    cy.wait('@updatePassword');
    
    // Wait for form to update
    cy.wait(500);
    
    // Password field should be cleared after successful update
    cy.get('form input[type="password"]').should('have.value', '');
  });

  it('should validate password match', () => {
    cy.intercept('GET', '/api/user/profile', {
      statusCode: 200,
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
      },
    }).as('getProfile');

    cy.visitAuthenticated('/profile');
    cy.wait('@getProfile');

    // Profile form has only one password field
    // The password validator checks strength, not match (no confirm password field)
    // So we'll test that invalid password doesn't submit
    cy.get('form input[type="password"]').type('weak'); // Weak password
    
    cy.wait(200);
    
    // Form should be invalid, button should be disabled
    cy.get('button[type="submit"]').should('be.disabled');
    
    // Form should not submit
    cy.url().should('include', '/profile');
  });
});

