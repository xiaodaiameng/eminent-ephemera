// Environment Declaration Types 环境声明类型文件
/// <reference types="astro/client" />

// Astro 的全局类型声明
/// <reference types="astro/global" />

// 声明 MDX 文件的类型
declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export const frontmatter: any;
  export const file: any;
  export const url: any;
  export default MDXComponent;
}

// 声明 Astro 组件的类型
declare module '*.astro' {
  interface AstroComponentFactory {
    (props: any): any;
    isAstroComponentFactory?: boolean;
  }
  const Component: AstroComponentFactory;
  export default Component;
}

// 自定义全局事件类型
type SnowEvent = CustomEvent<{ enable: boolean }>;
type MusicEvent = CustomEvent<{ enable: boolean; volume?: number }>;
type VolumeEvent = CustomEvent<{ volume: number }>;

// 扩展全局窗口对象
interface Window {
  // 功能控制
  toggleSnow?: (enabled: boolean) => void;
  toggleMusic?: (enabled: boolean, volume?: number) => void;
  adjustVolume?: (volume: number) => void;
  
  // 全局状态
  isSnowEnabled?: boolean;
  isMusicPlaying?: boolean;
  currentMusicVolume?: number;
}

// 扩展全局事件
declare global {
  interface WindowEventMap {
    'toggleSnow': SnowEvent;
    'toggleMusic': MusicEvent;
    'adjustVolume': VolumeEvent;
  }
  
  // 为 DOM 元素添加自定义属性
  namespace JSX {
    interface IntrinsicAttributes {
      'client:load'?: boolean;
      'client:idle'?: boolean;
      'client:visible'?: boolean;
      'client:only'?: string;
    }
  }
}

// 导出空的类型（确保这是一个模块）
export {};