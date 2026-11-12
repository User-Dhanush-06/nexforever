# NexForever Infrastructure & Deployment

Phase 1 directory foundation for local containerized services and cloud deployment assets.

## Planned Assets (Phases 2 & 7)
- `docker-compose.yml` — Local MySQL 8 database, optional S3-compatible storage (MinIO), and backend container definitions.
- `backend.Dockerfile` — Multi-stage production container build for the Spring Boot 3 API.
- `.env.example` — Documented environment variable template (never commit real secrets).

See [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for deployment architecture and storage configuration.
