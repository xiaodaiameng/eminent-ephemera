import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// 移除 vercel 适配器导入（静态站点不需要）

export default defineConfig({
  site: 'https://hexentanz.cn',
  
  integrations: [
    react(),
    tailwind(),
    mdx(),
    sitemap()
  ],
  
  // 完全移除 adapter 配置（使用纯静态模式）
  // output 也移除，默认为 'static'
  
  devToolbar: {
    enabled: false
  },
  
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  },
  
  build: {
    assets: '_astro',  // 默认值，可以保持
  }
});