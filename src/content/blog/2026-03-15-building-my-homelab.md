---
title: "Building My Homelab: From Spare Parts to Production"
description: "How I turned an old gaming PC and a rack shelf into a fully automated homelab running Docker, Traefik, and a dozen self-hosted services."
pubDate: 2026-03-15
tags: ["homelab", "docker", "self-hosting", "unraid"]
draft: false
---

Every homelab starts with the same thought: "I could just host that myself." For me, it was a Minecraft server. Then it was Nextcloud. Then a media stack. Before I knew it, I had a full rack-mounted Unraid server running 15 containers.

## The Hardware

I started with what I had — an old Ryzen 5 3600, 32GB of DDR4, and a collection of drives I'd accumulated over the years. Nothing fancy, but more than enough for what I needed. The real investment was the case: a Rosewill 4U rackmount that barely fit in my closet.

The beauty of Unraid is that it doesn't care about matching drives. I threw in a 4TB, two 2TBs, and a 1TB SSD for cache. Parity drive handles the redundancy. It's not enterprise-grade, but it's mine.

## The Stack

Here's what's running today:

- **Traefik** as the reverse proxy, handling SSL termination and routing
- **Cloudflare Tunnel** for secure external access without port forwarding
- **Gitea** for local Git hosting and CI/CD
- **n8n** for workflow automation (more on this in a future post)
- **Ollama** running Llama 3 for local AI inference
- **Stable Diffusion** via ComfyUI for image generation
- **Mattermost** for notifications and alerts
- **Postgres** as the shared database backend
- **Immich** for photo backup and management

## Lessons Learned

The biggest lesson? Start simple. I spent weeks perfecting my Docker Compose files before I had a single useful service running. Should've just started with Portainer and iterated.

Second lesson: backups aren't optional. I learned this the hard way when a failed drive update wiped my Plex metadata. Now everything critical gets backed up to Backblaze B2 nightly via a cron job.

Third: monitoring matters. I set up Uptime Kuma early on, and it's saved me multiple times. When a container silently dies at 3 AM, I know about it before my morning coffee.

## What's Next

The current project is building an AI content pipeline that connects n8n, Ollama, and Stable Diffusion to automatically generate and publish blog posts. Yes, this blog is part of that pipeline. More details coming soon.

If you're thinking about starting a homelab, my advice is simple: just start. Pick one service, get it running, and build from there. The rabbit hole is deep, but it's a fun one.
