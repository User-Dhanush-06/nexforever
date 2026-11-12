# NexForever Backend (`Spring Boot 3 / Java 17`)

Phase 1 directory foundation for the NexForever REST API server.

## Planned Layered Structure (Phase 2)
```text
backend/
├── pom.xml
├── mvnw / mvnw.cmd
└── src/
    ├── main/
    │   ├── java/com/nexforever/platform/
    │   │   ├── config/
    │   │   ├── security/
    │   │   ├── controller/
    │   │   ├── service/
    │   │   ├── repository/
    │   │   ├── entity/
    │   │   ├── dto/
    │   │   ├── mapper/
    │   │   ├── exception/
    │   │   └── validation/
    │   └── resources/
    │       ├── application.yml
    │       └── db/migration/   (Flyway V1..Vn SQL migrations)
    └── test/
```

See [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for schema, security, and API specifications.
