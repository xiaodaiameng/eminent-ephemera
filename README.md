## 🚀 Project Structure
\src>tree /f
D:.
│  env.d.ts
│
├─components
│  ├─layout
│  │      Footer.astro
│  │      Header.astro
│  │      Loading.astro
│  │      Sidebar.astro
│  │
│  └─ui
│          Clicks.astro
│          MusicPlayer.astro
│          SnowControl.astro
│          ThemeToggle.astro
│
├─content
│  │  config.ts
│  │
│  └─blog
│      ├─个体
│      │      oldwrites.md
│      │      somethingnormal.md
│      │
│      ├─学习
│      │      asmasm.md
│      │      computernetwork.md
│      │      database.md
│      │      english.md
│      │      huaweinetwork.md
│      │      marxism.md
│      │
│      └─社交
│              family_relationships.md
│              social_community.md
│
├─layouts
│      BaseLayout.astro
│
├─pages
│  │  404.astro
│  │  about.astro
│  │  blog.astro
│  │  index.astro
│  │  oldblogpages.astro
│  │
│  └─blog
│          [...slug].astro
│          个体.astro
│          学习.astro
│          社交.astro
│
└─styles
        blog.css
        global.css
        mddisplay.css
        oldblogpages.css
        sidebar.css