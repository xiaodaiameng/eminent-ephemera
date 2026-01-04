import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://hexentanz.cn',
  
  integrations: [
    react(),
    tailwind(),
    mdx(),
    sitemap()
  ],
  
  // 部署到 Vercel
  adapter: vercel(),
  
  // 输出类型
  output: 'server',
  
  // 开发工具
  devToolbar: {
    enabled: true
  },
  
  // Markdown 配置（数学公式）
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  }
});