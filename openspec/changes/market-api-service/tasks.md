# Tasks: market-api service implementation

## Task 1: Create the Spring Boot service skeleton
- Add the Maven project configuration and Spring Boot starter dependencies.
- Configure the application bootstrap and runtime settings.

## Task 2: Implement the API contract
- Add controllers for health, summary, listing, what-if, and export endpoints.
- Define model records for request and response payloads.

## Task 3: Implement market data access
- Read the bundled CSV dataset from the classpath.
- Build aggregate statistics and filtered property search logic.
- Apply sorting based on query parameters.

## Task 4: Implement ML delegation
- Add an HTTP client that sends property features to the Python `ml-api`.
- Return a `503` response if the downstream service is unavailable.

## Task 5: Implement export support
- Generate CSV output for exported filtered properties.
- Return a PDF-compatible response payload for the export endpoint.

## Task 6: Verify the build
- Run Maven package/compile to confirm the service builds successfully.
- Validate the created Docker and ignore files.

## Interview speaking notes

This change follows the intended OpenSpec flow: proposal first, then design, then tasks. In practice, the API contract was already authored as an OpenAPI spec, and the implementation work converted that contract into the runtime Spring Boot service now exposed in the repo.
