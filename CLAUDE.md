# CLAUDE.md — Personal Website Project

> This file is the shared project memory for both Claude Code and Cowork.
> Both tools should read this before doing any work in this repository.

## Project overview

This is a personal website built with Astro, deployed to GitHub Pages via GitHub Actions. It serves as a developer portfolio, blog, project showcase, and resume — all in one. The site is part of a larger AI-automated content pipeline involving n8n, Ollama, and Stable Diffusion running on a local Unraid server.

## Architecture

### Hosting: hybrid
- **Public site**: Astro static output → GitHub Pages (free CDN, SSL, zero-maintenance)
- **Automation layer**: n8n + Ollama + Stable Diffusion on Unraid (content pipeline, image generation, monitoring)
- **Dev mirror**: Gitea on Unraid mirrors the GitHub repo for local development
- **Local dev preview**: Nginx on Unraid serves the built site at `REDACTED_HOSTNAME` via Traefik
- **Reverse proxy**: Traefik + Cloudflare Tunnel for any API endpoints exposed from Unraid

### Production deployment flow
1. Content lands in `src/content/` (via Cowork, n8n, or manual edit)
2. Commit pushed to GitHub (via Claude Code, n8n GitHub node, or manual push)
3. GitHub Actions builds Astro (`astro build`)
4. Output deployed to GitHub Pages automatically
5. n8n monitors uptime and alerts via Mattermost

### Local dev deployment flow
1. Commit pushed to Gitea on Unraid
2. Gitea Actions runner builds Astro with `SITE_URL=http://REDACTED_HOSTNAME`
3. Built `dist/` copied to shared volume served by Nginx
4. Site available at `http://REDACTED_HOSTNAME` on LAN via Traefik

## Tech stack

- **Framework**: Astro (latest stable, currently v6.x)
- **Styling**: Tailwind CSS (utility-first, configured in `tailwind.config.mjs`)
- **Interactive islands**: Astro components with `client:*` directives when interactivity is needed. No framework preference — use vanilla JS, Svelte, or React as appropriate for each island. Keep islands minimal.
- **Content**: Astro Content Collections with Zod schemas for type-safe frontmatter
- **Build**: GitHub Actions (`astro build` → `actions/deploy-pages`)
- **Package manager**: npm

## Design system

### Aesthetic direction: bold, colorful, distinctive
This site should NOT look like a typical developer portfolio. No safe gray-on-white templates. No generic hero sections with "Hi, I'm [name]" and a waving hand emoji.

**Design philosophy:**
- Bold color palette with unexpected combinations — think editorial magazine meets creative studio
- Strong typography with personality — distinctive display font paired with a clean body font
- Generous use of color blocks, gradients, and visual texture — but intentional, not chaotic
- Asymmetric layouts that break the grid where it serves the content
- Meaningful motion — page transitions (Astro View Transitions API), scroll-triggered reveals, hover states that reward exploration
- Dark mode as the primary theme with a vibrant light mode alternative

**Color palette** (defined as CSS custom properties in `src/styles/global.css`):
- Colors TBD during initial scaffold — Claude Code should propose a bold, cohesive palette during the first build session. Avoid: purple-gradient-on-white, standard blue/gray corporate palettes, and any scheme that reads as "AI-generated default."
- All colors must pass WCAG AA contrast requirements.

**Typography:**
- Display font: Something with character — geometric, editorial, or expressive. NOT Inter, Roboto, Space Grotesk, or system fonts.
- Body font: Highly readable, clean, pairs well with the display font.
- Monospace: For code blocks and technical content.
- Load via `@fontsource` packages or Google Fonts with `astro-font`.

**Motion:**
- Use Astro View Transitions for page-to-page morph effects
- CSS `@keyframes` for scroll-triggered reveals (use `IntersectionObserver`)
- Keep all animations under 300ms for UI interactions, up to 600ms for page transitions
- Respect `prefers-reduced-motion` — wrap all animations

### Component conventions
- All components live in `src/components/`
- Layouts live in `src/layouts/`
- Use `.astro` components by default. Only use framework components (React/Svelte) when client-side interactivity is genuinely needed.
- Component filenames: PascalCase (`ProjectCard.astro`, `BlogPostLayout.astro`)
- Props should be typed with TypeScript interfaces
- No component should exceed 150 lines — split into sub-components if growing

## Folder structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Buttons, cards, tags, navigation
│   │   ├── sections/        # Hero, about, contact sections
│   │   └── islands/         # Client-hydrated interactive components
│   ├── content/             # Astro Content Collections (Cowork writes here)
│   │   ├── blog/            # Blog posts as .md files
│   │   ├── projects/        # Project case studies as .md files
│   │   └── resume/          # Resume sections as .md or .json files
│   ├── layouts/             # Page layouts (BaseLayout, BlogLayout, etc.)
│   ├── pages/               # Route pages (index, blog, projects, about, etc.)
│   ├── styles/              # Global CSS, Tailwind config, design tokens
│   └── assets/              # Images, fonts, icons (processed by Astro)
├── public/                  # Static files served as-is (favicon, robots.txt)
├── .github/
│   └── workflows/           # GitHub Actions for build + deploy
├── CLAUDE.md                # This file — project memory
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## Content collections schema

### Blog posts (`src/content/blog/*.md`)
```yaml
---
title: string (required)
description: string (required, used for SEO meta and card previews)
pubDate: date (required)
updatedDate: date (optional)
heroImage: string (optional, path to image in src/assets/)
heroImageAlt: string (required if heroImage is set)
tags: string[] (optional, lowercase, kebab-case)
draft: boolean (optional, default false — drafts excluded from production build)
---
```

### Projects (`src/content/projects/*.md`)
```yaml
---
title: string (required)
description: string (required)
thumbnail: string (optional)
thumbnailAlt: string (required if thumbnail is set)
technologies: string[] (required, e.g. ["astro", "docker", "n8n"])
liveUrl: string (optional)
repoUrl: string (optional)
featured: boolean (optional, default false — featured projects appear on homepage)
sortOrder: number (optional, for manual ordering)
---
```

### Resume (`src/content/resume/*.md`)
```yaml
---
section: "experience" | "education" | "skills" | "certifications"
title: string (required)
organization: string (optional)
startDate: date (optional)
endDate: date (optional, null means "present")
sortOrder: number (required)
---
```

## Content guidelines (for Cowork)

When Cowork creates content for this site:

- **Voice**: Technical but approachable. First person. Explain the "why" not just the "what."
- **Blog posts**: 500-1500 words. Include a clear takeaway. Use code snippets where relevant. Always include frontmatter matching the schema above.
- **Project descriptions**: Focus on problems solved, decisions made, and lessons learned — not just feature lists.
- **Formatting**: Use standard markdown. No HTML in content files unless absolutely necessary. Use `![alt](./image.png)` for images.
- **File naming**: kebab-case, date-prefixed for blog posts: `2026-03-28-setting-up-my-homelab.md`
- **Draft workflow**: Set `draft: true` when the post needs review before publishing.

## Deployment rules

- Never push directly to `main` without testing. Use feature branches for structural changes.
- Content-only changes (new .md files in `src/content/`) can go directly to `main` — these are safe because Astro validates content schemas at build time.
- All commits should have descriptive messages: `feat: add project filtering component` or `content: new blog post about Docker migration`
- GitHub Actions will fail the build if content schema validation fails — this is intentional and protective.

## AI tool responsibilities

### Claude Code handles:
- All code changes (components, layouts, pages, config, styles)
- GitHub Actions and CI/CD configuration
- Package management and dependency updates
- Git operations (branching, merging, PRs)
- MCP server integrations (Astro docs, n8n, GitHub)
- Structural refactoring and performance optimization
- Code review of automated content commits

### Cowork handles:
- Blog post drafting and editing
- Project case study writing
- Resume content updates
- SEO research and keyword analysis
- Visual QA (computer use to browse site and verify)
- Content calendar and scheduling
- Competitive analysis and research

### n8n handles (runs 24/7 on Unraid):
- Content pipeline automation (Ollama refinement → Stable Diffusion images → GitHub commit)
- Uptime monitoring and Mattermost alerts
- Broken link checking
- Image optimization before commit
- Webhook triggers for content publishing

## MCP servers to configure

In Claude Code, register these MCP servers:
- **Astro Docs**: `claude mcp add --transport http astro-docs https://mcp.docs.astro.build/mcp`
- **n8n MCP**: Connect to local n8n instance for workflow triggering (configure URL based on Unraid IP)
- **GitHub**: For repo operations if not using git CLI directly

## Placeholder content to include in initial scaffold

Since we're setting up the framework first, include placeholder content so the site is immediately visualizable:

- 3 placeholder blog posts with lorem-style content but realistic frontmatter
- 4 placeholder projects (include the website itself as project #1)
- Resume with placeholder sections for experience, education, skills
- All placeholder images should use generated SVG patterns or solid color blocks (no external placeholder services)

## Notes

- This project prioritizes developer experience and automation. The goal is a site that largely maintains itself through the AI pipeline.
- Performance budget: Lighthouse score ≥ 95 across all categories.
- Accessibility: WCAG AA minimum. Semantic HTML, proper heading hierarchy, alt text on all images.
- The Unraid server is at REDACTED_IP on the local network. Services: n8n, Ollama, Stable Diffusion (open-webui), Gitea, Traefik, Cloudflare Tunnel, Postgres, Mattermost, Immich.
