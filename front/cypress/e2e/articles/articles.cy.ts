describe('Articles Flow', () => {
  // Note: Token is set in each test using onBeforeLoad to ensure it's available
  // when the app initializes and checks authentication

  it('should display articles page', () => {
    // Mock API BEFORE visiting the page
    cy.intercept('GET', '/api/articles*', {
      statusCode: 200,
      body: {
        articles: [
          {
            id: 1,
            title: 'Test Article 1',
            content: 'Test content',
            author: { username: 'testuser' },
            createdAt: '2024-01-01',
          },
          {
            id: 2,
            title: 'Test Article 2',
            content: 'Test content 2',
            author: { username: 'testuser' },
            createdAt: '2024-01-02',
          },
        ],
        total: 2,
      },
    }).as('getArticles');

    cy.visitAuthenticated('/articles');
    cy.wait('@getArticles');

    // Check that articles are displayed
    cy.get('body').should('contain.text', 'Article');
  });

  it('should navigate to create article page', () => {
    // Mock articles API for the initial page load
    cy.intercept('GET', '/api/articles*', {
      statusCode: 200,
      body: { articles: [], total: 0 },
    }).as('getArticles');

    // Mock topics selector API (will be called when navigating to create page)
    cy.intercept('GET', '/api/topics/selector', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Technology', description: 'Tech topics', isUserSubscribed: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ],
    }).as('getTopicsSelector');

    cy.visitAuthenticated('/articles');
    cy.wait('@getArticles');

    cy.get('a[routerLink="/articles/create"]').click();
    cy.url().should('include', '/articles/create');
  });

  it('should display create article form', () => {
    // Mock topics API (needed for the form) - uses /api/topics/selector endpoint
    cy.intercept('GET', '/api/topics/selector', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Technology', description: 'Tech topics', isUserSubscribed: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ],
    }).as('getTopics');

    cy.visitAuthenticated('/articles/create');
    cy.wait('@getTopics');

    cy.get('form').should('be.visible');
    cy.get('select[formControlName="topicId"]').should('be.visible');
    // Form uses app-form-input components for title and content
    cy.get('form input[type="text"]').should('be.visible'); // title
    cy.get('form textarea').should('be.visible'); // content
  });

  it('should create a new article', () => {
    cy.intercept('GET', '/api/topics/selector', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Technology', description: 'Tech topics', isUserSubscribed: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: 2, name: 'Science', description: 'Science topics', isUserSubscribed: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ],
    }).as('getTopics');

    cy.intercept('POST', '/api/articles', {
      statusCode: 201,
      body: {
        id: 3,
        title: 'New Article',
        content: 'Article content',
      },
    }).as('createArticle');

    // Mock articles list API (will be called after redirect)
    cy.intercept('GET', '/api/articles*', {
      statusCode: 200,
      body: { articles: [], total: 0 },
    }).as('getArticlesAfterCreate');

    cy.visitAuthenticated('/articles/create');
    cy.wait('@getTopics');

    // Select a topic from dropdown - select by option text since it uses [ngValue]
    cy.get('select[formControlName="topicId"]').select('Technology');
    
    // Form uses app-form-input components
    cy.get('form input[type="text"]').type('New Article');
    cy.get('form textarea').type('Article content');
    
    cy.get('button[type="submit"]').click();

    cy.wait('@createArticle');
    
    // Should redirect to articles list
    cy.url().should('include', '/articles');
    cy.wait('@getArticlesAfterCreate');
  });

  it('should validate required fields in create form', () => {
    // Mock topics API (needed for the form) - uses /api/topics/selector endpoint
    cy.intercept('GET', '/api/topics/selector', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Technology', description: 'Tech topics', isUserSubscribed: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ],
    }).as('getTopics');

    cy.visitAuthenticated('/articles/create');
    cy.wait('@getTopics');
    
    // Form should be invalid, button should be disabled
    cy.get('button[type="submit"]').should('be.disabled');
    
    // Form should not submit (no API call should be made)
    cy.url().should('include', '/articles/create');
  });

  it('should view an article', () => {
    cy.intercept('GET', '/api/articles/1', {
      statusCode: 200,
      body: {
        id: 1,
        title: 'Test Article',
        content: 'Test content',
        author: { username: 'testuser' },
        createdAt: '2024-01-01',
      },
    }).as('getArticle');

    cy.intercept('GET', '/api/articles/1/comments', {
      statusCode: 200,
      body: [],
    }).as('getComments');

    cy.visitAuthenticated('/articles/1');
    cy.wait(['@getArticle', '@getComments']);

    cy.get('body').should('contain.text', 'Test Article');
    cy.get('body').should('contain.text', 'Test content');
  });

  it('should add a comment to an article', () => {
    cy.intercept('GET', '/api/articles/1', {
      statusCode: 200,
      body: {
        id: 1,
        title: 'Test Article',
        content: 'Test content',
        author: { username: 'testuser' },
        createdAt: '2024-01-01',
      },
    }).as('getArticle');

    cy.intercept('GET', '/api/articles/1/comments', {
      statusCode: 200,
      body: [],
    }).as('getComments');

    cy.intercept('POST', '/api/articles/1/comments', {
      statusCode: 201,
      body: {
        id: 1,
        content: 'New comment',
        author: { username: 'testuser' },
      },
    }).as('createComment');

    cy.visitAuthenticated('/articles/1');
    cy.wait(['@getArticle', '@getComments']);

    // After successful comment creation, component calls loadComments()
    // Set up intercept for the reload BEFORE submitting
    cy.intercept('GET', '/api/articles/1/comments', (req) => {
      // Only intercept the second call (after comment creation)
      req.reply({
        statusCode: 200,
        body: [
          {
            id: 1,
            content: 'New comment',
            author: { username: 'testuser' },
          },
        ],
      });
    }).as('getCommentsReload');

    // Find and fill comment form - comment form uses app-form-input with textarea
    cy.get('form textarea').type('New comment');
    cy.get('form button[type="submit"]').click();

    cy.wait('@createComment');
    
    // Wait for comments to reload (component automatically calls loadComments after success)
    cy.wait('@getCommentsReload', { timeout: 5000 });
    
    // Comment should appear in the page
    cy.get('body').should('contain.text', 'New comment');
  });
});

