---
title: "The Best Local LLMs for Your M5 MacBook Pro"
description: "Practical model recommendations for Apple Silicon based on real benchmarks — organized by how much memory you can spare, with context window and temperature guidance."
pubDate: 2026-03-29
tags: ["llm", "apple-silicon", "benchmarks", "lm-studio", "local-ai"]
draft: false
---

I spent the last few weeks running 14 open-weight LLMs through a structured benchmark pipeline on my M5 MacBook Pro with 128 GB of unified memory. The [full project writeup](/projects/m5-macbook-benchmark-pipeline) has the methodology, scoring rubrics, and raw data tables. This post is the practical version: which model should you actually run based on your hardware constraints?

The short answer depends on one thing — how much memory you can dedicate to a model.

## How local LLM memory works on Apple Silicon

On a MacBook, the GPU and CPU share the same unified memory pool. When you load a model in LM Studio, the entire quantized model file gets loaded into this shared memory. A 70 GB model file uses 70 GB of your RAM. That's memory your OS, browser, IDE, and everything else can't use.

A practical rule: **leave at least 16–24 GB free** for the rest of your system. On a 128 GB machine, that means models up to ~104 GB. On a 64 GB machine, you're looking at ~44 GB max. On 32 GB, you have roughly 12–16 GB to work with.

Context window size matters here too. A larger context window requires additional memory beyond the model file itself — roughly 1–2 GB extra per 8K tokens of context for larger models. If you're running a 70 GB model and set a 32K context window, budget 74–78 GB total.

## The recommendations

I tested each model across four benchmark categories — math reasoning, code completion, factual knowledge, and instruction following — at three temperature settings, scoring over 2,400 total prompt runs. Here's what to run at each memory tier.

### If you have 100+ GB to spare

**Best overall: Qwen3.5 122B MoE** — 69.6 GB (MLX 4-bit) or 73.5 GB (GGUF Q4_K_S)

This was the only model to score a perfect 1.00 rubric average across every category. It nailed math, code, factual knowledge, and instruction following without a single weakness. As a mixture-of-experts model, it's also faster than you'd expect for its parameter count — 43.7 tok/s in MLX, 31.7 tok/s in GGUF.

If you want to push the boundary: **MiniMax M2.5 229B** (100.1 GB MLX, 101 GB GGUF) scored 0.98 and runs at 45.7 tok/s in MLX. It's the largest model I tested and the fact that it runs at all — let alone faster than many smaller models — is a testament to what 128 GB of unified memory enables.

**Runner-up: Nemotron Super ~120B** — 85 GB (GGUF Q4_K_M only, no MLX available). Scored 0.98, strong across all categories but especially math. At 27.6 tok/s it's slower than Qwen3.5, so unless you specifically need what Nemotron offers, Qwen3.5 is the better default.

### If you have 55–80 GB to spare

**Best pick: GPT-OSS 120B** — 58.5 GB (GGUF MXFP4) or 63.4 GB (MLX MXFP4)

At 0.95–0.98 accuracy with 63–66 tok/s throughput, GPT-OSS offers an unusual combination: near-top accuracy at the highest speed of any large model. It was the IFEval leader (0.99) and ran 2x faster than Qwen3.5.

**Alternative: Llama 4 Scout 109B MoE** — 61.3 GB (GGUF) or 61.1 GB (MLX). Scored 0.90–0.93 accuracy. Strong at math (1.00 GSM8K in GGUF) but weaker on instruction following. Choose this if your workload is reasoning-heavy.

### If you have 35–55 GB to spare

**Best pick: Llama 3.3 70B** — 39.7 GB (both GGUF and MLX)

Scored 0.86–0.90 accuracy. Solid all-rounder but notably slow — 7.5 tok/s in GGUF, 9.0 tok/s in MLX. This is the largest dense (non-MoE) model I tested, and the throughput reflects it. If you can tolerate the speed, the accuracy is worth it. If not, drop down a tier.

### If you have 15–35 GB to spare

This is the sweet spot for most people. Several models in this range punch well above their weight.

**Best accuracy: DeepSeek R1 32B** — 18.0 GB (GGUF) or 18.4 GB (MLX). Scored 0.88–0.91, the highest in this size tier. It's a reasoning model that emits chain-of-thought in `<think>` blocks before answering, which means responses take longer but are more carefully considered. Throughput is modest: 15.8 tok/s (GGUF), 12.5 tok/s (MLX).

**Best speed at this accuracy: Qwen2.5 Coder 32B** — 18.3 GB (MLX 4-bit only). Scored 0.91 at 19.4 tok/s. If you're doing code-heavy work and don't need GGUF, this is the pick.

**Balanced option: Mistral Small 24B** — 13.5 GB (GGUF) or 14.1 GB (MLX). Scored 0.88–0.90 at 22–28 tok/s. Faster than DeepSeek R1 with nearly the same accuracy, and small enough to leave plenty of room for other applications.

### If you have under 15 GB to spare

**Best pick: Qwen2.5 VL 7B** — 4.8 GB (GGUF Q4_K_M)

This is the efficiency champion of the entire benchmark. At 0.90 accuracy and 69.8 tok/s, it outperformed models 3–8x its size. The GGUF version is the one to use — the MLX 8-bit variant (9.0 GB) is nearly twice the size and almost half the speed (38.1 tok/s), though accuracy ticks up slightly to 0.91.

For context: Qwen2.5 VL 7B at 4.8 GB matched Mistral Small 24B (13.5 GB) in accuracy while running 3x faster. If you're on a 32 GB MacBook or just want a lightweight model that stays out of the way, this is the one.

**For code specifically: Qwen2.5 Coder 7B** — 8.1 GB (MLX 8-bit). Scored 0.83 at 54 tok/s. Lower accuracy but very fast for code completion tasks. **DeepSeek Coder V2 Lite** at 8.8 GB is even faster (127–144 tok/s) but scored 0.82–0.85.

## Quick reference table

| Memory Budget | Model | Format | GB | tok/s | Accuracy |
|--------------|-------|--------|-----|-------|----------|
| 100+ GB | Qwen3.5 122B MoE | MLX 4-bit | 69.6 | 43.7 | 1.00 |
| 55–80 GB | GPT-OSS 120B | GGUF MXFP4 | 58.5 | 65.9 | 0.95 |
| 35–55 GB | Llama 3.3 70B | MLX 4-bit | 39.7 | 9.0 | 0.90 |
| 15–35 GB | DeepSeek R1 32B | MLX 4-bit | 18.4 | 12.5 | 0.91 |
| 15–35 GB | Mistral Small 24B | MLX 4-bit | 14.1 | 28.0 | 0.88 |
| Under 15 GB | Qwen2.5 VL 7B | GGUF Q4_K_M | 4.8 | 69.8 | 0.90 |

## Context window: what you need to know

Every model I tested was loaded with a specific context length via `lms load --context-length N`. Larger context windows let the model "see" more of your conversation or document, but they cost memory and can reduce throughput.

**For most local tasks — chat, code completion, quick questions — 4K to 8K context is plenty.** You'll get the best speed at these sizes.

**For long documents, multi-file code analysis, or extended conversations**, you'll want 16K–32K. Most models in this benchmark support at least 32K. Qwen2.5 14B 1M theoretically supports up to 1 million tokens, though at that length the memory and speed tradeoffs are severe.

**Practical guidance:**
- Start with 8K context. It covers 90% of use cases.
- If you're hitting the limit (the model starts "forgetting" earlier parts of the conversation), bump to 16K or 32K.
- Every doubling of context length adds memory overhead. On large models (70B+), going from 8K to 32K can add 4–8 GB of memory usage.
- If you're choosing between a bigger model at 8K context or a smaller model at 32K context, the bigger model at 8K will usually give you better answers. Model quality matters more than context length for most tasks.

## Temperature: when to change it

Temperature controls how "creative" or "random" the model's outputs are. I tested every model at three settings: 0.0, 0.3, and 0.7.

**T=0.0 (deterministic):** The model always picks the most likely next token. Use this for factual questions, math, code, and anything where you want the same answer every time. Most models scored their best accuracy here.

**T=0.3 (low variance):** Slightly more variation in phrasing but still reliable. This is my default for general use — the responses feel more natural without sacrificing accuracy.

**T=0.7 (creative):** Noticeably more diverse outputs. Some models handled this well (Qwen3.5, Nemotron), while others started making errors they wouldn't make at lower temperatures. Use this for brainstorming, creative writing, or when you want to see different perspectives on a problem.

**The rule of thumb:** Use 0.0–0.3 for tasks with correct answers (math, code, factual lookups). Use 0.5–0.7 for tasks where variety is valuable (writing, ideation, exploration). The top-performing models in my benchmark maintained high accuracy even at T=0.7, which is one reason they ranked highest — they're robust across the full temperature range.

## GGUF vs MLX: which format to use

Both formats are quantized model files that run on Apple Silicon. The practical differences:

- **MLX was faster for 6 of 11 models** I tested, with speedups up to 38%. If your model is available in MLX, try it first.
- **GGUF was faster for 5 of 11 models**, sometimes dramatically — Qwen2.5 VL 7B ran 45% faster in GGUF than MLX.
- **Accuracy differences were minimal** — within 1–3% between formats for the same model.
- **GGUF has wider model availability.** Not every model has an MLX version.

My recommendation: check if your model has both formats available in LM Studio. Try MLX first. If it feels slow, switch to GGUF. The accuracy difference is negligible either way.

## Bottom line

You don't need a cloud API to get strong LLM performance. A MacBook with 128 GB of unified memory can run 229-billion-parameter models locally. But the sweet spot isn't always the biggest model — Qwen2.5 VL 7B at 4.8 GB delivered 90% of the accuracy of models 20x its size, at 70 tokens per second.

Pick your model based on your memory budget, start with 8K context and T=0.3, and adjust from there. The [full benchmark data](/projects/m5-macbook-benchmark-pipeline) is available if you want to dig into per-category scores or format comparisons.
