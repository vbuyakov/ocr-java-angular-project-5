# Cypress Integration Tests

This directory contains end-to-end integration tests for the MDD WebUI application using Cypress.

## Prerequisites

- Node.js and npm installed
- **No manual server startup needed** - the e2e scripts handle this automatically!

## Running Tests

### Run Tests with Angular CLI (Recommended)

```bash
npm run e2e
```

or directly:

```bash
ng e2e
```

This command will:
1. ✅ Start the Angular dev server automatically (`ng serve`)
2. ✅ Wait for the server to be ready at `http://localhost:4200`
3. ✅ Open Cypress Test Runner interactively
4. ✅ Stop the server when tests complete

### Run Tests in CI/CD Mode (Headless)

```bash
npm run e2e:ci
```

or directly:

```bash
ng run mdd-webui:e2e:ci
```

This runs tests in headless mode, perfect for CI/CD pipelines:
- ✅ Starts the Angular dev server automatically
- ✅ Runs all Cypress tests headlessly
- ✅ Stops the server when tests complete
- ✅ No manual server startup needed!

### Run Tests Manually (Server Must Be Running)

If you already have the server running (`npm start`), you can run Cypress directly:

```bash
npm run cypress:run
```

or

```bash
npm run cypress:open
```

## Test Structure

```
cypress/
├── e2e/                    # Integration test files
│   ├── auth/              # Authentication tests
│   │   ├── login.cy.ts
│   │   └── register.cy.ts
│   ├── articles/          # Articles feature tests
│   │   └── articles.cy.ts
│   ├── profile/           # Profile tests
│   │   └── profile.cy.ts
│   ├── topics/            # Topics tests
│   │   └── topics.cy.ts
│   ├── navigation/        # Navigation tests
│   │   └── navigation.cy.ts
│   └── welcome/           # Welcome page tests
│       └── welcome.cy.ts
├── support/               # Support files
│   ├── commands.ts       # Custom Cypress commands
│   └── e2e.ts            # Global test configuration
└── fixtures/             # Test data (if needed)
```

## Custom Commands

The following custom commands are available:

### `cy.login(username, password)`
Logs in a user programmatically.

```typescript
cy.login('testuser', 'password123');
```

### `cy.logout()`
Logs out the current user.

```typescript
cy.logout();
```

### `cy.waitForApi()`
Waits for API requests to complete.

```typescript
cy.waitForApi();
```

## Test Coverage

The integration tests cover:

1. **Authentication Flow**
   - Login with valid/invalid credentials
   - Registration with validation
   - Form validation
   - Redirects

2. **Articles Flow**
   - Viewing articles list
   - Creating new articles
   - Viewing individual articles
   - Adding comments

3. **Profile Management**
   - Viewing profile
   - Updating profile information
   - Changing password
   - Password validation

4. **Topics Management**
   - Viewing topics
   - Subscribing to topics
   - Unsubscribing from topics
   - Filtering topics

5. **Navigation**
   - Header navigation
   - Mobile menu
   - Route guards
   - Logout flow

6. **Welcome Page**
   - Unauthenticated access
   - Authenticated redirect

## Configuration

Cypress configuration is in `cypress.config.ts` at the project root.

Key settings:
- **Base URL**: `http://localhost:4200` (Angular dev server)
- **Viewport**: 1280x720 (desktop)
- **Video**: Enabled (saved on failure)
- **Screenshots**: Enabled (on failure)

## API Mocking

**IMPORTANT: All API calls MUST be mocked - no real API requests are made during tests.**

Tests use `cy.intercept()` to mock API responses. This ensures:
- ✅ **No real backend needed** - tests are completely isolated
- ✅ **No network dependencies** - tests run faster and more reliably
- ✅ **Deterministic results** - same responses every time
- ✅ **Error scenario testing** - easy to test error cases

### Mocking Pattern

**Always set up mocks BEFORE visiting pages or triggering actions:**

```typescript
it('should display articles', () => {
  // 1. Set up API mock FIRST
  cy.intercept('GET', '/api/articles*', {
    statusCode: 200,
    body: { articles: [] }
  }).as('getArticles');

  // 2. Then visit the page
  cy.visit('/articles');
  
  // 3. Wait for the mocked request
  cy.wait('@getArticles');
  
  // 4. Assert on the result
  cy.get('body').should('contain.text', 'Article');
});
```

### Safety Net

The `cypress/support/api-mocks.ts` file provides a safety net that will:
- Log warnings if unmocked API calls are detected
- Help identify tests that forgot to mock APIs
- Return 404 responses for unmocked calls (tests should override these)

### Best Practices

1. **Mock before visit**: Always set up `cy.intercept()` before `cy.visit()`
2. **Mock all endpoints**: Every API call in your test must be mocked
3. **Use aliases**: Use `.as('aliasName')` to wait for specific requests
4. **Test error cases**: Mock error responses (400, 401, 500, etc.)
5. **No real requests**: Never make real API calls in tests

## Best Practices

1. **Use data-testid attributes** (if available) for more reliable selectors
2. **Wait for API calls** using `cy.wait('@alias')`
3. **Clean up state** in `beforeEach` hooks
4. **Use custom commands** for common operations
5. **Mock API responses** instead of relying on real backend
6. **Test user flows**, not implementation details

## Troubleshooting

### Port 4200 is already in use

If you see this error, make sure no other Angular server is running:

```bash
# Find and kill the process on port 4200
lsof -ti:4200 | xargs kill -9

# Then run tests again
npm run e2e
```

### Tests fail with "ResizeObserver" errors
This is handled in `cypress/support/e2e.ts` - the error is ignored.

### Tests timeout
- The e2e scripts automatically start the server, so this shouldn't be an issue
- If tests still timeout, verify the base URL in `cypress.config.ts`
- Increase timeout in test: `cy.get(...).should('exist', { timeout: 10000 })`

### Element not found
- Use `cy.get()` with proper selectors
- Wait for elements to be visible: `cy.get(...).should('be.visible')`
- Check if element is in a different viewport (mobile vs desktop)

### "Trash" warning
The warning about failing to trash existing run results is harmless and doesn't affect test execution. It's a macOS-specific issue with Cypress cleanup.

## CI/CD Integration

For CI/CD pipelines, use:

```bash
npm run e2e:ci
```

or simply:

```bash
npm run e2e
```

This will:
- ✅ **Automatically start the Angular server**
- ✅ **Wait for server to be ready**
- ✅ Run all tests headlessly
- ✅ Generate videos and screenshots on failure
- ✅ Exit with proper status codes
- ✅ **Automatically stop the server when done**
- ✅ Work in Docker containers and CI environments

### Example CI/CD Configuration

**GitHub Actions:**
```yaml
- name: Run E2E tests
  run: npm run e2e:ci
```

**GitLab CI:**
```yaml
test:e2e:
  script:
    - npm run e2e:ci
```

**Jenkins:**
```groovy
sh 'npm run e2e:ci'
```

**Using Angular CLI directly:**
```bash
ng run mdd-webui:e2e:ci
```

No need to manually start/stop the server - Angular CLI handles it automatically!

## Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Angular Testing with Cypress](https://docs.cypress.io/guides/component-testing/angular/overview)

