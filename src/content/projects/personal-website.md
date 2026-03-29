---
title: "Personal Website"
description: "AI-automated personal website built with Astro, with an automated content pipeline powered by local AI and workflow automation"
technologies: ["astro", "tailwind", "typescript", "docker"]
featured: true
sortOrder: 2
---

This website is the project I'm most excited about right now — not because the output is revolutionary, but because of how it's built. The goal was to create a personal site that largely maintains itself through an AI-powered content pipeline, with minimal manual intervention between having an idea and seeing it published.

## Architecture: Hybrid Hosting

The site runs on a split architecture. The public-facing side is a static Astro build deployed to GitHub Pages — free CDN, automatic SSL, zero maintenance. The automation layer runs on my home server, handling workflow orchestration, local LLM inference, and image generation.

## The AI Content Pipeline

The content workflow is where things get interesting. Automated workflows orchestrate the entire pipeline: content ideas get refined through local LLMs, images are generated via AI, and the finished markdown files are committed directly to the repo. Astro validates the content schemas at build time, so malformed content never makes it to production. CI/CD picks up the commit, builds the site, and deploys — all without me touching a keyboard.

## Claude Code and Cowork: Division of Labor

The development work is split between two AI tools. Claude Code handles all the structural engineering — components, layouts, pages, configuration, CI/CD, and code review. Cowork handles the content side — drafting blog posts, writing project case studies, updating resume content, and doing visual QA. This separation keeps each tool focused on what it's good at and means I can iterate on both the codebase and the content in parallel.

## What I Learned

Building this taught me that the hardest part of AI automation isn't the AI — it's the plumbing. Getting the workflow automation, local AI, CI/CD, and the static site framework to work together reliably required careful attention to error handling, content validation, and monitoring.
