---
title: "Automating My Content Pipeline with n8n and Ollama"
description: "A deep dive into building an AI-powered content pipeline that drafts, refines, illustrates, and publishes blog posts with minimal human intervention."
pubDate: 2026-03-20
tags: ["ai", "n8n", "automation", "ollama"]
draft: false
---

What if your blog could write itself? Not the garbage, SEO-stuffed kind of auto-generated content, but genuinely useful technical posts refined by AI and reviewed by a human. That's what I've been building.

## The Architecture

The pipeline lives entirely on my Unraid homelab and connects four main pieces:

1. **n8n** orchestrates everything — triggers, data flow, API calls, and Git operations
2. **Ollama** (running Llama 3 70B) handles content drafting and refinement
3. **Stable Diffusion** (via ComfyUI API) generates hero images
4. **GitHub API** commits the finished content and triggers deployment

The flow looks like this: a webhook or schedule triggers n8n, which prompts Ollama with a topic and outline. The draft goes through two refinement passes — one for technical accuracy, one for voice and readability. Then Stable Diffusion generates a hero image based on the post's theme. Finally, n8n commits everything to the GitHub repo, and Astro builds and deploys automatically.

## The Refinement Loop

The trick to making AI-generated content not sound like AI-generated content is iterative refinement with specific prompts. The first pass is a brain dump — get the ideas on paper. The second pass restructures for flow and adds code examples. The third pass adjusts the voice to match my writing style (trained on my previous posts).

```
// Simplified n8n expression for the refinement prompt
const refinePrompt = `
Rewrite this technical blog post to match this voice:
- First person, conversational but precise
- Short paragraphs, clear transitions
- Show don't tell — use code snippets
- End sections with a practical takeaway

Draft to refine:
${$json.draft}
`;
```

## Quality Gates

Not everything gets published automatically. n8n runs a quality check node that scores the post on readability (Flesch-Kincaid), technical depth (keyword density for the topic), and originality (similarity check against existing posts). Posts below the threshold get flagged for human review instead of auto-publishing.

## Results So Far

After two weeks of running the pipeline, it's produced eight draft posts. Five passed quality gates and were published directly. Three got flagged for review — two needed minor edits, one was scrapped entirely.

The time savings are real: what used to take me 3-4 hours per post now takes about 30 minutes of review time. The AI handles the scaffolding; I handle the soul.

## What I'd Do Differently

I over-engineered the image generation pipeline. A simple gradient or pattern would've been fine for most posts. The ComfyUI integration added complexity that wasn't worth it for the visual quality improvement.

Also, prompt engineering is an ongoing process, not a one-time setup. I've already revised my prompts six times, and they're still not perfect.
