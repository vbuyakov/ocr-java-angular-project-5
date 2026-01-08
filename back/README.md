# MDD API - Spring Boot Application

MDD (Monde de Dév) API - A Spring Boot REST API application.

## Prerequisites

- Java 21 or higher
- Maven 3.6+ 
- MySQL 8.0+ (or Docker with MySQL) - Required for running the application
- Environment variables configured (see Configuration section)

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# App settings
APP_NAME=MDDApp

# Server settings
SERVER_PORT=8080
API_PATH=/api

# Database settings
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=mddapp
MYSQL_USER=mdduser
MYSQL_PASSWORD=mddpassword
MYSQL_DB_URL=jdbc:mysql://127.0.0.1:3306/mddapp
# For Docker: MYSQL_DB_URL=jdbc:mysql://db:3306/mddapp

# JWT settings
JWT_SECRET_KEY=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b
JWT_EXPIRATION_TIME=7200000

# Docker build Cache for MVN
DOCKER_BUILDKIT=1
COMPOSE_DOCKER_CLI_BUILD=1
```

## Running the Application

### Option 1: Using Maven (Recommended for Development)

1. **Set environment variables** (export them or use a `.env` file loader):
   ```bash
   export APP_NAME=MDDApp
   export SERVER_PORT=8080
   export API_PATH=/api
   export MYSQL_DATABASE=mddapp
   export MYSQL_USER=mdduser
   export MYSQL_PASSWORD=mddpassword
   export MYSQL_DB_URL=jdbc:mysql://127.0.0.1:3306/mddapp
   export JWT_SECRET_KEY=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b
   export JWT_EXPIRATION_TIME=7200000
   ```

2. **Start the application**:
   ```bash
   mvn spring-boot:run
   ```

   Or using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```

   On Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

3. **The application will be available at**:
   - Base URL: `http://localhost:8080/api`
   - Swagger UI: `http://localhost:8080/api/swagger-ui.html`

### Option 2: Build and Run JAR

1. **Build the application**:
   ```bash
   mvn clean package
   ```

2. **Run the JAR file**:
   ```bash
   java -jar target/mddapi-0.0.1-SNAPSHOT.jar
   ```

   Or with environment variables:
   ```bash
   export APP_NAME=MDDApp
   export SERVER_PORT=8080
   export API_PATH=/api
   export MYSQL_DATABASE=mddapp
   export MYSQL_USER=mdduser
   export MYSQL_PASSWORD=mddpassword
   export MYSQL_DB_URL=jdbc:mysql://127.0.0.1:3306/mddapp
   export JWT_SECRET_KEY=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b
   export JWT_EXPIRATION_TIME=7200000
   
   java -jar target/mddapi-0.0.1-SNAPSHOT.jar
   ```

### Option 3: Using Docker

1. **Build the Docker image**:
   ```bash
   docker build -t mddapi .
   ```

2. **Run the container** (with environment variables):
   ```bash
   docker run -p 8080:8080 \
     -e APP_NAME=MDDApp \
     -e SERVER_PORT=8080 \
     -e API_PATH=/api \
     -e MYSQL_DATABASE=mddapp \
     -e MYSQL_USER=mdduser \
     -e MYSQL_PASSWORD=mddpassword \
     -e MYSQL_DB_URL=jdbc:mysql://host.docker.internal:3306/mddapp \
     -e JWT_SECRET_KEY=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b \
     -e JWT_EXPIRATION_TIME=7200000 \
     mddapi
   ```

## Testing

### Quick Reference

```bash
# Run all tests (unit + integration) and generate coverage report
mvn clean verify jacoco:report

# View the coverage report
open target/site/jacoco/index.html
```

### Test Types

The project includes two types of tests:

1. **Unit Tests** (`*Test.java`) - Run with Maven Surefire during `mvn test` (125 tests)
2. **Integration Tests** (`*IT.java`) - Run with Maven Failsafe during `mvn verify` (49 tests: 12 topics + 16 auth + 13 articles + 8 user)

### Run Unit Tests Only

```bash
mvn test
```

All unit tests should pass, including controller tests. The tests use:
- `@MockitoBean` (replacing deprecated `@MockBean`) for mocking dependencies
- Custom `TestWebMvcConfig` to resolve `@AuthenticationPrincipal User` in controller tests
- `User` class implements `Principal` interface to work with MockMvc's principal() method

### Run Integration Tests

Integration tests use H2 in-memory database, so **no Docker is required**.

```bash
# Run both unit and integration tests
mvn verify

# Run only integration tests (after unit tests have run)
mvn failsafe:integration-test

# Run a specific integration test
mvn verify -Dtest=TopicControllerIT
```

### Run Tests with Coverage Report

**To run all tests and generate a coverage report that includes integration tests:**

```bash
mvn clean verify jacoco:report
```

This command will:
1. Run all unit tests (125 tests)
2. Run all integration tests (49 tests: 12 topics + 16 auth + 13 articles + 8 user)
3. Generate JaCoCo coverage report including both test types
4. Report location: `target/site/jacoco/index.html`

**Note:** The report is automatically generated during `verify` phase. You can also run `mvn verify` without `jacoco:report` - the report will still be generated.

**Other options:**

```bash
# Unit tests only (125 tests)
mvn clean test jacoco:report

# All tests without generating report (report auto-generated in verify phase)
mvn clean verify
```

**View the report:**
```bash
# On macOS
open target/site/jacoco/index.html

# On Linux
xdg-open target/site/jacoco/index.html

# On Windows
start target/site/jacoco/index.html
```

**Current Coverage:** All tests passing with good coverage across services, controllers, handlers, validators, and utilities.

### Run Specific Test Classes

```bash
# Run all service tests
mvn test -Dtest="*ServiceTest"

# Run all handler tests
mvn test -Dtest="*HandlerTest"

# Run a specific test class
mvn test -Dtest=AuthServiceTest

# Run a specific integration test
mvn verify -Dtest=TopicControllerIT
mvn verify -Dtest=AuthControllerIT
mvn verify -Dtest=ArticleControllerIT
mvn verify -Dtest=UserControllerIT
```

### Check Coverage Threshold

The project is configured to enforce a minimum of 75% code coverage. The check is **not run automatically** - you must explicitly request it:

```bash
# Run all tests and check coverage threshold
mvn clean verify jacoco:check

# Or just check coverage (after tests have run)
mvn jacoco:check
```

**Note:** JaCoCo check is optional and won't fail the build during `mvn verify`. It only runs when explicitly called with `jacoco:check`.

## API Documentation

Once the application is running, access the Swagger UI at:
- **Swagger UI**: `http://localhost:8080/api/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/api/v3/api-docs`

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── om/openclassrooms/mddapi/
│   │       ├── auth/          # Authentication module
│   │       ├── content/       # Articles, Comments, Topics
│   │       ├── user/          # User management
│   │       ├── security/      # JWT security
│   │       ├── common/         # Shared utilities
│   │       └── config/        # Configuration classes
│   └── resources/
│       ├── application.yaml   # Application configuration
│       └── messages.properties # i18n messages
└── test/
    └── java/                  # Unit tests
```

## Development

### Build the Project

```bash
mvn clean compile
```

### Package the Application

```bash
mvn clean package
```

### Skip Tests During Build

```bash
mvn clean package -DskipTests
```

## Troubleshooting

### Database Connection Issues

- Ensure MySQL is running and accessible
- Verify database credentials in environment variables
- Check that the database `mddapp` exists (or Hibernate will create it with `ddl-auto: update`)

### Port Already in Use

If port 8080 is already in use, change it:
```bash
export SERVER_PORT=8081
mvn spring-boot:run
```

### Environment Variables Not Loading

Make sure to export all required environment variables before starting the application, or use a tool like `dotenv` to load them from a `.env` file.

## License

[Add your license information here]
