# MddWebui

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

For CI/CD pipelines, run:

```bash
npm run e2e:ci
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Code Coverage

This project uses [Vitest](https://vitest.dev/) with `@vitest/coverage-v8` for code coverage reporting.

### Running tests with coverage

To run unit tests with coverage:

```bash
ng test -- --coverage
```

Or use the npm script:

```bash
npm test -- --watch=false --coverage
```

### Generating coverage report

The project includes a script to generate a comprehensive coverage report in Markdown format (French).

**Generate report only** (requires existing coverage data):

```bash
npm run coverage:report
```

**Run tests and generate report**:

```bash
npm run coverage:full
```

This will:
1. Execute all unit tests with coverage (`npm test -- --watch=false`)
2. Generate `RAPPORT_COUVERTURE.md` with:
   - Unit test coverage statistics (Lines, Statements, Functions, Branches)
   - Coverage per file
   - E2E test statistics
   - Overall summary

The report is saved to `RAPPORT_COUVERTURE.md` at the project root.

### Coverage files

- Coverage data: `coverage/mdd-webui/coverage-final.json`
- Report script: `scripts/generate-coverage-report.js`
- Generated report: `RAPPORT_COUVERTURE.md`

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
