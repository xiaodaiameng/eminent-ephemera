// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),  // 添加这行！重要！
    updated: z.date().optional(),  // 需要更新时间的话
  }),
});

export const collections = {
  'blog': blogCollection,
};