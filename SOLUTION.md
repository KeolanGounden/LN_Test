# Solution Overview and Design Trade-offs

This document explains the architecture, design decisions, and trade-offs for the repository that contains an Angular frontend and an ASP.NET backend (ProductManagementAPI).

## High-level architecture

- Monorepo structure: frontend and backend live in the same repository under `Frontend/` and `Backend/`.
- Backend: ASP.NET Web API with a layered structure (Controllers, Services, Repositories, Entities). The codebase favors separation of concerns and dependency injection for testability.
- Frontend: Angular SPA under `Frontend/`, consuming the REST API for product and category data.
- Development-time convenience: `launchSettings.json`, sample in-memory DB (if present), and Docker compose files for local multi-container runs.

## Key design decisions

1) Monorepo vs multiple repositories

 - Decision: Use a monorepo for frontend and backend.
 - Rationale: Easier local development, single source for coordinating API/consumer changes, simpler developer onboarding for smaller projects.

2) Layered backend (Controllers → Services → Repositories)

 - Decision: Keep clear separation between HTTP layer, business logic, and data access.
 - Rationale: Improves testability and maintainability; easier to mock dependencies in unit tests.
 - Trade-offs: Slightly more boilerplate;

3) Use of in-memory or simple data layer for development

 - Decision: Development includes in-memory or simplified data contexts to speed local iteration.
 - Rationale: Fast setup for developers; no DB dependency for local runs.


4) Containerization with Docker Compose

 - Decision: Provide Docker Compose for local integration runs.
 - Rationale: Ensures consistent runtime and easier onboarding; useful for CI.
 - Trade-offs: Docker adds complexity for devs without Docker installed.

5) API design (RESTful)

 - Decision: REST endpoints for product and category resources.
 - Rationale: Standard, easy to consume from SPAs.


## Security

- Auth: The repo currently focuses on product management endpoints; 
- HTTPS: Ensure production endpoints are served over TLS; for local dev use Kestrel dev certs or a reverse proxy.


## Final notes

This repo is structured for pragmatic local development and quick iteration.