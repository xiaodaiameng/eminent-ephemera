import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://eminent-ephemera-2szi.vercel.app',  // 使用你的vercel域名
  
  integrations: [
    react(),
    tailwind(),
    mdx(),
    sitemap()
  ],
  
  output: 'static',  // 如果是静态站点
  
  // 如果是SSR，使用这个配置：
  // output: 'server',
  // adapter: vercel(),
  
  devToolbar: {
    enabled: false
  },
  
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  },
  
  vite: {
    build: {
      assetsInlineLimit: 0  // 确保资源不被内联
    }
  }
});