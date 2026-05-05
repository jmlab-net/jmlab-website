import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    relatedProject: z.object({
      slug: z.string(),
      title: z.string(),
      description: z.string(),
    }).optional(),
    relatedPosts: z.array(z.object({
      slug: z.string(),
      title: z.string(),
    })).optional(),
  }),
});

const travel = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/travel' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    location: z.object({
      city: z.string(),
      country: z.string(),
      countryCode: z.string().length(2),
      lat: z.number(),
      lon: z.number(),
    }),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    gpxTrack: z.string().optional(),
    companions: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string().optional(),
    thumbnailAlt: z.string().optional(),
    technologies: z.array(z.string()),
    liveUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    featured: z.boolean().default(false),
    sortOrder: z.number().optional(),
  }),
});

const resume = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resume' }),
  schema: z.object({
    section: z.enum(['about', 'experience', 'education', 'skills', 'certifications']),
    title: z.string(),
    specialty: z.string().optional(),
    organization: z.string().optional(),
    location: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().nullable().optional(),
    sortOrder: z.number(),
  }),
});

export const collections = { blog, travel, projects, resume };
