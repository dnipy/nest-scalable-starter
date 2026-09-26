# Nest Scalable Starter

A production-oriented **NestJS backend starter** designed around clear service boundaries, background processing, infrastructure isolation, and built-in observability.

This repository is primarily a **software architecture showcase** rather than a generic CRUD boilerplate. It demonstrates how I approach structuring a NestJS application that needs to grow beyond a single HTTP process.

---

## Architecture

The application is intentionally split into separate runtime processes:

```text
                         ┌─────────────────────┐
                         │       Client        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      API App        │
                         │      NestJS         │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
               PostgreSQL        Redis          WebSocket
                    │               │               │
                    │               ▼               │
                    │            BullMQ              │
                    │               │               │
                    │               ▼               │
                    │        ┌─────────────┐         │
                    │        │   Worker    │         │
                    │        │   NestJS    │         │
                    │        └──────┬──────┘         │
                    │               │                │
                    └───────────────┼────────────────┘
                                    │
                                    ▼
                           External Services
```

The API and worker are separate NestJS applications sharing the same codebase and infrastructure layer.

This allows HTTP workloads and background workloads to scale independently.

---

# Project Structure

```text
src/
├── apps/
│   ├── api/
│   │   ├── api.module.ts
│   │   └── main.ts
│   │
│   └── worker/
│       ├── main.ts
│       └── worker.module.ts
│
├── features/
│   └── features.module.ts
│
├── shared/
│   ├── http/
│   │   ├── exceptions/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   ├── middleware/
│   │   └── throttler/
│   │
│   ├── infrastructure/
│   │   ├── cache/
│   │   ├── config/
│   │   ├── database/
│   │   │   └── prisma/
│   │   ├── queue/
│   │   └── redis/
│   │
│   ├── observability/
│   │   ├── alert/
│   │   ├── error-tracking/
│   │   ├── logger/
│   │   ├── metrics/
│   │   └── tracing/
│   │
│   ├── runtime/
│   │   ├── bootstrap/
│   │   ├── healthz/
│   │   └── shutdown/
│   │
│   └── websocket/
│
└── workers/
    └── worker.module.ts

IaC/
├── app/
│   ├── docker-compose.yml
│   ├── .env.sample
│   └── conf/
│       ├── caddy/
│       ├── postgres/
│       └── redis/
│
└── observability/
    ├── docker-compose.yml
    ├── alloy/
    ├── grafana/
    ├── loki/
    ├── prometheus/
    └── tempo/
```

The structure separates **business features**, **shared application concerns**, **infrastructure**, and **runtime concerns** instead of putting everything under a flat collection of modules.

---

# Design Principles

## API / Worker Separation

The API process is responsible for request/response workloads.

The worker process handles asynchronous workloads through BullMQ.

```text
HTTP Request
     │
     ▼
    API
     │
     ▼
   BullMQ
     │
     ▼
   Worker
     │
     ▼
Background processing
```

This avoids turning long-running or resource-intensive operations into HTTP request problems.

It also makes independent scaling possible:

```text
API     × N
Worker  × M
```

---

## Shared Infrastructure, Separate Runtime

The API and worker use the same underlying infrastructure modules:

- PostgreSQL / Prisma
- Redis
- BullMQ
- Logging
- Metrics
- Tracing
- Error tracking
- Configuration
- Runtime lifecycle management

But they have independent bootstrap entry points.

This keeps the runtime boundary explicit without duplicating infrastructure code.

---

# Infrastructure

The application infrastructure is containerized and separated from the application code.

### Application stack

The application environment can include:

- NestJS API
- NestJS Worker
- PostgreSQL
- Redis
- Caddy
- supporting infrastructure

### Observability stack

Observability is intentionally separated into its own compose environment:

```text
Application VPS
│
├── API
├── Worker
├── PostgreSQL
├── Redis
└── ...
       │
       │ OpenTelemetry
       │
       ▼
Observability VPS
│
├── Alloy
├── Prometheus
├── Loki
├── Tempo
└── Grafana
```

This mirrors a production setup where application infrastructure and observability infrastructure can live on different machines.

---

# Observability

Observability is a first-class part of the starter rather than something added after deployment.

The stack is based around OpenTelemetry and Grafana's observability ecosystem.

```text
                    Application
                        │
            ┌───────────┼───────────┐
            │           │           │
           Logs       Metrics      Traces
            │           │           │
            ▼           ▼           ▼
           Alloy    Prometheus     Tempo
            │                       │
            ▼                       │
           Loki                     │
            │           ┌───────────┘
            │           │
            └──────┬────┘
                   ▼
                Grafana
```

### Logs

Application logging uses structured logging with Pino.

Request logging includes:

- request IDs
- HTTP method
- route
- status
- timing
- structured context

Sensitive request information is redacted where appropriate.

### Metrics

Application metrics include HTTP-level measurements such as:

- request count
- error count
- request duration
- status codes
- route patterns

Queue metrics are also exposed for background workloads:

```text
queue waiting
queue active
queue delayed
```

### Tracing

OpenTelemetry provides distributed tracing for the API and worker processes.

The API and worker use distinct service names:

```text
nestapp-api
nestapp-worker
```

This makes asynchronous processing visible across service boundaries.

### Correlation

Logs, metrics, and traces are designed to be investigated together rather than treated as isolated systems.

The goal is a workflow such as:

```text
Request
   ↓
Trace
   ↓
Log
   ↓
Queue
   ↓
Worker
   ↓
Worker Trace
   ↓
Worker Logs
```

---

# Grafana

The repository includes Grafana provisioning for:

- datasources
- dashboards
- alerting
- contact points

A starter overview dashboard is included under:

```text
infra/observability/grafana/dashboards/
```

The observability configuration is intentionally kept in source control so the monitoring environment can be reproduced instead of being configured manually through the Grafana UI.

---

# HTTP Layer

The HTTP layer contains cross-cutting concerns such as:

```text
shared/http/
├── exceptions/
├── filters/
├── interceptors/
├── middleware/
└── throttler/
```

The application uses a centralized exception model with application-level error codes and consistent error handling.

Database-specific errors are mapped into application-level errors rather than leaking infrastructure details directly through HTTP responses.

---

# Configuration

Configuration is centralized under:

```text
shared/infrastructure/config/
```

Environment variables are validated during application startup.

The repository provides environment templates rather than committing environment-specific secrets.

```text
.env.sample
.env.example
```

Actual environment files should remain outside version control.

---

# Database

PostgreSQL is accessed through Prisma.

The database layer is isolated under:

```text
shared/infrastructure/database/prisma/
```

The Prisma client is wrapped by an application-level service so database lifecycle management remains inside the NestJS infrastructure layer.

---

# Redis

Redis is used as shared infrastructure for capabilities such as:

- caching
- queue infrastructure
- distributed coordination
- throttling
- Socket.IO adapter support

Redis lifecycle management is handled explicitly by the application infrastructure layer.

---

# Background Jobs

BullMQ provides background job processing.

The queue infrastructure lives under:

```text
shared/infrastructure/queue/
```

while workers have their own runtime entry point:

```text
apps/worker/main.ts
```

This gives the application a clean boundary between:

```text
request processing
```

and

```text
background processing
```

without requiring a separate repository.

---

# WebSockets

The WebSocket layer is built around Socket.IO.

```text
shared/websocket/
├── base.gateway.ts
├── base.listener.ts
├── rooms.contract.ts
└── socket-io.adapter.ts
```

The abstraction provides a common foundation for:

- gateways
- listeners
- room contracts
- Redis-backed Socket.IO scaling

The Redis adapter allows multiple application instances to participate in the same WebSocket infrastructure.

---

# Runtime Management

Runtime-specific concerns are isolated under:

```text
shared/runtime/
```

including:

- application bootstrap
- health checks
- graceful shutdown
- lifecycle management

Health endpoints are separated from business features so deployment infrastructure can monitor application state without depending on feature modules.

---

# Security & Reliability

The starter includes infrastructure for common backend concerns such as:

- JWT authentication
- password hashing
- request throttling
- Redis-backed throttling
- HTTP rate limiting
- centralized exception handling
- structured logging
- error tracking
- graceful shutdown
- health checks
- environment validation
- database error mapping

These are treated as platform concerns rather than duplicated across individual features.

---

# Technology Stack

| Area                 | Technology            |
| -------------------- | --------------------- |
| Runtime              | Node.js               |
| Language             | TypeScript            |
| Framework            | NestJS                |
| Database             | PostgreSQL            |
| ORM                  | Prisma                |
| Cache / shared state | Redis                 |
| Background jobs      | BullMQ                |
| WebSockets           | Socket.IO             |
| Authentication       | Passport / JWT        |
| Validation           | class-validator / Zod |
| Logging              | Pino / nestjs-pino    |
| Metrics              | OpenTelemetry         |
| Tracing              | OpenTelemetry / Tempo |
| Logs                 | Loki                  |
| Metrics storage      | Prometheus            |
| Telemetry pipeline   | Grafana Alloy         |
| Visualization        | Grafana               |
| Reverse proxy        | Caddy                 |
| Containerization     | Docker Compose        |

---

# Running Locally

## Requirements

- Node.js
- Docker
- Docker Compose
- PostgreSQL / Redis through the provided infrastructure

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

Start the infrastructure:

```bash
docker compose -f infra/app/docker-compose.yml up -d
```

Run database migrations:

```bash
npm run prisma:migrate:dev
```

Start the API:

```bash
npm run start:dev:api
```

Start the worker in another terminal:

```bash
npm run start:dev:worker
```

---

# Observability

The observability environment can be started independently:

```bash
docker compose -f infra/observability/docker-compose.yml up -d
```

This starts the monitoring stack around:

```text
Grafana
Prometheus
Loki
Tempo
Alloy
```

The exact endpoints and credentials are configured through the environment templates under:

```text
infra/observability/
```

---

# Development Commands

```bash
npm run build
```

Build the application.

```bash
npm run start:dev:api
```

Run the API in watch mode.

```bash
npm run start:dev:worker
```

Run the worker in watch mode.

```bash
npm run prisma:generate
```

Generate the Prisma client.

```bash
npm run prisma:migrate:dev
```

Run development migrations.

```bash
npm run prisma:studio
```

Open Prisma Studio.

```bash
npm run format
```

Format source and test files.

---

# Testing Philosophy

This starter intentionally does **not** aim for arbitrary 100% test coverage.

Tests should protect behavior that matters.

The preferred strategy is:

```text
Business rules
      ↓
Critical workflows
      ↓
Infrastructure boundaries
      ↓
Integration tests
      ↓
Selected end-to-end scenarios
```

Simple framework plumbing and trivial wrappers don't automatically deserve tests.

The goal is a test suite that provides meaningful confidence without becoming another application to maintain.

---

# Why This Structure?

The purpose of this repository is not to claim that this is the only correct way to structure NestJS.

It is an opinionated example of how I approach backend systems where the application needs:

- independent API and worker processes
- asynchronous workloads
- persistent relational data
- shared Redis infrastructure
- WebSocket communication
- centralized configuration
- structured error handling
- production observability
- reproducible infrastructure
- operational visibility

The structure intentionally favors **clear boundaries and operational simplicity** over abstraction for its own sake.

---

# Project Status

This repository is a **starter / architecture showcase**.

It is intentionally smaller than a production product and does not attempt to provide every possible business feature.

The focus is the underlying engineering foundation:

```text
Architecture
Infrastructure
Runtime separation
Background processing
Observability
Reliability
Developer experience
```

---

# Author

**Danial Rahmani**

Backend / Systems Engineer

GitHub: [@dnipy](https://github.com/dnipy)

---

## License

This project is currently provided as a personal engineering showcase.
