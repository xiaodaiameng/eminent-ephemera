// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // 只需要标题，时间自动获取
  }),
});

export const collections = {
  'blog': blogCollection,
};