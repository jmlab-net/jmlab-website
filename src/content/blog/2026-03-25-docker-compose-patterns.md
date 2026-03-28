---
title: "Docker Compose Patterns I Actually Use"
description: "Battle-tested Docker Compose patterns for networking, secrets management, health checks, and multi-service orchestration in a homelab environment."
pubDate: 2026-03-25
tags: ["docker", "devops", "self-hosting", "patterns"]
draft: false
---

Every Docker tutorial shows you the basics: a service, a port, maybe a volume. But real-world Compose files are messier than that. After running 15+ services in production on my homelab for over a year, here are the patterns I keep coming back to.

## Pattern 1: Shared Networks with Traefik

Instead of exposing ports directly, I route everything through Traefik. Every service joins a shared `proxy` network, and Traefik handles routing based on labels.

```yaml
networks:
  proxy:
    external: true
  internal:
    driver: bridge

services:
  app:
    image: myapp:latest
    networks:
      - proxy
      - internal
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`app.local`)"
      - "traefik.http.routers.app.tls.certresolver=cloudflare"
```

The key insight: services that need to talk to each other share an `internal` network. Only services that need external access join `proxy`. This minimizes attack surface.

## Pattern 2: Health Checks That Actually Work

Default health checks are often too simple. I use multi-condition checks that verify the service is actually functional, not just that the process is running.

```yaml
services:
  postgres:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
```

The `start_period` is crucial — it gives the service time to initialize before health checks start failing. Without it, dependent services see a "unhealthy" status and refuse to start.

## Pattern 3: Secrets via Environment Files

Never hardcode secrets in your Compose file. I use `.env` files with restrictive permissions and reference them explicitly:

```yaml
services:
  app:
    env_file:
      - ./secrets/app.env
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info
```

The `secrets/` directory is in `.gitignore` and backed up separately. Each service gets its own env file — no shared secrets file that becomes a single point of compromise.

## Pattern 4: Depends-On with Conditions

The `depends_on` key alone isn't enough. You need conditions that wait for actual readiness:

```yaml
services:
  app:
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
```

Combined with proper health checks, this eliminates the "connection refused" errors that plague multi-service setups.

## Pattern 5: Resource Limits

Without limits, one runaway container can starve everything else. I set explicit memory and CPU limits on every service:

```yaml
services:
  ollama:
    deploy:
      resources:
        limits:
          memory: 16G
          cpus: "8.0"
        reservations:
          memory: 8G
          cpus: "4.0"
```

The `reservations` ensure the service always has minimum resources available, even under contention.

## The Meta-Pattern

The real pattern underlying all of these is: **treat your homelab like production**. Health checks, resource limits, proper networking, secrets management — these aren't overkill for a home setup. They're what keep your services running at 3 AM when you're asleep.
